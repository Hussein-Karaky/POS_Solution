//onVClassFrameLoad = function () {
//    let innerDoc = document.getElementById("vclassFrame").contentWindow.document;
//    Array.prototype.forEach.call(window.parent.document.querySelectorAll("link[rel=stylesheet]"), function (link) {
//        var newLink = innerDoc.createElement("link");
//        newLink.rel = link.rel;
//        newLink.href = link.href;
//        innerDoc.head.appendChild(newLink);
//    });
//};
var waiting = true;
var prompt = true;
wait = function () {
    if (!waiting) {
        let splash = document.querySelector(".home_splash");
        splash.style.visibility = "visible";
        splash.style.display = "block";
        waiting = true;
    }
};

unwait = function () {
    let splash = document.querySelector(".home_splash");
    if (splash !== null) {
        splash.style.visibility = "hidden";
        splash.style.display = "none";
    }
    waiting = false;
};
$(document).ready(function () {
    if (roomId > 0) {
        setTimeout(function () { unwait(); }, 2000);
    } else {
        window.location.href = window.location.origin.concat("home");
    }
    let caller = new AjaxCaller(function (response, text) {
        if (response === 1) {
            console.log("join = success");
        } else {
            console.log("join = rejected");
        }
    }, function (request, status, error) {
        console.error(request.responseText);
    });
    let joinReq = joinRoomReq(roomId);
    caller.postWithPromise(joinReq);
    $(window).on('beforeunload', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        let dueDate = new Date(Date.parse(event.dueDate));
        let endDate = moment(dueDate).add(event.duration, 'm').toDate();
        let isAfter = moment(dueDate).isAfter(new Date());
        abandon();
    });
    let dueDate = new Date(Date.parse(room.DueDate));
    let endDate = moment(dueDate).add(room.Duration, 'm');//.toDate();
    let now = new Date();
    let diff = moment.duration(endDate.diff(now));;
    let minsLeft = diff.asMinutes();
    setTimeout(function () {
        prompt = false;
        let clockdiv = document.getElementById("clockdiv");
        clockdiv.style.visibility = "visible";
        let cd = new CountDown('clockdiv', endDate.toDate(), { volume: 0.1 }, function () {
            let href = "/home";
            window.location.href = href;
        });
        warn("Ony 5 mins left", 2000);
    }, (minsLeft - 5) * 60000);
});

abandon = function () {
    let caller = new AjaxCaller(function (response, text) {
        console.log("abandon: success.");
    }, function (request, status, error) {
        console.error(request.responseText);
    });
    let delReq = abandonRoomReq(roomId, 0, null);
    caller.postWithPromise(delReq);
}