//let OprLabels = document.querySelectorAll('.operation .label');
//OprLabels.forEach(label => {
//    let index = label.getAttribute("data-label");
//    label.innerHTML = LabelArray[index];
//});

var RefundPayment = document.getElementById("RefundPayment");
var VoidPayment = document.getElementById("VoidPayment");

$(document).on('click', '#RefundPayment', function () {
    var OprId = this.getAttribute("data-opr");
    $.ajax({
        url: window.location.origin.concat('/Payment/ApiRefundPayment'),
        type: 'post',
        dataType: 'json',
        data: { OprId: OprId },
        success: function (result) {
            let MsgContainer = document.querySelector("#SuccessRefundMsg");
            MsgContainer.innerHTML = "Payment Refund!";
        },
        error: function () {
            alert('error');
        }
    });

});
$(document).on('click', '#VoidPayment', function () {
    var OprId = this.getAttribute("data-opr");
    $.ajax({
        url: window.location.origin.concat('/Payment/ApiVoidPayment'),
        type: 'post',
        dataType: 'json',
        data: { OprId: OprId },
        success: function (result) {
            let MsgContainer = document.querySelector("#SuccessVoidPayment");
            MsgContainer.innerHTML = "Payment Canceled!";
        },
        error: function () {
            alert('error');
        }
    });

});






let todayDiv = document.querySelector('#todayDiv');
const calendar_el = document.querySelector('#my-calendar');
let start_date = document.querySelector('.date-from');
let single_date = document.querySelector('.single');
let multi_dates = document.querySelector('.multi');
let end_date = document.querySelector('.date-to');
let date_start = '';
let date_end = '';
let filters = [];
//let today = new Date();
let todayFilter = getDate(today);
let todaystring = getDateSring(today);
var filterTags = document.querySelector("#filterTags");

let RelationId = parseInt(document.querySelector('#myModal').getAttribute('data-opr'));

var ShowCalendar = document.querySelector("#ShowCalendar");
todayDiv.innerHTML = todaystring;

function getDateSring(d) {
    let date = new Date(d);
    let months = ["Jan", "Feb", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let todaystring = date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    return todaystring;
}
function getDate(d) {
    let date = new Date(d);
    let mnth = date.getMonth() + 1;
    mnth = mnth < 10 ? '0' + mnth : mnth;
    let day = date.getDate();
    day = day < 10 ? '0' + day : day;
    let todaystring = date.getFullYear() + '-' + mnth + '-' + day;
    return todaystring;
}
const myCalendar = new TavoCalendar('#my-calendar', {
    date: todayFilter,
    highlight_sunday: false,
    highlight_saturday: false,
    range_select: true,
    past_select: true
});

//Define variables for input elements
var fieldEl = document.getElementById("filter-field");
var typeEl = document.getElementById("filter-type");
var valueEl = document.getElementById("filter-value");

//Custom filter example
// function customFilter(data){
//     return data.car && data.rating < 3;
// }

//Trigger setFilter function with correct parameters
function updateFilter() {
    var filterVal = fieldEl.options[fieldEl.selectedIndex].value;
    var typeVal = typeEl.options[typeEl.selectedIndex].value;

    if (filterVal && valueEl.value != '') {
        table.addFilter(filterVal, typeVal, valueEl.value);
    }
    filters = table.getFilters(true);
    alterfilter();
}

//Update filters on value change
// document.getElementById("filter-field").addEventListener("change", updateFilter);
// document.getElementById("filter-type").addEventListener("change", updateFilter);
//document.getElementById("filter-value").addEventListener("keyup", updateFilter);
document.getElementById("filterBtn").addEventListener("click", updateFilter);

//Clear filters on "Clear Filters" button click
document.getElementById("filter-clear").addEventListener("click", function () {
    fieldEl.value = "";
    typeEl.value = "=";
    valueEl.value = "";
    filterTags.innerHTML = "";
    single_date.innerHTML = "";
    start_date.innerHTML ="";
    end_date.innerHTML ="";
    table.clearFilter();
});



var tabledata = '';
//define data
//$.ajax({
//    url: window.location.origin.concat("/Payment/GetJsonOpr"),
//    type: 'GET',
//    data: {},
//    success: function (result) {
//        tabledata = JSON.parse(result);
//    },
//    error: function () {
//        alert('error');
//    }
//});

//define table
var table = new Tabulator("#Opr-table",
    {
        ajaxURL: window.location.origin.concat("/Payment/GetJsonOpr"), //ajax URL
        //data: tabledata,
        layout: "fitColumns",
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [10, 20, 40, 50],
        initialFilter: [
            { field: "dateString", type: "=", value: todayFilter }
        ],
        columns: [
            { title: "Id", field: "id", sorter: "number", visible: false },
            { title: "Date", field: "dateString", sorter: "date" },
            { title: "Amount", field: "amount", sorter: "number" },
            { title: "Currency", field: "currency", sorter: "string" },
            { title: "Description", field: "description", sorter: "string" },
            { title: "Payment Method", field: "paymentMethod", sorter: "string" },
            { title: "Capture On", field: "capDateString", sorter: "date" },
            { title: "RelationId", field: "RelationId", sorter: "number", visible: false  }
        ],
        //set other languages Headers
        langs: { /// table.setLocale("fr-fr");
            "fr-fr": {
                "columns": {
                    "name": "Nom",
                    "progress": "Progression",
                    "gender": "Genre",
                    "rating": "Évaluation",
                    "col": "Couleur",
                    "dob": "Date de Naissance",
                },
                "pagination": {
                    "first": "Premier",
                    "first_title": "Première Page",
                    "last": "Dernier",
                    "last_title": "Dernière Page",
                    "prev": "Précédent",
                    "prev_title": "Page Précédente",
                    "next": "Suivant",
                    "next_title": "Page Suivante",
                    "all": "Toute",
                },
            },
        },
        rowClick: 
            function (e, row) {
            // $("#myModal").modal();
            //Open operation Details on row click
            $('.modal-dialog').load(window.location.origin.concat("/Payment/OprDetails/").concat(row.getData().id), function () {
                $('#myModal').modal({ show: true });
            });
            //alert("Row " + row.getData().OprId + " Clicked!!!!");
            }
        ,
    });
if (RelationId != 0) {
    table.setFilter("relationId", "=", RelationId);
    alterfilter();
}
calendar_el.addEventListener('calendar-range', (ev) => {
    const range = myCalendar.getRange();
    table.setFilter("dateString", ">=", range.start);
    table.addFilter("dateString", "<=", range.end);
    filters = table.getFilters(true);
    hideCalendar();
    if (range.start == range.end) {
        single_date.style.display = 'block';
        single_date.innerHTML = getDateSring(range.start);
        multi_dates.style.display = 'none';
    }
    else {
        single_date.style.display = 'none';
        multi_dates.style.display = 'flex';
        start_date.innerHTML = getDateSring(range.start);
        end_date.innerHTML = getDateSring(range.end);
    }
    alterfilter();
});
function alterfilter() {
    filterTags.innerHTML = "";
    filters.forEach(function (item, index) {
        //let index = i-1;
        //if(item.field  == 'date')item.value =getDateSring(item.value);
        if (item.field == 'dateString')
            return false;
        if (item.field == 'relationId')
            return false;
        // let OprType={"like":"like","<":"Less Than","<=":"Less Than Equal",">":"Greater Than",">=":"Greater Than Equal","=":"Equal","!=":"Not Equal"};
        let closeBtn = document.createElement("button");
        closeBtn.setAttribute('onclick', `removeFilterTag(${index})`);
        closeBtn.setAttribute('class', 'close');
        closeBtn.setAttribute('type', 'button');
        closeBtn.setAttribute('class', 'close');
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.innerHTML = '<span aria-hidden="true">&times;</span>';

        let li = document.createElement("li");
        li.setAttribute('data-field', item.field);
        li.setAttribute('data-type', item.type);
        li.setAttribute('data-value', item.value);
        li.setAttribute('class', 'alert alert-info');
        li.setAttribute('id', 'fltr' + index);
        closeBtn.setAttribute('id', 'clos' + index);

        li.innerHTML = "<strong>" + item.field + "</strong><span class=text-success> " + item.type + "</span> " + item.value;
        li.appendChild(closeBtn);
        filterTags.appendChild(li);
    });
}

let removeFilterTag = function (index) {
    let btn = document.querySelector('#clos' + index);
    let li = btn.closest('li');
    let field = li.getAttribute('data-field');
    let type = li.getAttribute('data-type');
    let value = li.getAttribute('data-value');
    filters.splice(index, 1);
    table.removeFilter(field, type, value);
    alterfilter();
}

function hideCalendar() {
    if (calendar_el.classList.contains("hide")) {
        calendar_el.classList.remove("hide");
        calendar_el.classList.add("show");
    } else {
        calendar_el.classList.remove("show");
        calendar_el.classList.add("hide");
    }
}
ShowCalendar.addEventListener('click', hideCalendar);


var ClearDateFilter = document.querySelector("#ClearDateFilter");
ClearDateFilter.addEventListener('click', function () {
    single_date.style.display = 'block';
    single_date.innerHTML = todaystring;
    multi_dates.style.display = 'none';
    table.setFilter("dateString", "=", todayFilter);
});
