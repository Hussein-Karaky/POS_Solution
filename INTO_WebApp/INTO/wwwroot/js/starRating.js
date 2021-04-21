function Widget(target = null, clientId = null, clientType = null, css = [], selectorType = "div") {
    this.uid = window.performance.now();
    this.target = target;
    this.selectorType = selectorType;
    this.css = css;
    this.clientId = clientId;
    this.clientType = clientType;
};
Widget.extends(EventDispatcher);
Widget.construct();
Widget.prototype.fixedUId = function () {
    return this.uid.toString().replace('.', '_');
};
Widget.prototype.markupId = function () {
    return this.constructor.name.concat(this.uid).replace('.', '_');
};
Widget.prototype.getDisplay = function () {
    let display = document.getElementById(this.markupId());
    if (display === null) {
        display = document.createElement(this.selectorType);
        display.id = this.markupId();
        display.addClasses(this.css);
    }
    return display;
};

function StarRating(clientId = null, clientType = null, value = 0, maxValue = 5, target = null, css = []) {
    Widget.call(this, target, clientId, clientType, css);
    this.value = value;
    this.valueHover = value;
    this.maxValue = maxValue;
    this.test = null;
};
StarRating.extends(Widget);
StarRating.construct();
StarRating.prototype.getDisplay = function () {
    let main = this;
    let display = Widget.prototype.getDisplay.call(this);
    display.addEventListener("DOMNodeInsertedIntoDocument", function (e) {
        e.stopPropagation();
        main.setValue(main.value);
    }, false);
    let stars = document.createElement("div");
    stars.id = "starrate".concat(this.fixedUId());
    stars.addClasses(["starrate", "mt-3", "inline-block"]);
    stars.style.minWidth = "140px";
    stars.setAttribute("data-val", this.value);
    stars.setAttribute("data-max", this.maxValue);
    stars.addEventListener("click", function () {
        $(this).data('val', main.valueHover);
        $(this).addClass('saved');
        main.submit();
    });
    stars.addEventListener("mouseout", function () {
        main.upStars($(this).data('val'));
    });
    let ctrl = document.createElement("span");
    ctrl.addClasses(["starrate-ctrl"]);
    ctrl.style.width = "118px";
    ctrl.style.height = "21px";
    ctrl.addEventListener("mousemove", function (e) {
        main.valueHover = Math.ceil(main.calcSliderPos(e, main.maxValue) * 2) / 2;
        main.upStars(main.valueHover);
    });
    let cont = document.createElement("span");
    cont.addClasses(["starrate-cont", "m-1"]);
    for (i = 0; i < this.maxValue; i++) {
        let star = document.createElement("i");
        star.addClasses(["fas", "fa-fw", "fa-star", "ml-1"]);
        cont.appendChild(star);
    }
    stars.appendChild(ctrl);
    stars.appendChild(cont);
    this.test = document.createElement("span");
    this.test.addClasses(["ml-1", "mr-auto", "pl-4", "display-5"]);
    this.test.innerHTML = this.value.toFixed(1);
    display.appendChild(stars);
    display.appendChild(this.test);
    return display;
};
StarRating.prototype.calcSliderPos = function (e, maxV) {
    return e.offsetX / e.target.clientWidth * parseInt(maxV, 10);
};
StarRating.prototype.upStars = function (v) {
    let val = parseFloat(v);
    this.value = parseFloat(v);
    this.test.innerHTML = val.toFixed(1);

    let full = Number.isInteger(val);
    val = parseInt(this.value);
    let starsCont = document.getElementById("StarRating32612.829999998212");
    let stars = $("#starrate".concat(this.fixedUId(), " i"));//$(starsCont).find("i");//$("#".concat(this.markupId(), " i"));//this.getDisplay().querySelectorAll("i");

    stars.slice(0, val).attr("class", "fas fa-fw fa-star ml-1");
    if (!full) { stars.slice(val, val + 1).attr("class", "fas fa-fw fa-star-half-alt ml-1"); val++; }
    stars.slice(val, this.maxValue).attr("class", "far fa-fw fa-star ml-1");
};
StarRating.prototype.setValue = function (v) {
    $("#starrate".concat(this.fixedUId())).data('val', v);
    $("#starrate".concat(this.fixedUId())).addClass('saved');
    this.upStars($("#starrate".concat(this.fixedUId())).data('val'));
};
StarRating.prototype.submit = function () {
    if (accountManager === null || accountManager.currentUser === null) {
        showSignIn("{\"RedirectAction\": \"Index\", \"RedirectController\": \"Home\"}");
        return;
    }

    let main = this;
    let caller = new AjaxCaller(function (response, text) {
        let obj = response.data.where("objId", main.clientId);
        if (obj.length > 0) {
            main.setValue(obj[0].objRating);
        }
        greet("Rating submitted", 2000);
    }, function (request, status, error) {
        error("Rating not submitted", 5000);
    });
    let req = rateObjReq(this.clientId, this.clientType, this.value);
    caller.postWithPromise(req);
};