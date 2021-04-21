$(document).ready(function () {
    windowResized();
    setupModal("modalLRForm");
    setupScroll();
    window.addEventListener("resize", windowResized);
    window.setTimeout(show, 3000);
});

function setupModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal !== null && modal !== undefined) {
        $(modal).on('show.bs.modal', function (event) {
            $("div.tab-pane").removeClass('in show active');
            $("#" + modalId + " a[role='tab']").removeClass('active show');
            let button = $(event.relatedTarget);
            let tabPill = $("a[href='#" + button.attr("data-auth-modal-tab") + "']");
            let tab = $("div.tab-pane[data-auth-modal-tab='" + button.attr("data-auth-modal-tab") + "']");
            tab.addClass('in show active');
            tabPill.addClass('active show');
        });
    }
};

setupScroll = function () {
    $('#toTopBtn').fadeOut();
    $(window).scroll(function () {
        if ($(this).scrollTop() > 700) {
            $('#toTopBtn').fadeIn();
        } else {
            $('#toTopBtn').fadeOut();
        }
    });
};

windowResized = function () {
    $(".centered").css("margin-left", window.innerWidth / 2 - $(".btn-center").width())
};

show = function () {
    $(".home-banner-0").css("visibility", "visible");
    $("#signals").css("visibility", "hidden");
    $("#signals").css("display", "none");
};
