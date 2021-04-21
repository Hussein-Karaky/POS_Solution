// variable incremented in $(document).ready() for paging
var page = 1;
const pageSize = 10;
let isScrollVisible = false;
let timer = null;
// ajax request processed => shouldn't have 2 requests sent at same time
var isFetchingPage = false;
var spinner = null;
var remainingPages = 0;
// variable assigned in getTable() function
var tblColsCount = 0;

/**
 * 
 * @param {any} targetId
 * @param {any} dataSource
 * @param {any} options consumer must assign the variable named in <remainingField> the number of remaining pages
 *                      Eg. if the response from the service was like extra: { remainingPages: 2} the remainingField
 *                      must be equal to 'remainingPages'
 *                      Note: assuming that resonse has the following structure {extras, content}
 * @param {any} uiType
 */
function DataContainer(
    targetId = null,
    dataSource = null,
    options = {

    },
    uiType = "table"
) {
    let defaultOptions = {
        paging: {
            enabled: false, remainingField: "", pageSize: 0, page: 1
        },
        main_classes: ['text-center'],
        no_more_data: "End Of Table",
        clearInit: false
    }
    this.id = window.performance.now();
    this.targetId = targetId;
    this.dataSource = dataSource;
    this.options = { ...defaultOptions, ...options };
    this.options.uiType = uiType;
    this.data = null;
    this.paging = { remainigPages: 0 };
    this.isFetchingPage = false;
    this.nbOfCols = 0;
    this.fetched = false;
}

Object.defineProperty(DataContainer.prototype, "constructor", {
    value: DataContainer,
    writable: true,
    enumerable: true,
    configurable: true
});

DataContainer.prototype.dataBind = function () {
    if (this.isFetchingPage) {
        return;
    }
    if (
        this.targetId === undefined ||
        this.targetId === null ||
        !(this.targetId instanceof String ||
            Object.getPrototypeOf(this.targetId) === String.prototype)
    ) {
        return;
    }
    if (this.dataSource === undefined || this.dataSource === null) {
        let id = this.constructor.name.concat("_main_").concat(this.id);
        let div = document.getElementById(id);
        // if the dataSource is null and the div is created, clear it
        if (div !== undefined && div !== null) {
            div.innerHTML = "";
        }
        return;
    }
    if (Array.isArray(this.dataSource)) {
        this.data = this.dataSource;
        this.create();
        return;
    }

    this.callAjax();

}


DataContainer.prototype.callAjax = function () {
    if (this.isFetchingPage) {
        return;
    }
    this.isFetchingPage = true;
    let main = this;
    let reqUrl = new URL(main.dataSource);
    if (reqUrl === null) {
        let id = main.constructor.name.concat("_main_").concat(main.id);
        let div = document.getElementById(id);
        // if the URL is null and the div is created, clear it
        if (div !== undefined && div !== null) {
            div.innerHTML = "";
        }
        this.isFetchingPage = false;
        return;
    }

    let params = "";
    if (main.options.paging.enabled === false) {
        params = { page: main.options.paging.page, pageSize: 0 }
    }
    else {
        params = { page: main.options.paging.page, pageSize: main.options.paging.pageSize }
    }
    $.ajax({
        url: reqUrl,
        type: "POST",
        data: params,
        success: function (response) {

            // if response.content is not array => so response is array (not generic)
            if (!(Array.isArray(response.content)) && Array.isArray(response)) {
                main.data = response;
                main.create();
            }
            // so it is generic: has content and extras
            else if (Array.isArray(response.content)) {
                main.data = response.content;
                main.paging.remainigPages = response.extras[main.options.paging.remainingField];
                let target = document.getElementById(main.targetId);
                if (target != null && main.fetched === false && main.options.clearInit === true) {
                    target.innerHTML = "";
                }
                if (main.data.length < 1 && main.fetched === false && main.paging.remainigPages <= 0) {
                    main.paging.page = -1;
                    let div = document.createElement('div');
                    div.innerHTML = "<h3>No Notifications Yet</h3>";
                    if (target != null) {
                        target.appendChild(div);
                    }
                    main.fetched = true;
                    return;
                }
                main.fetched = true;
                main.paging.remainigPages = response.extras[main.options.paging.remainingField];
                main.create();
                getTableSpinner().remove();
                if (main.options.paging.enabled) {
                    let id = main.constructor.name.concat("_main_").concat(main.id);
                    let div = $('#' + id);
                    if (main.paging.remainigPages >= 0) {
                        main.options.paging.page = main.options.paging.page + 1;
                        if (main.paging.remainigPages > 0 && div[0].scrollHeight <= div.height() && (div.scrollTop() == div[0].scrollHeight - div.height())) {
                            main.isFetchingPage = false;
                            main.callAjax();
                            div.children('table').children('tbody').append(getTableSpinner(main.nbOfCols));
                        } else if (main.paging.remainigPages > 0) {
                            main.isFetchingPage = false;
                        }
                    }
                    if (main.paging.remainigPages <= 0 && main.options.paging.page != -1) { //end of pages
                        main.options.paging.page = -1;
                        if (main.options.no_more_data != undefined && main.options.no_more_data != null) {
                            div.children('table').children('tbody').append('<tr style="text-align:center"><td colspan="' + main.nbOfCols + '">' + main.options.no_more_data + '</td></tr>')
                        }
                    }
                }
            }
            else {
                alert("error: Unknown response format");
                return;
            }
        },
        error: function () { return; }
    });
}

DataContainer.prototype.create = function () {
    if (this.targetId !== null && this.targetId.length > 0) {
        if (this.data.length > 0) {
            let display = this.getDisplay();
            let target = document.getElementById(this.targetId);
            if (target !== null && display !== null) {
                target.appendChild(display);
            }
        }
    }
}

DataContainer.prototype.getDisplay = function () {
    let id = this.constructor.name.concat("_main_").concat(this.id);
    let main = document.getElementById(id);

    // if the div id is not found, create one
    if (main === undefined || main === null) {
        main = document.createElement("div");
        main.setAttribute('id', id);
        main.classList.add(this.options.main_classes);
        //main.style.textAlign = "center";
        main.setAttribute('dataId', this.data);
        // main: targetElemnt, 30em: max height
        scrollanim = new ScrollAnimation(main, '30em');
        scrollanim.init();
    }

    let innerId = this.constructor.name.concat("_inner_").concat(this.id);
    let inner = document.getElementById(innerId);
    let obj = this;
    if (inner === undefined || inner === null) {
        switch (this.options.uiType.toLowerCase()) {
            case "table":
            case "table-cards":
                inner = this.getTable(innerId);
                main.appendChild(inner);
                let div = $(main);
                if (obj.options.paging.enabled) {
                    this.setUpPagingScroll(div, obj.options.paging.pageSize, obj.options.paging.page, obj.options.paging.remainingField);
                }
                break;

            default:
                inner = document.createElement("span");
                inner.innerHTML = "Type Undefiend";
                inner.style = "color: red;font-size:2rem;width=100%;"
                main.innerHTML = "";
                main.appendChild(inner);
        }
    }
    else {
        switch (this.options.uiType.toLowerCase()) {
            case "table":
            case "table-cards":
                if (!this.options.paging.enabled) {
                    inner = this.getTable(innerId);
                    main.appendChild(inner);
                    break;
                }

                this.addrows(inner);
                main = null;
                break;

            default:
                inner = document.createElement("span");
                inner.innerHTML = "Type Undefiend";
                inner.style = "color: red;font-size:2rem;width=100%;"
                main.innerHTML = "";
                main.appendChild(inner);
        }
    }
    return main;
}

DataContainer.prototype.getTable = function (tblId) {
    var tbl = document.createElement("table");
    ["table", "table-hover"].forEach(cls => tbl.classList.add(cls));
    tbl.style.width = "100%";
    tbl.setAttribute("id", tblId);
    // creation of table basics
    var tbdy = tbl.createTBody();
    var headers = Object.keys(this.data[0]);
    this.nbOfCols = headers.length;
    var thead = tbl.createTHead();
    //todo switch
    if (this.options.uiType.toLowerCase() == "table") {
        // creation of headers
        var tr = document.createElement('tr');
        headers.forEach(function (p) {
            var th = document.createElement('th');
            th.appendChild(document.createTextNode(p));
            tr.appendChild(th);
        })
        thead.appendChild(tr);
    }
    //appending the head and body to table
    tbl.appendChild(tbdy);
    this.addrows(tbl, headers);
    tbl.appendChild(thead);
    return tbl;
}

DataContainer.prototype.addrows = function (table, headers = null) {
    if (this.data.length > 0) {
        const tbl = $(table);
        if (headers === null) {
            headers = Object.keys(this.data[0]);
            this.nbOfCols = headers.length;
        }
        for (i = 0; i < this.data.length; i++) {
            let object = this.data[i];
            switch (this.options.uiType.toLowerCase()) {
                case "table-cards":
                    var tr = document.createElement('tr');
                    tr.setAttribute('id', object.id);
                    var td = document.createElement('td');
                    let div = document.createElement('div');
                    div.classList.add('card', 'notification-card');
                    div.id = "notificationCard-" + (object["id"] ?? randomInt("5000"));

                    let body = document.createElement('div');
                    body.classList.add('card-body');

                    let title = document.createElement('div');
                    title.classList.add('card-title');
                    title.innerHTML = object["title"] ?? "";

                    let content = document.createElement('div');
                    content.classList.add('card-text');
                    content.innerHTML = object["content"] ?? "";

                    let footer = document.createElement('div');
                    footer.classList.add('card-footer');
                    footer.innerHTML = moment(object["date"] ?? "");
                    body.appendChild(title);
                    body.appendChild(content);

                    div.appendChild(body);
                    div.appendChild(footer);
                    td.appendChild(div);

                    tr.appendChild(td);
                    tbl.children('tbody').append(tr);
                    break;
                default:
                    var tr = document.createElement('tr');
                    tr.setAttribute('id', object.id);
                    headers.forEach(hdr => {
                        var td = document.createElement('td');
                        td.appendChild(document.createTextNode(this.data[i][hdr]));
                        tr.appendChild(td);
                    });
                    tbl.children('tbody').append(tr);
            }

        }
    }
    let footer = table.createTFoot();

    let row = footer.insertRow(0);

    let cell = row.insertCell(0);

    cell.innerHTML = "<a href=\"/account/notifications\" data-role=\"view-all\" style=\"display: inline-block; width: 100%; text-align: center;\">View All</a>";
}

DataContainer.prototype.setUpPagingScroll = function (div, pageSize, pageNumber, remainingField) {
    //let div = document.getElementById(wrapper);
    let obj = this;

    div.scroll(function () {
        //addEventListener("scroll", function () {

        if (obj.paging.remainigPages > 0 && obj.options.paging.page > 0 && (div.scrollTop() == div[0].scrollHeight - div.height())) {
            obj.callAjax();
            div.children('table').children('tbody').append(getTableSpinner(obj.nbOfCols));
            // this for the spinner to getdown a little
            div.scrollTop(div[0].scrollHeight);
        }
    });
    return {
        enabled: true,
        remainingField: remainingField,
        pageSize: pageSize,
        page: pageNumber
    }
}

DataContainer.prototype.enablePaging = function (pageSize, pageNumber, remainingField) {
    wrapper = $('#' + this.constructor.name.concat("_main_").concat(this.id));
    if (this.options !== null && this.options.paging.enabled === false) {
        const result = this.setUpPagingScroll(wrapper, pageSize, pageNumber, remainingField);
        if (result) {
            return this.options.paging = result;
        }
    }
}

/**
 * @param {any} func
 * @param {any} t
 */
function Timer(func, t) {
    var timerObj = null;
    this.func = func;
    this.t = t;
}

Timer.prototype.stop = function () {
    if (this.timerObj) {
        clearInterval(this.timerObj);
        this.timerObj = null;
    }
    return this;
}

// start timer using current settings (if it's not already running)
Timer.prototype.start = function () {
    if (!this.timerObj) {
        this.stop();
        this.timerObj = setInterval(this.func, this.t);
    }
    return this;
}

// start with new or original interval, stop current interval
Timer.prototype.reset = function (newT = this.t) {
    this.t = newT;
    return this.stop().start();
}

// check timer status
Timer.prototype.isRunning = function () {
    return this.timerObj !== null;
}

// scrollObj is the div to be scrolled
var checkScroll = function (scrollObj) {
    if (scrollObj.isScrollVisible) {
        scrollObj.element.css('overflow-y', 'hidden')
        scrollObj.isScrollVisible = false;
        scrollObj.timer.stop();
    }
}

// targetElemnt is the object to have animation
function ScrollAnimation(targetElement, maxHeight) {
    this.element = $(targetElement);
    this.element.css({ 'overflow-y': 'hidden', 'height': maxHeight });
    this.isScrollVisible = false;
    scrollObj = this;
    this.timer = new Timer(function () {
        checkScroll(scrollObj);
    }, 1500);
}

// initialize the event on the object
ScrollAnimation.prototype.init = function () {
    this.element.mousemove({ par: this }, showScroll);
    this.element.on('DOMMouseScroll', { par: this }, showScroll);
}

showScroll = function (event) {
    let obj = event.data.par;
    obj.isScrollVisible = true;
    obj.element.css('overflow-y', 'scroll')
    if (obj.timer.isRunning()) {
        obj.timer.reset();
    } else {
        obj.timer.start();
    }
}

getTableSpinner = function (nbCols = tblColsCount) {
    if (spinner === null) {
        const loader = $('<div>', { class: 'spinner-border', role: 'status' });
        const subLoader = $('<span>', { class: 'sr-only' });
        const tr = $('<tr id="spinner">')
        const td = $('<td>')
        subLoader.text('Loading...');
        loader.append(subLoader);
        td.append(loader);
        tr.append(td);
        tr.width = '100%'
        td.css('text-align', 'center')
        spinner = $(tr);
    }
    spinner.find('td').attr('colspan', nbCols);
    return spinner;
}