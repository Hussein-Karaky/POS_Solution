$(document).ready(function () {
    //setTimeout(function () { attachInMenu(); }, 1000);
});

function wipeOutMenu() {
    $("#mainMenu").animate({ left: "100%", borderBottomLeftRadius: "100%", boxShadow: "0 2px 200px 20px rgba(0,0,0,0.8)" }, "medium", function() {
        $(this).css("visibility", "hidden");
    });
}

function attachInMenu() {
    $("#mainMenu").css("visibility", "visible");
    $("#mainMenu").animate({ left: "0%", borderBottomLeftRadius: "0%", boxShadow: "0 2px 12px 0 rgba(0,0,0,0.8)" }, "medium");
}