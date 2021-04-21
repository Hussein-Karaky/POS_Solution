var waiting = true;
wait = function () {
    if (!waiting) {
        let splash = document.querySelector(".home_splash");
        if (splash !== null) {
            splash.style.visibility = "hidden";
            splash.style.display = "none";
        }
        waiting = false;
    }
};

unwait = function () {
    let splash = document.querySelector(".home_splash");
    splash.style.visibility = "hidden";
    splash.style.display = "none";
    waiting = false;
};
$(document).ready(function () {
    if (roomId !== null && roomId.trim() !== "") {
        setTimeout(function () { unwait(); }, 2000);
    } else {
        window.location.href = window.location.origin.concat("home");
    }
});