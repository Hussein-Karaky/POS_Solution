$(document).ready(function () {
    windowResized();
    setupModal("modalLRForm");
    setupScroll();
    window.addEventListener("resize", windowResized);

    if (window["accountManager"] !== undefined && accountManager !== null && accountManager.currentUser !== null && accountManager.currentUser.language !== null) {
        ddlLang.setValue(accountManager.currentUser.language.id);
        ddlLang.getDisplay().addEventListener("change", function (e, s) {
            language = parseInt(this.value);
            selectedLang = langList.data.filter(l => l.id === language)[0];
            document.querySelector("html").lang = selectedLang.code;
            document.dir = selectedLang.rtl ? "rtl" : "ltr";
            accountManager.currentUser.language = selectedLang;
            accountManager.updateLang();
        });
    }
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
        if ($(this).scrollTop() > window.innerHeight) {
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
};

showElementInPage = function(selector){
    let element = document.querySelector(selector);
    if(element !== undefined && element !== null){
        element.scrollIntoView({ behavior: 'smooth', block: 'center'});
    }
};

