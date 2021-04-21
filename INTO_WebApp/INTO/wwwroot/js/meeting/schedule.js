var vRoomsByMeGrid = null;
var vRoomsToMeGrid = null;
$(document).ready(function () {
    let trialRoom = document.getElementById("trialRoom");
    trialRoom.setAttribute("href", "/collaboration/trialroom/".concat(uuidv4(), "/", new Date().getTimezoneOffset(), "/", language));
    vRoomsByMeGrid = new DataGrid(
        "scheduledByMe",
        window.location.origin.concat("/meeting/scheduledby/").concat(accountManager.currentUser.userId).concat("/").concat(timezoneOffset()).concat("/").concat(language),
        null,
        {
            uniqueKey: "id",
            gridCss: ["table", "table-striped", "border-separate", "round-corner-4"],
            headerCss: ["white", "blue-text", "cursor-pointer"],
            columnCss: ["btn-outline"],
            rowCss: ["btn-info", "cursor-pointer"],
            alternatingCss: ["cursor-pointer", "btn-info", "light-blue", "lighten-5", "blue-text"],
            hideColumns: false,
            align: "center",
            cellspacing: 0,
            rowFunctions: [{
                name: "Delete", function: function (e, data) {
                    console.log("deleting " + data);
                }
            }]
        },
        "vRoomsUI", undefined, undefined, undefined, undefined,
        function (e, sender) {
            sound.volume = 0.01;
            sound.play();
            let data = sender.getData();
            window.location.href = window.location.origin.concat("/meeting/roomInfo/").concat(`${data.id}/${(new Date()).getTimezoneOffset()}/${language}`);
        });
    vRoomsByMeGrid.dataBind();

    vRoomsToMeGrid = new DataGrid(
        "scheduledToMe",
        window.location.origin.concat("/meeting/ScheduledTo/").concat(accountManager.currentUser.userId).concat("/").concat(timezoneOffset()).concat("/").concat(language),
        null,
        {
            uniqueKey: "id",
            gridCss: ["table", "table-striped", "border-separate", "round-corner-4"],
            headerCss: ["white", "blue-text", "cursor-pointer"],
            columnCss: ["btn-outline"],
            rowCss: ["btn-info", "cursor-pointer"],
            alternatingCss: ["cursor-pointer", "btn-info", "light-blue", "lighten-5", "blue-text"],
            hideColumns: false,
            align: "center",
            cellspacing: 0,
            rowFunctions: [{
                name: "Delete", function: function (e, data) {
                    console.log("deleting " + data);
                }
            }]
        },
        "vRoomsUI", undefined, undefined, undefined, undefined,
        function (e, sender) {
            let data = sender.getData();
            window.location.href = window.location.origin.concat("/meeting/roomInfo/").concat(`${data.id}/${(new Date()).getTimezoneOffset()}/${language}`);
        });
    vRoomsToMeGrid.dataBind();
});