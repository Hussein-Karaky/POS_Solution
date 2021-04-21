
$(document).ready(function () {
    populateUser();
    $('#fileLoc').on('click', '.tpButton', function () {
        var id = jQuery(this).closest('tr').attr('id');
        let div = document.getElementById("output");
        let divcontainer = document.getElementById("output1");
        let buttondiv = document.getElementById("buttondiv");
        div.style.display = "block";
        div.innerHTML = "";
        buttondiv.style.display = "block";
        divcontainer.style.display = "block";
        let spinner =  document.getElementById("spinner");
            if (spinner==null || spinner==undefined) {
                spinner = document.createElement("div");
                spinner.id = "spinner";
                spinner.className = "lds-dual-ring";
            }
            div.appendChild(spinner);
              var d = {
                Id: id
        }
        $.ajax({
            type: "POST",
            url: window.location.origin.concat("/Home/Fileword1"),
            data: d,
            success: function (data) {
               
                if (data.typeOfFile==="docx")
                    parseWordDocxFileTst(data.base64);
                else if(data.typeOfFile === "pdf")
                    MyExtractText(data.base64);


            },
            error: function (a, b, c) {
                console.log(a);
            }
        })
        let buttonApproved = document.getElementById("Approved");
        buttonApproved.addEventListener("click", function (e) {
            Swal.fire({
                title: 'Do you want to accept it?',
                icon: 'info',
                html: '<div class=form-group>'
                    + '<label for=comment > Comment:</label>' +
                    '<textarea class="form-control" rows="5" id="comment"></textarea>' +
                    '</div >'
                ,
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: true,
                confirmButtonText:
                    'Yes',
                confirmButtonAriaLabel: 'Yes ',
                cancelButtonText:
                    'No',
                cancelButtonAriaLabel: 'No '
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    let commentelement = document.getElementById("comment");
                    let comment = commentelement.value;
                    var data = {
                        Id: id,
                        comment: comment,
                    };
                    $.ajax({
                        type: "POST",
                        url: window.location.origin.concat("/Home/Accept"),
                        data: data,
                        success: function (data) {

                            Swal.fire('Was accepted!', '', 'success')
                        },
                        error: function (a, b, c) {
                            console.log(a);
                        }
                    })
                }
            })
        });
        let buttonReject = document.getElementById("reject");
        buttonReject.addEventListener("click", function (e) {
            Swal.fire({
                title: 'Do you want to reject it?',
                icon: 'info',
                html: '<div class=form-group>'
                    + '<label for=comment > Comment:</label>' +
                    '<textarea class="form-control" rows="5" id="commentreject"></textarea>' +
                    '</div >'
                ,
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: true,
                confirmButtonText:
                    'Yes',
                confirmButtonAriaLabel: 'Yes ',
                cancelButtonText:
                    'No',
                cancelButtonAriaLabel: 'No '
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "POST",
                        url: window.location.origin.concat("/Home/"),
                        data: data,
                        success: function (data) {

                            Swal.fire('Was accepted!', '', 'success')
                        },
                        error: function (a, b, c) {
                            console.log(a);
                        }
                    })
                    Swal.fire('Was rejected!', '', 'success')
                }
            })
        });
    });
    $('#userloc').on('click', '.tpButtonuser', function () {
        let div = document.getElementById("output");
        div.innerHTML = ""; 
        var id = jQuery(this).closest('tr').attr('id');
        var d = {
            Id: id
        }
        $.ajax({
            type: "POST",
            url: window.location.origin.concat("/Home/GetUserFiles"),
            data: d,
            success: function (data) {
                populateFile(data);
            },
            error: function (a, b, c) {
                console.log(a);
            }
        })
    });
   
});

buildGridFile = function (records) {
    if (Array.isArray(records) && records.length > 0) {
        let cols = Object.keys(records[0]);
        let tbl = document.getElementById("tableFile");
        let bdy = null;
        if (tbl === null || tbl === undefined) {
            tbl = document.createElement("table");
            tbl.id = "tableFile";
            ["data-table"].forEach(cls => tbl.classList.add(cls));
            let thead = tbl.createTHead();
            cols.forEach(col => {
              
                let th = document.createElement("th");
                let title = document.createTextNode(col);
                th.appendChild(title);
                thead.appendChild(th);
            });
            bdy = tbl.createTBody();
            bdy.id = "tbody";
            tbl.appendChild(bdy);
        } else {
            bdy = document.getElementById("tableFile").querySelector("tbody");
        }
        if (bdy !== null && bdy !== undefined) {
            records.forEach(rec => {
                let tr = document.createElement("tr");      
                tr.id = rec["id"];  
                cols.forEach(col => {
                    let td = document.createElement("td");   
                    //let slash = rec[col].lastIndexOf("/");
                    //let dot = rec[col].lastIndexOf(".");
                    //var fileName = rec[col].substring(slash + 1,dot);
                    if (col === "filePath") {
                        let a = document.createElement("a");
                        a.href = rec[col];
                        let slash = rec[col].lastIndexOf("\\");
                        let dot = rec[col].lastIndexOf(".");
                        var fileName = rec[col].substring(slash + 1, dot);
                        a.innerHTML = fileName;
                        td.appendChild(a);
                    }
                    else {
                        let node = document.createTextNode(rec[col]);
                        td.appendChild(node);
                    }
                    
                   
                    td.className = "tpButton";
                    tr.appendChild(td);
                });
                bdy.appendChild(tr);
            });
        }
        return tbl;
    }
    else {
        let spn = document.createElement("span");
        spn.innerHTML = "no data";
        return spn;
    }
};
populateFile=function (data) {
    let div = document.getElementById("fileLoc");
    div.innerHTML = "";
    if (div !== null && div !== undefined) {
        div.appendChild(buildGridFile(data));
    }
};
populateUser = function () {

    $.ajax({

        type: "POST",
        url: window.location.origin.concat("/Home/GetAllUsers"),
        data: "",
        success: function (data) {
            let div = document.getElementById("userloc");
            if (div !== null && div !== undefined) {
                div.appendChild(buildGridUser(data));
            }
        },
        error: function (a, b, c) {
            console.log(a);
        }
    })


};
function buildGridUser(records) {

    if (Array.isArray(records) && records.length > 0) {

        let cols = Object.keys(records[0]);
        let tbl = document.getElementById("tableUser");
        let bdy = null;
        if (tbl === null || tbl === undefined) {
            tbl = document.createElement("table");
            tbl.id = "tableUser";
            ["data-table"].forEach(cls => tbl.classList.add(cls));
            let thead = tbl.createTHead();
            cols.forEach(col => {
                let th = document.createElement("th");
                let title = document.createTextNode(col);
                th.appendChild(title);
                thead.appendChild(th);
            });
            bdy = tbl.createTBody();
            bdy.id = "tbody";
            tbl.appendChild(bdy);
        } else {
            bdy = document.getElementById("tableUser").querySelector("tbody");
        }
        if (bdy !== null && bdy !== undefined) {
            records.forEach(rec => {
                let tr = document.createElement("tr");
                tr.id = rec.id;
                cols.forEach(col => {
                    let td = document.createElement("td");
                    let node = document.createTextNode(rec[col]);
                    td.appendChild(node);
                    td.className = "tpButtonuser";
                    tr.appendChild(td);
                });
                bdy.appendChild(tr);
            });
        }
        return tbl;
    }
    else {
        let spn = document.createElement("span");
        spn.innerHTML = "no data";
        return spn;
    }
};
