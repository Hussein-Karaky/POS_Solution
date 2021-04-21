var count = 0;
window.onload = function () {
    setImage();
   // getFiles();
    buildTabs();
    dragElement(document.getElementById("mydiv"));
    openList();
}
setImage = function () {
    let img = document.getElementById("img");
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.drawImage(img, 10, 10);
}
dragElement=function(elmnt) {
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
        let content = document.getElementById("list");
        let fileloc = document.getElementById("fileloc");
        let mydiv = document.getElementById("mydiv");
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
            fileloc.style.display ="none";
            mydiv.style.height = "55px";
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
            mydiv.style.height = fileloc.style.height;
        }
    });

}
getFiles = function () {
    $.ajax({
        type: "POST",
        url: window.location.origin.concat("/Home/GetAllFile"),
        data: "",
        success: function (data) {
           let cols = Object.keys(data[0]);
           let ul = document.createElement("ul");
           ul.style.listStyleType = "none";
           ul.setAttribute("data-role","tablist");
            data.forEach(d => {
                cols.forEach(col => {
                    if (col === "name") {
                        let li=document.createElement("li");
                        li.innerHTML = d[col];
                        li.setAttribute("data-id", d['id']);
                        li.setAttribute("data-role","tab");
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
                                url: window.location.origin.concat("/Home/FileRead"),
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
                            let width = document.getElementById("mydiv").getBoundingClientRect().width;
                            div.style.display = "block";
                            if (count === 0) { 
                                let nb = parseInt(div.getBoundingClientRect().width) + parseInt(width);
                                let wth = nb.toString().concat("px");
                                document.getElementById("mydiv").style.width = wth;
                                count++;
                            }
                          

                        });
                        ul.appendChild(li);
                    }
                });
              
            });
            let div = document.getElementById('list');
            div.appendChild(ul);
        },
        error: function (a, b, c) {
            console.log(a);
        }
    })
}

buildTabs = function () {
  
    var menu = ["PersonalInfo", "lLocationSettings", "Availability", "Subject&Materials", "BusinessSettings", "Documents"];
    let divRow = document.getElementById("divRow");
    let divListRow = document.createElement("div");
    divListRow.className = "col-3";
    let divContainer = document.createElement('div');
    divContainer.className = "nav flex-column nav-tabs text-center";
    divContainer.id = "v-tabs-tab";
    divContainer.setAttribute("data-role", "tablist");
    divContainer.setAttribute("aria-orientation", "vertical");
    menu.forEach(col => {
        let element = document.createElement('a');
        element.className = "nav-link active";
        element.id = "v-tabs-".concat(col).concat("-tab");
        element.setAttribute("data-mdb-toggle", "tab");
        element.href = "#v-tabs-".concat(col);
        element.setAttribute("data-role", "tab");
        element.setAttribute("aria-controls", "v-tabs-".concat(col));
       // element.setAttribute("aria-selected", "true");
        element.innerHTML = col;
        divContainer.appendChild(element);
    });
    divListRow.appendChild(divContainer);
    divRow.appendChild(divListRow);

    let divContentRow = document.createElement("div");
    divContentRow.className = "col-9";
    let divContentContainer = document.createElement('div');
    divContentContainer.className = "tab-content";
    divContentContainer.id = "v-tabs-tabContent";
    menu.forEach(col => {
        let element1 = document.createElement('div');
        element1.className = "tab-pane fade show active";
        element1.id = "v-tabs-".concat(col);
        element1.setAttribute("data-role", "tabpanel");
        element1.setAttribute("aria-labelledby","v-tabs-".concat(col).concat("-tab"));
        divContentContainer.appendChild(element1);
    });
    divContentRow.appendChild(divContentContainer);
    divRow.appendChild(divContentRow);
};
