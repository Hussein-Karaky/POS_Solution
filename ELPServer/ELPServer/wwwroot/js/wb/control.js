$(document).ready(function () {

    $("#btnToolbox").click(function () {
        $("#toolbox").toggleClass("toolbox-collapse toolbox-expand");
        let i = $(this).find(".fa-caret-down");
        if (i.length > 0) {
            $(i).removeClass("fa-caret-down");
            $(i).addClass("fa-caret-up");
        } else {
            i = $(this).find(".fa-caret-up");
            $(i).removeClass("fa-caret-up");
            $(i).addClass("fa-caret-down");
        }
    });
});