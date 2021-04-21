var count = 0;
var userId = 49;
var user = {
    avail: null,
    id: 46,
    entityType: 1
};
$(document).ready(function () {
    //fetchAvailability();
    let myDiv = document.getElementById("mydiv");
    let mydivFile = document.getElementById("mydivFile");
    let userslists = document.getElementById("userslists");
        dragElement(userslists);
    if (myDiv !== null && mydivFile !== null) {
        dragElement(myDiv);
        dragElement(mydivFile);
        openList();
        getFiles();
        //materials();
        //buildusers();
        //btnmaxFile = document.getElementById("maxFile");
        //btnmaxFile.addEventListener("click", function () {
        //    let mydiv = document.getElementById("mydivFile");
        //    //mydiv.style.width = "100%";
        //    //mydiv.style.height = "100%";
        //    //mydiv.style.top = "0px";
        //    //mydiv.style.left = "0px";
        //    //mydiv.style.right = "0px";
        //    //mydiv.style.bottom = "0px";

        //});
        btnmaxInfo = document.getElementById("maxInfo");
        btnmaxInfo.addEventListener("click", function () {
            let mydiv = document.getElementById("mydiv");
            mydiv.style.width = "100%";
            mydiv.style.height = "100%";
            mydiv.style.top = "0px";
            mydiv.style.left = "0px";
            mydiv.style.right = "0px";
            mydiv.style.bottom = "0px";

        });
        //personalInfo();
    }
});
setImage = function () {
    let img = document.getElementById("img");
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.drawImage(img, 10, 10);
}
dragElement = function (elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
openList = function () {

    var coll = document.getElementById("openlist");
    coll.addEventListener("click", function () {
        this.classList.toggle("active");
        let content = document.getElementById("divRow");
        let mydiv = document.getElementById("mydiv");
        let mydivheader = document.getElementById("mydivheader");
        if (mydiv.style.width !== mydiv.style.minWidth) {
            mydiv.style.width = mydiv.style.minWidth;
            mydiv.style.height = "50px";
        } else {
            mydiv.style.width = "200px";
            mydiv.style.height = content.style.height;
        }
        if (mydivheader.className === "isActive") {
            this.style.backgroundColor = "#33b5e5";
            mydivheader.className = "";
            mydivheader.style.backgroundColor = "#33b5e5";
            mydiv.style.zIndex = "1000";
        }
        else {
            this.style.backgroundColor = "#2196F3";
            mydivheader.className = "isActive";
            mydivheader.style.backgroundColor = "#2196F3";
            mydiv.style.zIndex = "1002"
        }

        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
    var collu = document.getElementById("users");
    collu.addEventListener("click", function () {
        this.classList.toggle("active");
        let content = document.getElementById("listUsers");
        let mydiv = document.getElementById("userslists");
        let mydivheader = document.getElementById("mydivUsers");
        if (mydiv.style.width !== mydiv.style.minWidth) {
            mydiv.style.width = mydiv.style.minWidth;
            mydiv.style.height = "50px";
        } else {
            mydiv.style.width = "400px";
            mydiv.style.height = content.style.height;
        }
        if (mydivheader.className === "isActive") {
            this.style.backgroundColor = "#33b5e5";
            mydivheader.className = "";
            mydivheader.style.backgroundColor = "#33b5e5";
            mydiv.style.zIndex = "1000";
        }
        else {
            this.style.backgroundColor = "#2196F3";
            mydivheader.className = "isActive";
            mydivheader.style.backgroundColor = "#2196F3";
            mydiv.style.zIndex = "1002"
        }

        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
    var collFile = document.getElementById("openlistFile");
    collFile.addEventListener("click", function () {
        this.classList.toggle("active");
        let content = document.getElementById("list");
        let mydivFileheader = document.getElementById("mydivFileheader");
        let fileloc = document.getElementById("fileloc");
        let mydiv = document.getElementById("mydivFile");
        if (mydivFileheader.className === "isActive") {
            this.style.backgroundColor = "#33b5e5";
            mydivFileheader.className = "";
            mydivFileheader.style.backgroundColor = "#33b5e5";
            mydiv.style.zIndex = "1000";
        }
        else {
            this.style.backgroundColor = "#2196F3";
            mydivFileheader.className = "isActive";
            mydivFileheader.style.backgroundColor = "#2196F3";
            mydiv.style.zIndex = "1002";
        }
        if (mydiv.style.width !== mydiv.style.minWidth) {
            fileloc.style.display = "none";
            mydiv.style.width = mydiv.style.minWidth;
        }
        if (content.style.maxHeight) {
            mydiv.style.height = "55px";
            content.style.maxHeight = null;

        } else {
            content.style.maxHeight = content.scrollHeight + "px";
            mydiv.style.height = fileloc.style.height;

        }
    });
}
getFiles = function () {
    let d = {
        userId: userId,
    };
    $.ajax({
        type: "POST",
        url: window.location.origin.concat("/Files/Index"),
        data: d,
        success: function (data) {
            if (data.data.length > 0) {
                let cols = Object.keys(data.data[0]);
                let ul = document.createElement("ul");
                ul.style.listStyleType = "none";
                ul.setAttribute("data-role", "tablist");
                data.data.forEach(d => {
                    cols.forEach(col => {
                        if (col === "name") {
                            let li = document.createElement("li");

                            li.classList.add(d[col].split('.')[1]);
                            li.innerHTML = "<span class=\"square-24\"></span>".concat(d[col]);
                            li.setAttribute("data-id", d['id']);
                            li.setAttribute("data-role", "tab");
                            li.addEventListener("click", function () {
                                let div = document.getElementById("fileloc");
                                div.innerHTML = "";
                                let spinner = document.getElementById("spinner");
                                if (spinner == null || spinner == undefined) {
                                    spinner = document.createElement("div");
                                    spinner.id = "spinner";
                                    spinner.className = "lds-dual-ring";
                                }
                                div.appendChild(spinner);
                                var d = {
                                    Id: this.getAttribute("data-id")
                                }
                                $.ajax({
                                    type: "post",
                                    url: window.location.origin.concat("/Files/FileRead"),
                                    data: d,
                                    success: function (data) {

                                        if (data.typeOfFile === "docx") {
                                            parseWordDocxFileTst(data.base64);

                                        }
                                        else if (data.typeOfFile === "pdf") {
                                            MyExtractText(data.base64);

                                        }

                                    },
                                    error: function (a, b, c) {
                                        console.log(a);
                                    }
                                })
                                //div.innerHTML = this.getAttribute('data-id');
                                let width = document.getElementById("mydivFile").getBoundingClientRect().width;
                                div.style.display = "block";
                                if (count === 0) {
                                    let nb = parseInt(div.getBoundingClientRect().width) + parseInt(width);
                                    let wth = nb.toString().concat("px");
                                    document.getElementById("mydivFile").style.width = wth;
                                    count++;
                                }


                            });
                            ul.appendChild(li);
                        }
                    });

                });
                let div = document.getElementById('list');
                div.appendChild(ul);
            }

        },
        error: function (a, b, c) {
            console.log(a);
        }
    })
}

personalInfo = function () {
    let error = function (request, status, error) {
        console.error(request.responseText);
    };
    let d = {
        userId: user.id
    }
    $.ajax({
        type: "POST",
        url: window.location.origin.concat("/tutor/GetUser"),
        data: d,
        success: function (data, text) {
            if (data !== null && data !== undefined) {
                let inputId = document.getElementById("Uid");
                let inputName = document.getElementById("FullName");
                let inputDOB = document.getElementById("DOB");
                let inputGender = document.getElementById("Gender");
                let inputEmail = document.getElementById("Email");
                inputId.value = data.userId;
                inputName.value = data.firstName + " " + data.lastName;


                inputDOB.value = data.dob;
                if (data.gender === true)
                    inputGender.value = "Male";
                else if (data.gender === false)
                    inputGender.value = "Female";

                inputEmail.value = data.email;
                $(inputName).trigger("change");
                $(inputDOB).trigger("change");
                $(inputGender).trigger("change");
                $(inputEmail).trigger("change");
                $(inputId).trigger("change");
            }
        },
        error: error
    });
}
buildTabs = function () {

    var menu = ["PersonalInfo", "lLocationSettings", "attribute", "Subject&Materials", "BusinessSettings", "Documents"];
    let divRow = document.getElementById("divRow");
    let divListRow = document.createElement("div");
    divListRow.className = "p-2 r";
    divListRow.style.resize = "horizontal !important";

    let divContainer = document.createElement('div');
    divContainer.className = "nav  nav-pills";
    divContainer.id = "v-pills-tab";
    divContainer.setAttribute("data-role", "tablist");
    divContainer.setAttribute("aria-orientation", "vertical");
    menu.forEach(col => {
        let element = document.createElement('a');
        element.className = "nav-link ";
        element.id = "v-pills-".concat(col).concat("-tab");
        element.setAttribute("data-toggle", "pill");
        element.href = "#v-pills-".concat(col);
        element.setAttribute("data-role", "tab");
        element.setAttribute("aria-controls", "v-pills-".concat(col));
        element.setAttribute("aria-selected", "false");
        element.innerHTML = col;
        divContainer.appendChild(element);
    });
    divListRow.appendChild(divContainer);
    divRow.appendChild(divListRow);

    let divContentRow = document.createElement("div");
    divContentRow.style.resize = "horizontal";
    divContentRow.className = "p-3 ";
    let divContentContainer = document.createElement('div');
    divContentContainer.className = "tab-content";
    divContentContainer.id = "v-tabs-tabContent";
    menu.forEach(col => {
        let element1 = document.createElement('div');
        element1.className = "tab-pane fade";
        element1.id = "v-pills-".concat(col);
        element1.setAttribute("data-role", "tabpanel");
        element1.setAttribute("aria-labelledby", "v-pills-".concat(col).concat("-tab"));
        element1.innerHTML = col;
        divContentContainer.appendChild(element1);
    });
    divContentRow.appendChild(divContentContainer);
    divRow.appendChild(divContentRow);
};
fetchAvailability = function () {
    let error = function (request, status, error) {
        console.error(request.responseText);
    };
    $.ajax({
        type: "POST",
        url: window.location.origin.concat("/tutor/availSvc"),
        data: user,
        success: function (data, text) {
            if (data !== null && data !== undefined) {
                assignAvailability(data);
            }
        },
        error: error
    });
};
assignAvailability = function (availability) {
    let avElement = document.getElementById("v-pills-Availability");
    if (avElement !== null && avElement !== undefined) {
        if (typeof Availability === 'function') {
            avElement.innerHTML = "";
            let shed = new Availability();
            shed.create("v-pills-Availability").parse(availability);
            let days = shed.children;
            for (i = 0; i < days.length; i++) {
                days[i].onChildAdded();
            }
        }
    }
};
/*
materials = function () {

    let id = 27;
    let lang = 1;
    let materialsGrid = new DataGrid(
        "v-pills-Subject-Materials",
        window.location.origin.concat("/tutor/MaterialsSvc/").concat(id).concat("/").concat(lang),
        null,
        {
            gridCss: ["table", "table-striped", "border-separate", "round-corner-4"],
            headerCss: ["white", "blue-text", "cursor-pointer"],
            columnCss: ["btn-outline"],
            rowCss: ["btn-info", "cursor-pointer"],
            alternatingCss: ["cursor-pointer", "btn-info", "light-blue", "lighten-5", "blue-text"],
            hideColumns: false,
            align: "center",
            cellspacing: 0,
            rowFunctions: [

            ]
        },
  
        "materialsUI", undefined, undefined, undefined, undefined,
        function (e, sender) {
            $("#mdlEditMaterial").modal("show", sender);
        });
    materialsGrid.dataBind();
}

buildusers = function () {
    let users = document.getElementById("usersitems").getAttribute("data-role");
    let divcontent = document.getElementById("listUsers");
    users.forEach(d => {
        let div = document.createElement("div");
        let span = document.createElement("span");
        span.innerHTML = d["firstName"] + " " + d["lastName"];
        div.appendChild(span);
        divcontent.appendChild(div);
    });

}*/