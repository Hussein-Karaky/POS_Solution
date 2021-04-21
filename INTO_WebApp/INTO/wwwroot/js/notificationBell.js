let gNotiCont = null;
$(document).ready(function () {
    $('[data-role=push-notif]').on('click', function () {
        gNotiCont = gNotiCont ?? new DataContainer("divNotifBell",
            window.location.origin.concat("/Account/GetMiniNotifications"),
            {
                paging: { enabled: true, remainingField: "RemainingPages", pageSize: 5, page: 1 },
                main_classes: null,
                no_more_data: "<a href=\"/Account/NotifPage\">See More</a>",
                clearInit: true
            },
            "table-cards"
        );
        if (!gNotiCont.fetched && !gNotiCont.isFetchingPage) {
            let table = document.createElement('table');
            table.classList.add('w-100','text-center');

            let tr=document.createElement('tr');
            let td=document.createElement('td');
            td.innerHTML="Checking For Notifications";
            
            tr.appendChild(td);

            $(table).append(getTableSpinner(1)).append(tr)

            $('#divNotifBell').append(table);

            gNotiCont.dataBind();
        }
        let obj = $('.notifDropdown');
        let objC = $('.notifDropdown-content');
        if (objC.css("display") !== "none") {

            obj.css({ "display": "inline-block" });
            objC.css({ "display": "none" });
        }
        else {
            obj.css({ "display": "block" });
            objC.css({ "display": "block" });
        }
    });
})