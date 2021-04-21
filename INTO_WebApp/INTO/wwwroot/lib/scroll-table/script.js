// variable incremented in $(document).ready() for paging
var page = 1;
const pageSize = 10;
let isScrollVisible = false;
let timer=null;
// ajax request processed => shouldn't have 2 requests sent at same time
var isFetchingPage = false;
var spinner = null;
var remainingPages = 0;
// variable assigned in getTable() function
var tblColsCount = 0;

getSpinner = function(nbCols=tblColsCount){
    if (spinner === null) {
        const loader = $('<div>', { class: 'spinner-border', role: 'status' });
        const subLoader = $('<span>', { class: 'sr-only' });
        const tr = $('<tr id="spinner">')
        const td = $('<td>')
        subLoader.text('Loading...');
        loader.append(subLoader);
        td.append(loader);
        tr.append(td);
        tr.width='100%'
        td.css('text-align','center')
        spinner = $(tr);
    }
    spinner.find('td').attr('colspan', nbCols);
    return spinner;
}



fetchPage = function (params, dataTarget) {
    if (isFetchingPage) {
        return;
    }
    isFetchingPage = true;
    //auto scroll to show spinner
    dataTarget.scrollTop(dataTarget[0].scrollHeight);
    $.ajax({
        url: '/TutorDashboard/GetNotifications',
        type: "POST",
        data: params,
        success: function (data) {
            dataAcquired(data, dataTarget);
        },
        fail: function () {
            console.log("fetchP: error occurred");
        }
    });
}

dataAcquired = function (response, dataTarget) {

    // If the data has 2 fields : Content and Extras 
    var data = response.content;
    remainingPages = response.extras["RemainingPages"];
    // if it is the first call, build table with headers
    if (page === 1) {
        populate(data, "dataTarget")
    }
    // else build table without headers
    else {
        //tbody selector ='#id'|'.class'|'tag_name', which is queried(searched) for in the html Document.
        addrows(data, "#tblData tbody")
        dataTarget.scrollTop(dataTarget.scrollTop() + (dataTarget.scrollTop() + ((dataTarget[0].scrollHeight - dataTarget.height() - dataTarget.scrollTop()) / 3)));
    }
    getSpinner().remove();
    // if there is no more data

    if (parseInt(remainingPages) <= 0) {
        buildLastPage(data, dataTarget);
    }
    // if there is more pages
    else {
        buildPage(dataTarget);
    }
}

buildLastPage = function (content, dataTarget) {
    if (page === 1 && content.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'No Data In The Table',
        })
        dataTarget.find('table')
            .append(
                $('<tr>')
                    .append($('<td>'))
                    .find('td')
                    .text('No Data In The Table')
                    .css({ 'color': 'red', 'font-size': '4rem' })
            )
    } else {
        Swal.fire({
            icon: 'info',
            title: 'End Of Table',
        })
    }
    page = -1;
}

buildPage = function (dataTarget) {
    page = page + 1;
    isFetchingPage = false;
    if ((dataTarget.scrollTop() == dataTarget[0].scrollHeight - dataTarget.height())
        && dataTarget[0].scrollHeight <= dataTarget.height()) {
        fetchPage({ 'page': page, pageSize: pageSize }, dataTarget);
        $('#tblData tbody').append(getSpinner());
    }
}

populate = function (response, targetId) {
    if (targetId !== null && targetId.length > 0) {
        if (response.length > 0) {
            const display = getTable(response);
            let target = document.getElementById(targetId);
            if (target !== null && display !== null) {
                // if table already exists, it will be removed then reallocated
                $('#tblData').remove();
                target.appendChild(display);
            }
        }
    }
    return response.length;
}

getTable = function (response) {
    var tbl = document.createElement("table");
    ["table", "table-hover", "table-striped"].forEach(cls => tbl.classList.add(cls));
    tbl.id = "tblData";
    tbl.style.width = "100%";
    // creation of table basics
    var tbdy = tbl.createTBody();
    var headers = Object.keys(response[0]);
    tblColsCount = headers.length;
    var thead = tbl.createTHead();
    // creation of headers
    var tr = document.createElement('tr');
    headers.forEach(function (p) {
        var th = document.createElement('th');
        th.appendChild(document.createTextNode(p));
        tr.appendChild(th);
    })
    thead.appendChild(tr);
    //appending the head and body to table
    addrows(response, tbl);
    tbl.appendChild(thead);
    return tbl;
}

//tbody selector ='#id'|'.class'|'tag_name', which is queried(searched) for in the html Document.
addrows = function (response, tbodySelector) {
    if (response.length > 0) {
        const tbl = $(tbodySelector);
        var headers = Object.keys(response[0]);
        tblColsCount = headers.length;
        for (i = 0; i < response.length; i++) {
            let object = response[i];
            var tr = document.createElement('tr');
            tr.setAttribute('id', object.id);
            headers.forEach(hdr => {
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(response[i][hdr]));
                tr.appendChild(td);
            });
            tbl.append(tr);
        }
    }
}

scrollEnded = function (dataTarget) {
    //scroll top = the distance from the beginning of the "scroll" till the top of the viewed 
    //dataTarget[0].scrollHeight, [0] since we are using jquery selector which returns an Array of found objects,
    //scrollHeight is the real total height of the div without the scroll
    //dataTarget.height() is the height of the visible section of the div
    if (dataTarget.scrollTop() == dataTarget[0].scrollHeight - dataTarget.height()) {
        if (remainingPages > 0) {
            $('#tblData tbody').append(getSpinner());
            fetchPage({ 'page': page, pageSize: pageSize }, dataTarget);
        }
    }
}

routePath = function (response, targetId, params) {
    if (targetId === null || targetId === undefined || !((targetId instanceof String || Object.getPrototypeOf(targetId) === String.prototype))) { return; }
    if (response === null) {
        targetID.empty();
        return;
    }
    else if (Array.isArray(response)) {
        populate(response, targetId);
    }
    else {
        const reqUrl = new URL(response);
        if (reqUrl === null) { return; }
        $.ajax({
            url: reqUrl,
            type: "POST",
            data: params,
            success: function (data) {

            }
        });

    }

}

//used for Razor concept
print = function (msg) {
    console.log(msg);
};

// pops a toast when user added successfully
function toastOnSuccess() {
    //toast of class: toast-container
    $('.toast-container').empty().append(
        '<div id="addeduser" class="toast" data-delay="10000" role="alert" aria-live="assertive" aria-atomic="true">' +
        '<div class= "toast-header" style=" top: 5; right: 10;>' +
        '<strong class="mr-auto">Success</strong>' +
        //'<small>11 mins ago</small>' +
        '<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">' +
        //'<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '</div>' +
        '<div class="toast-body">' +
        'User added successfully' +
        '</div>' +
        '</div>')
    // show toast
    $("#addeduser").toast('show');

};

// when clicking on the row, ajax request is sent with specified Id, ModalHandler is called on success
function addTableRowOnClickEvent() {
    $(document).on('click', 'tbody > tr', function () {
        const trId = this.id;
        $.ajax({
            url: '/Home/GetObj',
            type: "POST",
            data: {
                id: trId
            },
            success: function (response) {
                if (response.length != 0) {
                    ModalHandler(response[0].id, response[0].name, response[0].description, response[0].code)
                }
            }
        });
    })
}

// add new user: ajax request is sent with the filled data
function addUser() {
    //getting values from textboxes
    const n = $("#swal2-content").find('#name').val();
    const d = $("#swal2-content").find('#desc').val();
    const c = $("#swal2-content").find('#code').val();
    //sending values to controller
    $.ajax({
        url: '/Home/AddObj',
        type: "POST",
        data: {
            name: n,
            desc: d,
            code: c
        },
        success: function (response) {
            if (response !== -1) {
                // successfully added
                Swal.fire(
                    'User Added',
                    'User of id= ' + response + ' was added',
                    'success'
                )
                // new row to be inserted
                var row = '<tr id="' + response + '"><td>' + response + '</td><td>' + n + '</td><td>' + d + '</td><td>' + c + '</td></tr>'
                // storing the added object in TempData
                //var TestObj = { id: response, Name: n, Description: d, Code: c };
                //TempData["storedObj"] = TestObj;
                // header of the table
                var header = '<tr><td>Id</td><td>Name</td><td>Description</td><td>Code</td></tr>'
                // capturing the first row
                var firstRow = $("#tempObjs tbody tr:first");
                // if the table already contains data, just add the row
                if (firstRow.length !== 0) {
                    firstRow.before(row);
                }
                // if the added user is the first user, invoke fetchData() function or append header row and new row
                else {
                    // update the table
                    fetchData();

                }
            } else {
                //error occurs during adding
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                })
            }

            //toastOnSuccess();
        }
    });
}

// reads the ajax request , fill the modal with the given values and handle the modal functions
function ModalHandler(id, name, desc, code) {
    $('#tableModal').on('show.bs.modal', function (e) {
        modal = $(this);
        modal.find('#id').text(id);
        modal.find('#name').val(name);
        modal.find('#code').val(code);
        modal.find('#desc').val(desc);
        modal.find('#deleteBtn').off('click').on('click', function () {
            const delID = id;
            $.ajax({
                url: '/Home/DeleteObj',
                type: "POST",
                data: {
                    id: delID
                },
                success: function (response) {
                    if (response !== 0) {
                        // successfully deleted
                        Swal.fire(
                            'User Deleted',
                            'success'
                        )
                        // row to be deleted
                        $('#' + delID).remove();
                    }
                    else {
                        //error occurs during adding
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                        })
                    }
                    modal.modal('hide');
                }
            });
        });
        //console.log("show occurred")
    }).on('shown.bs.modal', function () {
        //console.log("shown occurred")
    }).on('hide.bs.modal', function () {
        //console.log("hide occurred")
    }).on('hidden.bs.modal', function () {
        // console.log("hidden occurred")
    }).modal({
        keyboard: true,
        backdrop: "static",
        show: true,
    });
}

fetchData = function (params) {
    $.ajax({
        url: '/Home/GetObj',
        type: "POST",
        data: params,
        success: function (data, text) { populate(data, "dataTarget") },
        fail: function () {
            console.log("fetch: error occurred");
        }
    });
}