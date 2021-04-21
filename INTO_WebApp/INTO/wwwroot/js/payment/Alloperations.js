let todayDiv = document.querySelector('#todayDiv');
const calendar_el = document.querySelector('#my-calendar');
let start_date = document.querySelector('.date-from');
let single_date = document.querySelector('.single');
let multi_dates = document.querySelector('.multi');
let end_date = document.querySelector('.date-to');
let date_start = '';
let date_end = '';
let filters = [];
let todayFilter = getDate(today);
let todaystring = getDateSring(today);
var filterTags = document.querySelector("#filterTags");
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
    let day= date.getDate();
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


//define table
var table = new Tabulator("#Opr-table",
    {
        ajaxURL: window.location.origin.concat("/Payment/GetAllJsonOpr"), //ajax URL
        layout: "fitColumns",
        pagination: "local",
        groupBy: "description",
        rowFormatter: function (row) {
            if (row.getData().oprTypeId == 100571) {
                row.getElement().style.color = "#2ecc71";
            } else row.getElement().style.color = "#e74c3c";
        },
        paginationSize: 20,
        paginationSizeSelector: [10, 20, 40, 50],
        initialFilter: [
            { field: "dateString", type: "=", value: todayFilter }
        ],
        columns: [
            { title: "Id", field: "id", sorter: "number" },
            { title: "OprTypeId", field: "oprTypeId", sorter: "number",visible : false },
            { title: "Description", field: "description", sorter: "string" },
            { title: "Date", field: "dateString", sorter: "date" },
            { title: "Amount", field: "amount", sorter: "number" },
            { title: "Currency", field: "currency", sorter: "string" },
            { title: "RelationId", field: "relationId", sorter: "number" },
            { title: "Agent", field: "agent", sorter: "string" },
            { title: "Payment Method", field: "paymentMethod", sorter: "string" },
            { title: "Captured", field: "captured", sorter: "number", formatter: "tickCross" },
            { title: "Capture Date", field: "capDateString", sorter: "date" }
        ],
        rowClick: 
            function (e, row) {}
        ,
    });
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
        if (item.field == 'dateString')
            return false;
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
