var selectedLang = { id: 1, description: "English", rtl: false, code: "en" };
const uniqueKeys = {
    length: 0,

    add: function (element) {
        if ([].filter.call(this, function (value, index, arr) {
            return value.field === element.field && value.type === element.type;
        }).length === 0) {
            [].push.call(this, element);
        }
    },
    get: function (key) {
        return [].filter.call(this, function (value, index, arr) {
            return value.type === key;
        });
    }
};
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
var sound = new Audio(window.location.origin.concat("/audio/beep-07.mp3"));
var language = 1;
var today = new Date();
var timezoneOffset = function () {
    today = new Date();
    return today.timezoneOffset;
};
setLang = function (lang) {
    language = lang;
};
function imageToDataUri(img, width, height) {

    // create an off-screen canvas
    var canvas = document.getElementById('canvas_min'),
        ctx = canvas.getContext('2d');

    // set its dimension to target size
    canvas.width = width;
    canvas.height = height;

    // draw source image into the off-screen canvas:
    ctx.drawImage(img, 0, 0, width, height);

    // encode image to data-uri with base64 version of compressed image
    return canvas.toDataURL("image/jpeg", 0.8);
}
//document.onreadystatechange = function () {
//    var state = document.readyState;
//    if (window["accountManager"] !== undefined) {
//        if (state == 'interactive') {
//            accountManager.wait();
//        } else if (state == 'complete') {
//            setTimeout(function () {
//                accountManager.start();
//            }, 1000);
//        }
//    }
//}
$(document).ready(
    function () {
        //if ('serviceWorker' in navigator) {
        //    window.addEventListener('load', function () {
        //        navigator.serviceWorker.register('../js/sw.js', { scope: '/js/' }).then(function (registration) {
        //            console.log('Service worker registered with scope: ', registration.scope);
        //        }, function (err) {
        //            console.log('ServiceWorker registration failed: ', err);
        //        });
        //    });
        //}
        var ddlLang = new RichSelect("langCont", window.location.origin.concat("/account/langs/"), "id", "description", null, undefined, undefined, undefined, undefined, undefined, "100px");
        ddlLang.defaultNone = false;
        ddlLang.dataBind();
        ddlLang.finalize();

        if (window["accountManager"] !== undefined && accountManager !== null && accountManager.currentUser !== null && accountManager.currentUser.language !== null) {
            language = accountManager.currentUser.language.id;
            ddlLang.setValue(language);
        }
        ddlLang.finalize();
        ddlLang.getDisplay().addEventListener("change", function (e, s) {
            language = parseInt(this.value);
            selectedLang = langList.data.filter(l => l.id === language)[0];
            if (selectedLang !== undefined) {
                document.querySelector("html").lang = selectedLang.code;
                document.dir = selectedLang.rtl ? "rtl" : "ltr";
                accountManager.currentUser.language = selectedLang;
                accountManager.updateLang();
            }
        });

        let timezoneOffset = document.getElementById("timezoneOffset");
        if (timezoneOffset !== null) {
            timezoneOffset.defaultValue = new Date().getTimezoneOffset();
        }
        window.localStorage.setItem("app.state", true);
        recycleBin.create();
        if (window["AccountManager"] !== undefined) {
            setTimeout(function () { accountManager.start(); }, 2000);

            let av = new AppsViewer();
            for (i = 0; i < 16; i++) {
                av.add(new Shortcut("#", "User App " + i, null));
            }
            av.create("apps-container");
            setupSignAgreement();
            setupBusinessType();
            accountManager.setupSignUp();
            accountManager.setupLogin();
            accountManager.setupLogout();

            if (accountManager.currentUser !== null) {
                accountManager.fetchRatings();
                accountManager.fetchPicture();
                accountManager.assignTitle();
                accountManager.assignFreeResponse();
                accountManager.fetchAvailability();
                accountManager.assignAmbition();
                //accountManager.assignAvailability();
                $('[data-role=user-id]').val(accountManager.currentUser.userId);
            }
        }
        $('[data-toggle="tooltip"]').tooltip()
    }
);
var tutorDegrees = [{
    lookupDetailsDescription: "None",
    lookupDetailsId: "0"
}];

reloadUser = function () {
    if (accountManager === null) {
        accountManager = new AccountManager();
        accountManager.load();
    }
};
window.addEventListener("beforeunload", function (e) {
    //window.localStorage.setItem("app.state", false);
}, false);

const _ = variable => Object.keys(variable)[0];
Object.defineProperty(URL, 'parseUrl', {
    value: function (str) {
        let url = null;
        try {
            url = new URL(str);
            return url;
        } catch (_) {
            return url;
        }
    }
});
Object.defineProperty(String, 'isString', {
    value: function (obj) {
        return obj !== null && obj !== undefined && (obj instanceof String || Object.getPrototypeOf(obj) === String.prototype);
    }
});
Object.defineProperty(Function, 'isFunction', {
    value: function (obj) {
        return obj !== null && obj !== undefined && (obj instanceof Function || Object.getPrototypeOf(obj) === Function.prototype);
    }
});
Array.prototype.contains = function (hasId) {
    this.forEach(c => { if (c.id === hasId.id) { return true; } return false; })
};
Array.prototype.where = function (key, value) {
    return this.filter(function (item, index) { return item[key] === value; });
};
Array.prototype.except = function (key, value) {
    return this.filter(function (item, index) { return item[key] !== value; });
};
Array.prototype.removeWhere = function (key, value) {
    let main = this.filter(function (item, index) { return item[key] !== value; })
    this.length = 0;
    main.forEach(item => this.push(item));
    return this;
};
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
String.prototype.decapitalize = function () {
    return this.charAt(0).toLowerCase() + this.slice(1);
}
String.prototype.toWords = function () {
    let words = this.replace(/\s/g, '').replace(/([A-Z])/g, " $1");
    return words.charAt(0).toUpperCase() + words.slice(1);
};
String.prototype.toCamelCase = function () {
    return this
        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
        .replace(/^\w/, c => c.toLowerCase());
};
Function.prototype.extends = function (superType = Object) {
    if (superType instanceof Function) {
        this.prototype = Object.create(superType.prototype);
    } else {
        console.error("Cannot extend ".concat(superType.prototype.constructor.name));
    }
};
Function.prototype.setUniqueKey = function (field = "id") {
    if (Object.keys(new this).includes(field)) {
        uniqueKeys.add({ type: this.name, field: field });
    }
};
Function.prototype.getUniqueKey = function () {
    let el = uniqueKeys.get(this.name);
    return el.length > 0 ? el[0].field : null;
};
Function.prototype.construct = function (attributes = {
    configurable: false,
    enumerable: false,
    writable: false,
    value: this
}) {
    Object.defineProperty(this.prototype, "constructor", attributes);
};
CONSTRUCTOR = function (type, attributes = {
    configurable: false,
    enumerable: false,
    writable: false,
    value: type
}) {
    Object.defineProperty(type.prototype, "constructor", attributes);
};
const is = function (type, variable, getter) {
    let i = _({ is }).concat(variable.capitalize());
    if (type.prototype[i] === undefined) {
        Object.defineProperty(type.prototype, i, {
            value: getter
        });
    }
};
const get = function (type, variable, getter) {
    let g = _({ get }).concat(variable.capitalize());
    if (type.prototype[g] === undefined) {
        Object.defineProperty(type.prototype, g, {
            value: getter
        });
    }
};
const set = function (type, variable, setter) {
    let s = _({ set }).concat(variable.capitalize());
    if (type.prototype[s] === undefined) {
        Object.defineProperty(type.prototype, s, {
            value: setter
        });
    }
};
const static = function (type, variable, value, readOnly = false) {
    if (type === null || type === undefined || !String.isString(variable)) { console.error("Invalid arguments at static declaration."); return false; }
    if (Function.isFunction(value)) {
        Object.defineProperty(type, variable, {
            value: value
        });
    } else {
        Object.defineProperty(type, variable, {
            value: value, configurable: !readOnly//false for final
        });
        if (!readOnly) {
            Object.defineProperty(type, _({ set }).concat(variable.capitalize()), {
                value: function (value) {
                    Object.defineProperty(type, variable, {
                        value: value, configurable: true
                    });
                }
            });
        }
        Object.defineProperty(type, _({ get }).concat(variable.capitalize()), {
            value: function () { return type[variable]; }
        });
    }
};
get(HTMLElement, "data", function () {
    let factory = this.getFactory();
    if (factory !== null) {
        return factory.dat;
    }
    return null;
});
get(HTMLElement, "factory", function () {
    let dataId = this.getAttribute("data-id");
    if (dataId !== null && dataId !== undefined && String.isString(dataId) && dataId.length > 0) {
        let id = parseFloat(dataId);
        if (isNaN(id)) {
            console.error("Invalid Identifier: ".concat(id));
            return false;
        }
        return root.get(id)[0];
    }
    return null;
});
get(HTMLElement, "dataSource", function () {
    let factory = this.getFactory();
    if (factory !== null) {
        return factory.getDataSource();
    }
    return null;
});
set(HTMLElement, "dataSource", function (dataSource) {
    let factory = this.getFactory();
    if (factory !== null) {
        factory.setDataSource(dataSource);
    }
});
HTMLElement.prototype.dataBind = function () {
    let factory = this.getFactory();
    if (factory !== null) {
        factory.dataBind();
    }
};
HTMLElement.prototype.addClasses = function (classes = []) {
    if (Array.isArray(classes)) {
        classes.forEach(cls => this.classList.add(cls));
    }
};
HTMLElement.prototype.attr = function (attribute, value) {
    if (String.isString(attribute) && attribute.length > 0) {
        this.setAttribute(attribute, value);
    }
};
get(HTMLDocument, "elementData", function (selector) {
    let element = this.querySelector(selector);
    if (element !== null && element !== undefined) {
        return element.getData();
    }
});
get(HTMLDocument, "elementFactory", function (selector) {
    let element = this.querySelector(selector);
    if (element !== null && element !== undefined) {
        return element.getFactory();
    }
});
randomIndex = function (max = 5) {
    return Math.floor(Math.random() * 5);
};
getNode = function (domObj) {
    return domObj.getAttribute("data-id");
};
scrollParentToChild = function (parent, child) {
    if (parent !== null && parent !== undefined && child !== null && child !== undefined) {
        // Where is the parent on page
        var parentRect = parent.getBoundingClientRect();
        // What can you see?
        var parentViewableArea = {
            height: parent.clientHeight,
            width: parent.clientWidth
        };

        // Where is the child
        var childRect = child.getBoundingClientRect();
        // Is the child viewable?
        var isViewable = (childRect.top >= parentRect.top) && (childRect.top <= parentRect.top + parentViewableArea.height);

        // if you can't see the child try to scroll parent
        if (!isViewable) {
            // scroll by offset relative to parent
            parent.scrollTop = (childRect.top + parent.scrollTop) - parentRect.top;
        }
    }
};
HTMLElement.prototype.trigger = function (
    eventType) {
    const event = document.createEvent("Event");
    event.initEvent("change", true, true);
    this.dispatchEvent(event);
};
HTMLElement.prototype.val = function (value) {
    if (this.getAttribute("default") !== null && (value === null || value === undefined || (this.getAttribute("min") !== null && value < this.getAttribute("min")))) {
        this.innerHTML = this.getAttribute("default");
    } else {
        this.innerHTML = value;
    }
    return this;
};
HTMLInputElement.prototype.val = function (value) {
    if (this.getAttribute("default") !== null && (value === null || value === undefined || (this.getAttribute("min") !== null && value < this.getAttribute("min")))) {
        this.innerHTML = this.getAttribute("default");
    } else {
        this.value = value;
    }
    return this;
};
HTMLTextAreaElement.prototype.val = function (value) {
    if (this.getAttribute("default") !== null && (value === null || value === undefined || (this.getAttribute("min") !== null && value < this.getAttribute("min")))) {
        this.innerHTML = this.getAttribute("default");
    } else {
        this.value = value;
    }
    return this;
};
const whiteCheckInGreen = function (data) {
    let spn = document.createElement("span");
    ["badge", "badge-success"].forEach(cls => spn.classList.add(cls));
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("viewBox", "10 10 32 32");

    let path = '<path class="path-checkmark" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" stroke-width="4" stroke="white" style="stroke: white;"></path>';
    svg.innerHTML = path;
    spn.appendChild(svg);

    return spn;
};
const pending = function (data, sender) {
    let spn = document.createElement("span");
    $(spn).data(sender.getParent().dat);
    ["badge", "white", "p-0", "btn-rounded"].forEach(cls => spn.classList.add(cls));
    let path = new SVGPath(null, null, null, null, null, "M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 12v-6h-2v8h7v-2h-5z");
    let svg = new SVG(null, null, "#ffc400", null, null, "0 0 24 24", 24, 24);
    svg.add(path);
    spn.appendChild(svg.getDisplay());

    return spn;
};
const greenCheckInCircle = function (data, sender) {
    let spn = document.createElement("span");
    $(spn).data(sender.getParent().dat);
    ["badge", "white", "p-0", "btn-rounded"].forEach(cls => spn.classList.add(cls));
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("viewBox", "-4 -4 136.2 136.2");
    svg.setAttribute("style", "display: block;");
    let paint = '<circle class="path circle" fill="none" stroke="#73AF55" stroke-width="12" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"></circle><polyline class="path check" fill="none" stroke="#73AF55" stroke-width="12" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5"></polyline>';
    svg.innerHTML = paint;
    spn.appendChild(svg);

    return spn;
};
const greenCheckInCircleLink = function (data, sender) {
    let a = document.createElement("a");
    a.setAttribute("data-toggle", "modal");
    a.setAttribute("data-target", "#mdlEditMaterial");
    a.setAttribute("data-role", "material-edit");
    $(a).data(sender.getParent().dat);
    ["badge", "white", "p-0", "btn-rounded"].forEach(cls => a.classList.add(cls));
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("viewBox", "-4 -4 136.2 136.2");
    svg.setAttribute("style", "display: block;");
    let paint = '<circle class="path circle" fill="none" stroke="#73AF55" stroke-width="12" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"></circle><polyline class="path check" fill="none" stroke="#73AF55" stroke-width="12" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5"></polyline>';
    svg.innerHTML = paint;
    a.appendChild(svg);

    return a;
};
const redCrossInCircle = function (data, sender) {
    let spn = document.createElement("span");
    $(spn).data(sender.getParent().dat);
    ["badge", "white", "p-0", "btn-rounded"].forEach(cls => spn.classList.add(cls));
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("viewBox", "-4 -4 136.2 136.2");
    svg.setAttribute("style", "display: block;");
    let paint = '<circle class="path circle" fill="none" stroke="#D06079" stroke-width="12" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"></circle><line class="path line" fill="none" stroke="#D06079" stroke-width="12" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"></line><line class="path line" fill="none" stroke="#D06079" stroke-width="12" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"></line>';
    svg.innerHTML = paint;
    spn.appendChild(svg);

    return spn;
};
const redCrossInCircleLink = function (data, sender) {
    let a = document.createElement("a");
    a.setAttribute("data-toggle", "modal");
    a.setAttribute("data-target", "#mdlEditMaterial");
    a.setAttribute("data-role", "material-edit");
    $(a).data(sender.getParent().dat);
    ["badge", "white", "p-0", "btn-rounded"].forEach(cls => a.classList.add(cls));
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("viewBox", "-4 -4 136.2 136.2");
    svg.setAttribute("style", "display: block;");
    let paint = '<circle class="path circle" fill="none" stroke="#D06079" stroke-width="12" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"></circle><line class="path line" fill="none" stroke="#D06079" stroke-width="12" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"></line><line class="path line" fill="none" stroke="#D06079" stroke-width="12" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"></line>';
    svg.innerHTML = paint;
    a.appendChild(svg);

    return a;
};
const btnTakeTest = function (data, parent) {
    if (parent.getParent().dat !== null && parent.getParent().dat.passed) {
        return pending(data, parent);
    }
    let btn = document.createElement("a");
    ["badge", "blue-text", "mx-1", "btn-outline", "thin", "btn-rounded", "white", "prevent-parent-click"].forEach(cls => btn.classList.add(cls));
    btn.innerHTML = "Take Test";
    btn.addEventListener("click", function (e) {
        e.stopImmediatePropagation();
        event.stopPropagation();
    });
    let wholeData = null;
    if (parent !== undefined && parent !== null && parent.getParent() !== undefined && parent.getParent() !== null) {
        wholeData = parent.getParent().dat;
    }
    if (wholeData !== undefined && wholeData !== null) {
        btn.setAttribute("href", window.location.origin.concat("/").concat("test/test").concat("/?material=" + wholeData.sysId + "&lang=" + language));
    }
    return btn;
};
const zeroAsDash = function (data) {
    let spn = document.createElement("span");
    spn.innerHTML = "-";
    return spn;
};
const progressPen = function (data) {
    let progress = document.createElement("div");
    ["pen-progress"].forEach(cls => progress.classList.add(cls));
    let capsule = document.createElement("div");
    ["pen-capsule"].forEach(cls => capsule.classList.add(cls));
    let cartridge = document.createElement("div");
    ["pen-cartridge"].forEach(cls => cartridge.classList.add(cls));
    cartridge.setAttribute("style", "height: " + (100 - data) + "%;");
    capsule.appendChild(cartridge);
    let penTip = document.createElement("div");
    ["pen-tip"].forEach(cls => penTip.classList.add(cls));
    progress.appendChild(capsule);
    progress.appendChild(penTip);

    return progress;
};
const asIs = function (data) {
    let spn = document.createElement("span");
    spn.innerHTML = data;
    return spn;
};
const ellipsis = function (data) {
    let spn = document.createElement("span");
    ["inline-block", "ellipsis"].forEach(cls => spn.classList.add(cls));
    spn.innerHTML = data;//.substring(0, 6).concat("...");
    return spn;
};
const progressPenBig = function (data) {
    let progress = document.createElement("div");
    ["pen-progress", "big"].forEach(cls => progress.classList.add(cls));
    let capsule = document.createElement("div");
    ["pen-capsule"].forEach(cls => capsule.classList.add(cls));
    let cartridge = document.createElement("div");
    ["pen-cartridge"].forEach(cls => cartridge.classList.add(cls));
    cartridge.setAttribute("style", "height: " + (100 - data) + "%;");
    capsule.appendChild(cartridge);
    let penTip = document.createElement("div");
    ["pen-tip", "arrow-down"].forEach(cls => penTip.classList.add(cls));
    let penInkTip = document.createElement("div");
    ["pen-ink-tip", "arrow-down"].forEach(cls => penInkTip.classList.add(cls));
    progress.appendChild(capsule);
    progress.appendChild(penTip);
    progress.appendChild(penInkTip);

    return progress;
};
const name = function (data, sender, dataType) {
    let spn = document.createElement("span");
    spn.setAttribute("data-role", dataType);
    spn.setAttribute("data-id", dataType);
    spn.innerHTML = data["name"];
    return spn;
};
const meeting = function (data) {
    let spn = document.createElement("span");
    spn.innerHTML = "Meeting";
    return spn;
};
const mgt = function (data) {
    let spn = document.createElement("span");
    spn.innerHTML = "INTO MGT.";
    return spn;
};
const availCheck = function (data, owner) {
    let checkBox = new CheckBox("", false, function (e) {
        let input = e.target;
        this.getParent().getParent().getParent().dat[input.getAttribute("data-time")][input.getAttribute("data-day")].checked = input.checked;
    }, false, ["option-input", "checkbox", "square-40", "btn-outline", "border-1"]);
    checkBox.setId("availCheck".concat(owner.getId()));
    checkBox.setParent(owner);
    let input = checkBox.getDisplay();
    input.id = checkBox.getId();
    input.setAttribute("data-role", "availability");
    input.setAttribute("data-time", data.time);
    input.setAttribute("data-day", data.day.name);
    input.setAttribute("data-id", data.day.id);

    return input;
};
const activeCheck = function (data, owner) {
    let checkBox = new CheckBox("", data, function (e) {
        let input = e.target;
    }, false, ["option-input", "checkbox", "btn-outline", "border-1", "square-24"]);
    checkBox.setId("avtiveCheck".concat(owner.getId()));
    checkBox.setParent(owner);
    let input = checkBox.getDisplay();
    input.id = checkBox.getId();
    if (owner.getParent() !== null && owner.getParent().dat !== null) {
        input.setAttribute("data-role", owner.getParent().dat.property);
    }

    return input;
};
const inKB = function (data, sender) {
    let spn = document.createElement("span");
    spn.innerHTML = parseFloat(data / 1024).toFixed(1).toString().concat("KB");
    return spn;
};
const nothing = function (data, sender) {
    let spn = document.createElement("span");
    return spn;
};

var gridRouter = {
    materialsUI: {
        boolean: {
            passed: {
                false: btnTakeTest, true: pending
            },
            approved: {
                false: btnTakeTest, true: greenCheckInCircle
            },
            active: {
                false: redCrossInCircle, true: greenCheckInCircle
            }
        },
        number: {
            id: { negative: asIs, 0: asIs, positive: asIs },
            sysId: { negative: asIs, 0: asIs, positive: asIs },
            certified: { negative: zeroAsDash, 0: zeroAsDash, positive: greenCheckInCircle },
            points: { negative: zeroAsDash, 0: zeroAsDash, positive: progressPen }
        },
        string: {
            name: { empty: asIs, fit: asIs, overflow: ellipsis },
        },
        object: {
            subject: {
                default: name,
                null: nothing
            },
            curriculum: {
                default: name,
                null: nothing
            },
            instituteType: {
                default: name,
                null: nothing
            },
            cycle: {
                default: name,
                null: nothing
            },
            pricing: {
                default: nothing,
                null: nothing
            }
        }
    },
    vRoomsUI: {
        boolean: {
            paid: {
                false: redCrossInCircle, true: greenCheckInCircle
            },
            active: {
                false: redCrossInCircle, true: greenCheckInCircle
            }
        },
        number: {
            id: { negative: asIs, 0: asIs, positive: asIs },
            duration: { negative: asIs, 0: asIs, positive: asIs }
        },
        string: {
            title: { empty: asIs, fit: asIs, overflow: ellipsis },
            description: { empty: asIs, fit: asIs, overflow: ellipsis },
            dueDate: { empty: asIs, fit: asIs, overflow: asIs },
            password: { empty: asIs, fit: asIs, overflow: asIs },
            dateStarted: { empty: asIs, fit: asIs, overflow: asIs },
            dateEnded: { empty: asIs, fit: asIs, overflow: asIs }
        },
        object: {
            description: {
                null: nothing
            },
            material: {
                default: name,
                null: meeting
            },
            host: {
                default: name,
                null: mgt
            },
            dueDate: {
                null: nothing
            },
            duration: {
                null: nothing
            },
            password: {
                null: nothing
            },
            dateStarted: {
                null: nothing
            },
            dateEnded: {
                null: nothing
            }

        }
    },
    filesUI: {
        boolean: {
            readOnly: {
                false: asIs, true: asIs
            }
        },
        number: {
            id: { negative: asIs, 0: asIs, positive: asIs },
            userId: { negative: asIs, 0: asIs, positive: asIs },
            size: { negative: zeroAsDash, 0: zeroAsDash, positive: inKB },
            intSourceType: { negative: zeroAsDash, 0: zeroAsDash, positive: asIs },
            source: { negative: zeroAsDash, 0: zeroAsDash, positive: asIs }
        },
        string: {
            name: { empty: asIs, fit: asIs, overflow: ellipsis },
            path: { empty: asIs, fit: asIs, overflow: ellipsis },
            virtualPath: { empty: asIs, fit: asIs, overflow: ellipsis },
            type: { empty: asIs, fit: asIs, overflow: ellipsis },
            description: { empty: asIs, fit: asIs, overflow: ellipsis },
            privacy: { empty: asIs, fit: asIs, overflow: ellipsis }
        },
        object: {
            parent: {
                default: name,
                null: nothing
            }
        }
    },
    briefAvailUI: {
        object: {
            time: {
                default: name,
                null: nothing
            },
            sun: {
                default: availCheck,
                null: nothing
            },
            mon: {
                default: availCheck,
                null: nothing
            },
            tue: {
                default: availCheck,
                null: nothing
            },
            wed: {
                default: availCheck,
                null: nothing
            },
            thu: {
                default: availCheck,
                null: nothing
            },
            fri: {
                default: availCheck,
                null: nothing
            },
            sat: {
                default: availCheck,
                null: nothing
            }
        }
    },
    materialPropsUI: {
        boolean: {
            value: {
                false: activeCheck,
                true: activeCheck
            }
        },
        string: {
            property: { empty: asIs, fit: asIs, overflow: ellipsis },
            description: { empty: asIs, fit: asIs, overflow: ellipsis }
        }
    }
};

const routeCase = {
    boolean: function (data, options) { return data.toString(); },
    number: function (data, options) {
        if (data < 0) return "negative"; else if (data > 0) return "positive"; return data.toString();
    },
    string: function (data, options) {
        if (data.length === 0) return "empty"; else if (data.length < (options !== undefined && options.max !== undefined ? options.max : 10)) return "fit"; return "overflow";
    },
    object: function (data, options) { return data !== null && data !== undefined ? "default" : "null"; }
};

function Type() {
};
Type.construct();

function Bool() {
};
Bool.extends(Type);
Bool.construct();
static(Bool, "0", false);
static(Bool, "1", true);
static(Bool, "false", false);
static(Bool, "true", true);
static(Bool, "parse", function (string, pattern) {
    if (String.isString(string)) {
        return Bool[string.toLocaleLowerCase()];
    }
});

function Integer() { };
Integer.extends(Type);
Integer.construct();
static(Integer, "parse", function (string, pattern) {
    if (String.isString(string)) {
        return parseInt(string);
    }
});

function Float() { };
Float.extends(Type);
Float.construct();
static(Float, "parse", function (string, pattern) {
    if (String.isString(string)) {
        return parseFloat(string);
    }
});

function Property(name = null, dataType = Object, value = null) {
    this.name = name;
    this.dataType = dataType;
    this.value = value;
    get(Property, name, function () {
        return this.value;
    });
    set(Property, name, function () {
        return this.value;
    });
};
Property.construct();

function DataRouter(data = null, route = null) {
    this.data = data;
    this.route = String.isString(route) ? route.split(".") : [];
};
DataRouter.construct();
DataRouter.prototype.get = function (index = 0) {
    if (this.route.length > 0) {
        let member = this.route[index++];
        this.data = this.data[member];
        if (index < this.route.length) {
            return this.get(index);
        }
        return this.data;
    }
};
DataRouter.prototype.set = function (value = null, field = null, index = 0) {
    if (this.data !== null) {
        if (field === null) {
            return this.set(value, this.data, index);
        }
        let member = this.route[index];
        if (this.route.length > 0 && index < this.route.length - 1) {
            return this.set(value, field[member], ++index);
        }
        return field[member] = value;
    }
    return null;
};

function DataEntity() {
    this.properties = [];
};

function EventDispatcher() {
    this.events = {};
};
EventDispatcher.construct();
EventDispatcher.prototype.clear = function () {
    this.events = {};
};
EventDispatcher.prototype.addEventListener = function (event, listener) {
    if (!String.isString(event)) {
        return;
    }
    if (this.events[event] === null || this.events[event] === undefined || !(this.events[event] instanceof Array)) {
        this.events[event] = [];
    }
    if (listener instanceof Function && !this.events[event].contains(listener)) {
        this.events[event].push(listener);
    }
};
EventDispatcher.prototype.dispatch = function (event, details) {
    let cancelled = false
    if (this.events[event] !== null && this.events[event] !== undefined) {
        this.events[event].forEach(listener => { if (listener({ target: this, details }) === false) { cancelled = true; } });
    }
    return cancelled;
};

function Node(creationTarget = null,
    dataSource = null,
    selectorType = "div",
    data = null,
    css = [],
    autoId = true,
    namespace = "http://www.w3.org/1999/xhtml",
    dataRoute = null,
    singleton = false,
    asRoot = false,
    dataSourceParams = null) {
    EventDispatcher.call(this);
    this.index = 0;
    this.id = "0";
    this.uid = window.performance.now();
    this.namespace = namespace;
    this.dataRoute = dataRoute;
    this.singleton = singleton;
    this.autoId = autoId;
    this.parent = null;
    this.selectorType = selectorType;
    this.selectorIndex = null;
    this.options = {};
    this.dat = data;
    this.creationTarget = null;
    this.setCreationTarget(creationTarget);
    this.dataSrc = dataSource;
    this.dataSourceParams = dataSourceParams;
    this.css = css instanceof Array && css.length > 0 && String.isString(css[0]) ? css : [];
    this.editing = false;
    this.parentDomId = null;
    this.focusable = false;
    this.focused = false;
    this.clearOnDataBind = true;
    this.uiMethod = "getDOM";
    this.model = null;
    if (asRoot !== true) {
        root.add(this);
    }
};
Node.extends(EventDispatcher);
Node.construct();
Object.defineProperty(Node, 'CompareProperty', {
    value: "id", configurable: true//false for final
});
Object.defineProperty(Node, 'SetCompareProperty', {
    value: function (prop) {
        Object.defineProperty(Node, 'CompareProperty', {
            value: prop, configurable: true
        });
    }
});
Object.defineProperty(Node, 'GetCompareProperty', {
    value: function () { return Node.CompareProperty; }
});
Object.defineProperty(Node, 'ASC', {
    value: function (a, b) {
        if (a[Node.CompareProperty] > b[Node.CompareProperty]) return 1;
        if (a[Node.CompareProperty] < b[Node.CompareProperty]) return -1;
        return 0;
    }, configurable: true
});
Object.defineProperty(Node, 'DESC', {
    value: function (a, b) {
        if (a[Node.CompareProperty] < b[Node.CompareProperty]) return 1;
        if (a[Node.CompareProperty] > b[Node.CompareProperty]) return -1;
        return 0;
    }, configurable: true
});
get(Node, "creationTarget", function () { return this.creationTarget; });
set(Node, "creationTarget", function (creationTarget) {
    this.creationTarget = creationTarget;
});
get(Node, "dataSource", function () { return this.dataSrc; });
set(Node, "dataSource", function (dataSource) {
    let oldSrc = this.dataSrc;
    this.dataSrc = dataSource;
    this.dataSourceChanged(oldSrc);
});
get(Node, "dataSourceParams", function () { return this.dataSourceParams; });
set(Node, "dataSourceParams", function (dataSourceParams) {
    this.dataSourceParams = dataSourceParams;
});
get(Node, "clearOnDataBind", function () { return this.clearOnDataBind; });
set(Node, "clearOnDataBind", function (clear) {
    this.clearOnDataBind = clear;
});
get(Node, "uiMethod", function () { return this.uiMethod; });
set(Node, "uiMethod", function (uiMeth) {
    this.uiMethod = uiMeth;
});
get(Node, "parentDomId", function () { return this.parentDomId; });
set(Node, "parentDomId", function (value) {
    if (value !== null && value !== undefined && String.isString(value) && value.length > 0) {
        this.parentDomId = value;
    }
});
is(Node, "singleton", function () { return this.singleton; });
set(Node, "singleton", function (value) {
    this.singleton = value;
});
is(Node, "focusable", function () { return this.focusable; });
set(Node, "focusable", function (value) {
    this.focusable = value;
});
is(Node, "focused", function () { return this.focused; });
set(Node, "focused", function (value) {
    this.focused = value;
});
get(Node, "index", function () {
    if (this.getParent() !== null) {
        return this.getParent().children.indexOf(this);
    }
    return this.index;
});
set(Node, "index", function (ix) {
    this.index = ix;
});
get(Node, "id", function () {
    return this.id;
});
get(Node, "model", function () {
    return this.model;
});
set(Node, "model", function (model) {
    this.model = model;
});
set(Node, "id", function (id) {
    this.id = id;
});
get(Node, "parent", function () {
    return this.parent;
});
set(Node, "parent", function (parent) {
    this.parent = parent;
    return this;
});
Node.prototype.defaultValue = function () {
    return null;
};
Node.prototype.hasValidData = function () {
    return this.dat !== null && this.dat !== undefined;
};
set(Node, "selectorType", function (selectorType) {
    this.selectorType = selectorType;
});
set(Node, "selectorIndex", function (selectorIndex) {
    this.selectorIndex = selectorIndex;
});
get(Node, "valueDOM", function () {
    return document.getElementById(this.autoId === true ? this.selectorType.concat(this.selectorIndex) : this.getId());
});
Node.prototype.getDOM = function () {
    return document.getElementById(this.constructor.name.concat(this.selectorIndex));
};
Node.prototype.getValue = function () {
    return document.getElementById(this.selectorType.concat(this.selectorIndex)).value;
};
get(Node, "control", function () {
    return document.querySelector('[data-id="'.concat(this.uid).concat('"]'));
});
Node.prototype.reset = function () { };
Node.prototype.isEmpty = function () {
    return this.getValue() == this.defaultValue();
};
Node.prototype.data = function () {
    return { value: document.getElementById(this.selectorType.concat(this.selectorIndex)).value };
};
Node.prototype.dataSourceChanged = function (oldSrc) { };
Node.prototype.dataBind = function (onSuccess, onError) {
    let main = this;
    let url = URL.parseUrl(this.getDataSource());
    if (url !== null) {
        let error = function (request, status, error) {
            console.error(request.responseText);
        };
        $.ajax({
            type: "POST",
            url: main.getDataSource(),
            data: main.getDataSourceParams(),
            success: function (data, text) {
                if (data !== null && data !== undefined) {
                    let cancelled = main.dispatch("dataBinding", {
                        detail: {
                            index: null,
                            data: data
                        }
                    });
                    if (!cancelled) {
                        if (main.clearOnDataBind) {
                            main.clear();
                        }
                        main.dat = data;//main.dataRoute === null ? data : new DataRouter(data, main.dataRoute).get();
                        main.dataBound();
                        main.create(main.creationTarget);
                        main.parse();
                        if (Function.isFunction(onSuccess)) {
                            onSuccess(data, text);
                        }
                    }
                }
            },
            error: Function.isFunction(onError) ? onError : error//
        });
    } else {
        let cancelled = this.dispatch("dataBinding", {
            detail: {
                index: null,
                data: main.getDataSource()
            }
        });
        if (!cancelled) {
            if (this.clearOnDataBind) {
                this.clear();
            }
            this.dat = this.getDataSource();//this.dataRoute === null ? this.getDataSource() : new DataRouter(this.getDataSource(), this.dataRoute).get();
            this.dataBound();
            this.create(this.creationTarget);
            main.parse();
        }
    }
};
get(Node, "options", function () {
    return this.options;
});
set(Node, "options", function (options) {
    this.options = options;
});
Node.prototype.hasValidOptions = function () {
    return this.options !== null && this.options !== undefined;
};
get(Node, "css", function () {
    return this.css;
});
set(Node, "css", function (css) {
    this.css = css instanceof Array && css.length > 0 && String.isString(css[0]) ? css : [];
});
Node.prototype.makeValueUI = function () {
    return "";
};
Node.prototype.dataBound = function () { };
Node.prototype.create = function (parentDomId) {
    this.setParentDomId(parentDomId);
};
Node.prototype.reCreate = function () {
    if (this.getParentDomId() !== null && String.isString(this.getParentDomId()) && this.getParentDomId().length > 0) {
        let parentDom = document.getElementById(this.getParentDomId());
        let mainDom = this.getDOM();
        if (parentDom !== undefined && parentDom !== null && mainDom !== undefined && mainDom !== null) {
            this.getDOM().remove();
            this.create(this.getParentDomId());
        }
    }
};
Node.prototype.delete = function () {
    recycleBin.add(this);
};
Node.prototype.get = function () {
    return document.getElementById(this.constructor.name.concat(this.id));
};
Node.prototype.val = function () {
    return document.getElementById(this.constructor.name.concat(this.id));
};
is(Node, "parent", function () {
    return this instanceof ParentNode;
});
Node.prototype.stillContained = function () {
    return this.getParent() !== null && this.getParent() !== undefined && this.getParent() !== root && this.getParent().contains(this);
};
Node.prototype.persist = function () {
    this.dat = this.data();
};
Node.prototype.parse = function (data) { if (data !== undefined) { this.dat = data; } return this; };
Node.prototype.getDisplay = function () {
    let display = document.querySelector('[data-id="'.concat(this.uid).concat('"]'));
    if (display === null || display === undefined) {
        display = document.createElementNS(this.namespace, this.selectorType);
        display.setAttribute("data-id", this.uid);
        display.setAttribute("data-factory", this.constructor.name);
    }
    this.setupListeners(display);
    return display;
};
Node.prototype.setupListeners = function (display) { };
Node.prototype.focus = function (source) {
    if (this.getParent() !== null && this.getParent().currentFocus !== this.getIndex()) {
        let sib = this.getParent().children[this.getParent().currentFocus];
        if (sib !== undefined && sib !== null) {
            sib.blur();
        }
        this.getParent().currentFocus = this.getIndex();
    }
    if (!this.isFocused()) {
        this.setFocused(true);
        if (this.isFocusable()) {
            //let ctrl = this.getControl();
            //if (ctrl !== null && ctrl !== undefined && ctrl !== source) {
            //ctrl.focus();
            //ctrl.select();
            //}
        }
        this.dispatch("focus", null);
    }
};
Node.prototype.focusNext = function (source) {
};
Node.prototype.blur = function () {
    if (this.isFocused()) {
        this.setFocused(false);
        this.dispatch("blur", null);
        //if (this.getParent() !== null && this.getParent() !== undefined) {
        //    this.getParent().blur();
        //}
    }
};
Node.prototype.cache = function () { };
Node.prototype.finalize = function () { };

function ParentNode(creationTarget = null,
    dataSource = null,
    selectorType = "div",
    children = [],
    childType = null,
    capacity = null,
    data = null,
    css = [],
    namespace = "http://www.w3.org/1999/xhtml",
    dataRoute = null,
    singleton = false,
    asRoot = false,
    dataSourceParams = null) {
    Node.call(this, creationTarget, dataSource, selectorType, data, css, undefined, namespace, dataRoute, singleton, asRoot, dataSourceParams);
    this.childType = childType !== undefined ? childType : null;
    this.capacity = capacity !== undefined ? capacity : null;
    if (children !== null && children !== undefined && children instanceof Array && children.length > 0) {
        children.forEach(child => this.add(child));
    } else {
        this.children = [];
    }
    this.currentFocus = 0;
};
ParentNode.extends(Node);
ParentNode.construct();
ParentNode.prototype.create = function (parentDomId) {
    Node.prototype.create.call(this, parentDomId);
};
ParentNode.prototype.getChildType = function () {
    return this.childType;
};
ParentNode.prototype.setChildType = function (cType) {
    this.childType = cType !== undefined ? cType : null;
};
ParentNode.prototype.add = function (child) {
    if (this.childType !== null && !(this.childType.prototype.isPrototypeOf(child))) {
        console.error("Failed to add child of type \"".concat(typeof child).concat("\" to parent for attemting to violate childType constraint: ").concat(this.childType));
        return child;
    }
    let oldLen = this.children.length;
    if (this.capacity === null || this.capacity === undefined || oldLen < this.capacity) {
        if (!this.children.includes(child)) {
            this.children.push(child);
            child.setParent(this);
            child.setIndex(this.children.length - 1);
            child.setId(this.id.concat('.').concat(this.children.length - 1));
        }
        if (this !== root && this.children.length > oldLen) {
            this.render(oldLen, this.children.length, child);
            this.onContentChanged();
            this.onChildAdded([child]);
        }
    } else {
        console.error("Failed to add child of type \"".concat(typeof child).concat("\" to parent for attemting to violate capacity constraint: Max of ").concat(this.capacity).concat(this.capacity === 1 ? " child" : " children"));
    }
    return child;
};
ParentNode.prototype.size = function () {
    return Array.isArray(this.children) ? this.children.length : 0;
};
ParentNode.prototype.render = function (oldLen, child) { }
ParentNode.prototype.reset = function () {
    if (Array.isArray(this.children)) {
        this.children.forEach(child => child.reset());
    }
};
ParentNode.prototype.contains = function (child) {
    if (child !== null && child !== undefined) {
        return this.children.includes(child);
    }
};
ParentNode.prototype.remove = function (child) {
    if (this.childType !== null && !(child instanceof this.childType)) {
        return child;
    }
    if (this.children.length === 0) {
        this.clear();
    }
    let oldLen = this.children.length;
    if (this.children.includes(child)) {
        this.children.splice(child.index, 1);
        child.setParent(null);
        if (this.children.length === (oldLen - 1)) {
            child.delete();
            if (this.children.length === 0) {
                this.onEmpty();
            }
            this.onChildRemoved([child]);
        }
    }
    return child;
};
ParentNode.prototype.clear = function (skip) {
    this.children = [];
    if (skip !== true) {
        this.onEmpty();
    }
};
ParentNode.prototype.getChild = function (index) {
    return index >= 0 ? this.children[index] : undefined;
};
ParentNode.prototype.persist = function () {
    Node.prototype.persist.call(this);
    if (this.children !== null && this.children !== undefined) {
        this.children.forEach(child => child.persist());
    }
};
ParentNode.prototype.dataBind = function (onSuccess, onError) {
    Node.prototype.dataBind.call(this, onSuccess, onError);
    if (this.children !== null && this.children instanceof Array) {
        if (this.childType !== null && this.childType !== undefined && this.childType instanceof Node) {
            this.children.forEach(child => child.dataBind());
        } else {
            this.children.forEach(child => { if (child instanceof Node) { child.dataBind(); } });
        }
    }
};
ParentNode.prototype.isEmpty = function () {
    let empty = true;
    if (Array.isArray(this.children)) {
        this.children.forEach(child => {
            empty = empty && child.isEmpty();
        });
    }
    return empty;
};
ParentNode.prototype.onEmpty = function () { };
ParentNode.prototype.onContentChanged = function () { };
ParentNode.prototype.onChildAdded = function (children) {
    //let main = this;
    //children.forEach(child => child.create(main.getDOM().id));
};
ParentNode.prototype.onChildRemoved = function (children) {

};
ParentNode.prototype.getDisplay = function () {
    let display = Node.prototype.getDisplay.call(this);
    return display;
};
ParentNode.prototype.setupListeners = function (display) { };
ParentNode.prototype.focus = function (source) {
    Node.prototype.focus.call(this, source);
    if (this.isFocusable()) {
        if (this.children !== null && this.children.length > 0) {
            this.children[0].focus();
        }
    }
};
ParentNode.prototype.focusNext = function (source) {
    if (this.isFocusable()) {
        if (this.children !== null && this.children.length > 0) {
            if (source !== null && source instanceof Node && source.getParent() === this && (this.children.length - 1) > source.getIndex()) {
                return this.children[source.getIndex() + 1].focus(source);
            }
            return;
        }
        return;
    }
    if (this.getParent() !== null) {
        this.getParent().focusNext(this);
    }
};
ParentNode.prototype.finalize = function () {
    this.children.forEach(child => child.finalize());
};

function RecycleBin() {
    ParentNode.call(this, undefined, undefined, "div");
};
RecycleBin.extends(ParentNode);
RecycleBin.construct();
RecycleBin.prototype.create = function (parentDomId) {
    if (document.getElementsByClassName(this.constructor.name).length === 0) {
        let div = document.createElement('div');
        div.classList.add(this.constructor.name);
        document.body.appendChild(div);
    }
};
RecycleBin.prototype.add = function (child) {
    if (this.childType !== null && !(child instanceof this.childType)) {
        return child;
    }
    if (!this.children.contains(child)) {//.includes(child)) {
        if (child.stillContained()) {
            child.parent.remove(child);
        }
        this.children.push(child);
        child.setParent(this);
        child.setIndex(this.children.length - 1);
        child.setId(this.id.concat('.').concat(this.children.length - 1));
        $(this.getDOM()).append($(child[child.uiMethod]()).detach());
    }
    return child;
};
RecycleBin.prototype.getDOM = function () {
    let rbs = document.getElementsByClassName(this.constructor.name);
    let rb = rbs.length > 0 ? rbs[0] : null;
    return rb;
};

function SVGNode(creationTarget = null, dataSource = null, selectorType = "svg", fill = "none", stroke = "", strokeWidth = 1, css = []) {//, id = null) {
    ParentNode.call(this, creationTarget, dataSource, selectorType, [], SVGNode, null, null, css, "http://www.w3.org/2000/svg");
    this.fill = fill;
    this.stroke = stroke;
    this.strokeWidth = strokeWidth;
    //this.id = id;
};
SVGNode.extends(ParentNode);
SVGNode.construct();
SVGNode.prototype.getDisplay = function () {
    if (this.selectorType !== null && this.selectorType !== undefined) {
        let display = ParentNode.prototype.getDisplay.call(this);
        if (this.id !== null) {
            display.id = this.id;
        }
        if (this.fill !== null && this.fill !== undefined) {
            display.setAttribute("fill", this.fill);
        }
        if (this.stroke !== null && this.stroke !== undefined) {
            display.setAttribute("stroke", this.stroke);
        }
        if (this.strokeWidth !== null && this.strokeWidth !== undefined) {
            display.setAttribute("strokeWidth", this.strokeWidth);
        }
        this.getCss().forEach(cls => display.classList.add(cls));
        return display;
    }
    return null;
};
SVGNode.prototype.create = function (parentDomId) {
    ParentNode.prototype.create.call(this, parentDomId);
    if (String.isString(parentDomId)) {
        let dom = document.getElementById(parentDomId);
        dom.appendChild(this.getDisplay());
    }
};

function SVGPath(creationTarget = null, dataSource = null, fill = "none", stroke = "", strokeWidth = 1, d = "", css = []) {
    SVGNode.call(this, creationTarget, dataSource, "path", fill, stroke, strokeWidth, css);
    this.d = d;
};
SVGPath.extends(SVGNode);
SVGPath.construct();
SVGPath.prototype.getDisplay = function () {
    let display = SVGNode.prototype.getDisplay.call(this);
    display.setAttribute("d", this.d);
    return display;
};

function SVGNodeGroup(fill = "none", stroke = "#000", strokeWidth = 1, mask = null) {
    SVGNode.call(this, undefined, undefined, "g", fill, stroke, strokeWidth);
    this.mask = mask;
};
SVGNodeGroup.extends(SVGNode);
SVGNodeGroup.construct();
SVGNodeGroup.prototype.getDisplay = function () {
    let display = SVGNode.prototype.getDisplay.call(this);
    if (this.mask !== null) {
        display.setAttribute("mask", this.mask);
    }
    this.children.forEach(child => display.appendChild(child.getDisplay()));
    return display;
};

function SVGRectangle(fill = "none", stroke = "", strokeWidth = 1, x = 0, y = 0, width = 10, height = 10, css = []) {
    SVGNode.call(this, undefined, undefined, "rect", fill, stroke, strokeWidth, css);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};
SVGRectangle.extends(SVGNode);
SVGRectangle.construct();
SVGRectangle.prototype.getDisplay = function () {
    let display = SVGNode.prototype.getDisplay.call(this);
    display.setAttribute("x", this.x);
    display.setAttribute("y", this.y);
    display.setAttribute("width", this.width);
    display.setAttribute("height", this.height);
    return display;
};

function SVGCircle(fill = "none", stroke = "", strokeWidth = 1, cx = 0, cy = 0, r = 10, css = []) {
    SVGNode.call(this, undefined, undefined, "circle", fill, stroke, strokeWidth, css);
    this.cx = cx;
    this.cy = cy;
    this.r = r;
};
SVGCircle.extends(SVGNode);
SVGCircle.construct();
SVGCircle.prototype.getDisplay = function () {
    let display = SVGNode.prototype.getDisplay.call(this);
    display.setAttribute("cx", this.cx);
    display.setAttribute("cy", this.cy);
    display.setAttribute("r", this.r);
    return display;
};

function SVGImage(src = null, x = "0", y = "0", width = "100%", height = "100%", preserveAspectRatio = "xMidYMid slice", css = []) {
    SVGNode.call(this, undefined, src, "image", "none", "", 0, css);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.preserveAspectRatio = preserveAspectRatio;
};
SVGImage.extends(SVGNode);
SVGImage.construct();
SVGImage.prototype.getDisplay = function () {
    if (this.getDataSource() === null) {
        let img = document.createElement("img");
        return img;
    }
    let display = SVGNode.prototype.getDisplay.call(this);
    display.setAttribute("x", this.x);
    display.setAttribute("y", this.y);
    display.setAttribute("width", this.width);
    display.setAttribute("height", this.height);
    display.setAttribute("preserveAspectRatio", this.preserveAspectRatio);
    display.setAttribute("xlink:href", this.getDataSource());
    return display;
};

function SVG(creationTarget = null, dataSource = null, fill = "none", stroke = "", strokeWidth = 1, viewBox = "0 0 100 100", width = 16, height = 16, clipRule = "evenodd", css = [], role = "none", enableBackground = null) {
    SVGNode.call(this, creationTarget, dataSource, "svg", fill, stroke, strokeWidth, css);
    this.viewBox = viewBox;
    this.width = width;
    this.height = height;
    this.clipRule = clipRule;
    this.role = role;
    this.enableBackground = enableBackground;
};
SVG.extends(SVGNode);
SVG.construct();
SVG.prototype.getDisplay = function () {
    if (this.selectorType !== null && this.selectorType !== undefined) {
        let display = SVGNode.prototype.getDisplay.call(this);
        //display.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        //display.setAttribute("version", "1.1");
        if (this.viewBox !== null && this.viewBox !== undefined) {
            display.setAttribute("viewBox", this.viewBox);
        }
        if (this.width !== null && this.width !== undefined) {
            display.setAttribute("width", this.width);
        }
        if (this.height !== null && this.height !== undefined) {
            display.setAttribute("height", this.height);
        }
        if (this.clipRule !== null && this.clipRule !== undefined) {
            display.setAttribute("clip-rule", this.clipRule);
        }
        if (this.role !== null && this.role !== undefined) {
            display.setAttribute("role", this.role);
        }
        if (this.enableBackground !== null && this.enableBackground !== undefined) {
            display.setAttribute("enable-background", this.enableBackground);
        }

        this.children.forEach(child => display.appendChild(child.getDisplay()));
        return display;
    }
    return null;
};
SVG.prototype.create = function (parentDomId) {
    ParentNode.prototype.create.call(this, parentDomId);
    if (String.isString(parentDomId)) {
        document.getElementById(parentDomId).appendChild(this.getDisplay());
    }
};

function DataCell(creationTarget = null, dataSource = null, data = null, columnIndex = null, dataKey = null, css = [], dataType = "object") {
    ParentNode.call(this, creationTarget, dataSource, "td", [], null, null, data);
    this.columnIndex = columnIndex;
    this.dataKey = dataKey;
    this.dataType = dataType;
    this.setCss(css);
};
DataCell.extends(ParentNode);
DataCell.construct();
DataCell.prototype.create = function (parentDomId) {
    ParentNode.prototype.create.call(this, parentDomId);
};
DataCell.prototype.getDisplay = function () {
    let cell = document.createElement(this.selectorType);
    if (this.css !== null && this.css !== undefined && this.css instanceof Array && this.css.length > 0) {
        this.css.forEach(cls => { if (String.isString(cls) && cls.length > 0) { cell.classList.add(cls); } });
    }

    cell.id = this.constructor.name.concat(this.getId());
    let data = this.dat !== null ? this.dat : this.getParent().dat[this.dataKey];
    let type = typeof data;
    if (this.getParent() !== null) {
        let grandParent = this.getParent().getParent();
        if (grandParent !== null) {
            let router = grandParent.getUIRouter();
            if (grandParent.getColumns() !== null && grandParent.getColumns().length > 0) {
                this.dataType = grandParent.getColumns()[this.columnIndex].dat.dataType;
            }
            if (router !== null && router !== undefined && String.isString(router) && router.length > 0) {
                let element = gridRouter[router][type][this.dataKey][routeCase[type](data)](data, this, this.dataType);
                //element.id = this.getId();
                cell.appendChild(element);
            } else {
                cell.innerHTML = data;
            }
        }
    }
    return cell;
};

function DataRow(creationTarget = null, dataSource = null, data = null, functions = [], index = -1) {
    ParentNode.call(this, creationTarget, dataSource, "tr", [], DataCell, null, data);
    this.setIndex(index);
    this.functions = functions;
};
DataRow.extends(ParentNode);
DataRow.construct();
DataRow.prototype.create = function (parentDomId) {
    ParentNode.prototype.create.call(this, parentDomId);
};
DataRow.prototype.getDisplay = function () {
    let main = this;
    let tRow = document.createElement(this.selectorType);
    tRow.id = this.constructor.name.concat(this.getId());
    if (this.getParent().onRowClicked !== null && this.getParent().onRowClicked !== undefined) {
        $(tRow).data(this.dat);
        tRow.onclick = function (e) {
            let canClick = true;
            this.querySelectorAll(".prevent-parent-click").forEach(element => {
                if (element.matches(':hover')) {
                    canClick = true;
                    return;
                }
            });
            if (canClick) {
                main.getParent().onRowClicked(e, this);
            }
        };
    }
    if (this.getParent().hasValidOptions()) {
        let css = this.getIndex() % 2 === 0 ? this.getParent().getOptions().rowCss : this.getParent().getOptions().alternatingCss;
        css.forEach(cls => { if (cls !== "") { tRow.classList.add(cls); } });
    }
    if (this.dat !== null) {
        if (this.getParent().hasValidOptions() && this.getParent().getOptions().uniqueKey !== null && this.getParent().getOptions().uniqueKey !== undefined) {
            tRow.setAttribute("data-id", this.uid);//, this.dat[this.getParent().getOptions().uniqueKey]);
        }
        let row = this;
        let innerCellCss = null;
        if (this.getParent().hasValidOptions()) {
            innerCellCss = this.getParent().getOptions().innerCellCss;
        }
        this.getParent().getColumns().forEach(function (col, index) {
            if (col.dat.display === undefined || col.dat.display.visibility !== "Invisible") {
                let css = col.dat.display !== undefined ? [col.dat.display.visibility] : ["Visible"];
                if (innerCellCss !== null && innerCellCss !== undefined && Array.isArray(innerCellCss)) {
                    innerCellCss.forEach(cls => css.push(cls));
                }
                let dataCell = row.add(new DataCell(undefined, undefined, null, index, col.dat.propertyName !== undefined ? col.dat.propertyName.decapitalize() : col.dat.decapitalize(), css));
                tRow.appendChild(dataCell.getDisplay());
            }
        });
        if (this.functions !== null && this.functions !== undefined) {
            this.functions.forEach(fn => {
                let td = document.createElement("td");
                ["white", "border-0"].forEach(cls => td.classList.add(cls));
                let btn = document.createElement("a");
                btn.setAttribute("role", "button");
                btn.setAttribute("data-role", fn.name);
                ["btn", "btn-floating", "waves-effect", "waves-dark", "square-24", "btn-outline-del", "white", "border-1", "prevent-parent-click"].forEach(cls => btn.classList.add(cls));
                //btn.innerHTML = fn.name;
                let icon = document.createElement("i");
                icon.classList.add("icon-".concat(fn.name.decapitalize()));
                btn.appendChild(icon);
                btn.addEventListener("click", function (e) {
                    e.stopImmediatePropagation();
                    fn.function(e, row.dat);
                });
                td.appendChild(btn);
                tRow.appendChild(td);
            });
        }
    }
    return tRow;
};
DataRow.prototype.data = function () {
    return this.dat;
}

function DataColumn(creationTarget = null, dataSource = null, order = null, metaData = null, isIdentity = false, visibility = "Visible") {
    ParentNode.call(this, creationTarget, dataSource, "div", [], DataCell, null, null);
    this.order = order;
    this.dat = metaData;
    this.isIdentity = isIdentity;
    //this.propertyName = propertyName;
    //this.title = title !== null ? title : propertyName.toWords();
    //this.dataType = dataType;
    this.visibility = visibility;
};
DataColumn.extends(ParentNode);
DataColumn.construct();
Object.defineProperty(DataColumn, 'CompareProperty', {
    value: "order", configurable: true//false for final
});
Object.defineProperty(DataColumn, 'SetCompareProperty', {
    value: function (prop) {
        Object.defineProperty(DataColumn, 'CompareProperty', {
            value: prop, configurable: true
        });
    }
});
Object.defineProperty(DataColumn, 'GetCompareProperty', {
    value: function () { return DataColumn.CompareProperty; }
});
Object.defineProperty(DataColumn, 'ASC', {
    value: function (a, b) {
        if (a[DataColumn.CompareProperty] > b[DataColumn.CompareProperty]) return 1;
        if (a[DataColumn.CompareProperty] < b[DataColumn.CompareProperty]) return -1;
        return 0;
    }, configurable: true
});
Object.defineProperty(DataColumn, 'DESC', {
    value: function (a, b) {
        if (a[DataColumn.CompareProperty] < b[DataColumn.CompareProperty]) return 1;
        if (a[DataColumn.CompareProperty] > b[DataColumn.CompareProperty]) return -1;
        return 0;
    }, configurable: true
});
DataColumn.prototype.create = function (parentDomId) {

};
DataColumn.prototype.getDisplay = function () {
    let colTxtWrap = document.createElement("span");
    ["data-col-title", "inline-block", "ellipsis"].forEach(cls => colTxtWrap.classList.add(cls));
    colTxtWrap.innerHTML = this.dat.display !== undefined ? this.dat.display.text.toWords() : this.dat;
    return colTxtWrap;
};

function GridFactory() { };
GridFactory.construct();
GridFactory.prototype.generateColumns = function (grid) {
    if (grid !== null && grid.hasValidData()) {
        let columns = new Array();
        if (grid.dat.metaData !== null && grid.dat.metaData !== undefined && Object.keys(grid.dat.metaData.settings).length > 0) {
            Object.keys(grid.dat.metaData.settings).forEach(key => {
                columns.push(new DataColumn(
                    undefined,
                    undefined,
                    columns.length,
                    grid.dat.metaData.settings[key],
                    key === grid.dat.metaData.key || key.toLowerCase() === grid.dat.metaData.key.toLowerCase()
                ));
            });
        } else if (grid.dat.data !== undefined && Array.isArray(grid.dat.data)) {
            Object.keys(grid.dat.data[0]).forEach(key => {
                columns.push(new DataColumn(
                    undefined,
                    undefined,
                    columns.length,
                    {
                        propertyName: key,
                        display: { text: key, visibility: "Visible" },
                        dataType: grid.dat.data[0][key] !== null ? Object.getPrototypeOf(grid.dat.data[0][key]) : null,
                        key: null
                    },
                    grid.dat.metaData !== null && grid.dat.metaData !== undefined && (key === grid.dat.metaData.key || key.toLowerCase() === grid.dat.metaData.key.toLowerCase()),
                    undefined
                ));
            });
        } else {
            Object.keys(grid.dat[0]).forEach(key => {
                columns.push(new DataColumn(
                    undefined,
                    undefined,
                    columns.length,
                    {
                        propertyName: key,
                        display: { text: key, visibility: "Visible" },
                        dataType: grid.dat[0][key] !== null ? Object.getPrototypeOf(grid.dat[0][key]) : null,
                        key: null
                    },
                    undefined,
                    undefined
                ));
            });
        }
        grid.setColumns(columns);
    } else {
        grid.setColumns([]);
    }
};

function DataGrid(
    creationTarget = null,
    dataSource = null,
    dataSourceParams = null,
    options = {
        gridCss: ["table", "table-striped", "border-separate", "round-corner-4"],
        headerCss: ["white"],
        columnCss: ["btn-outline-info"],
        rowCss: ["white"],
        alternatingCss: ["table-info"],
        hideColumns: false,
        align: "center",
        cellspacing: 0,
        rowFunctions: []
    },
    router = null,
    gridFactory = new GridFactory(),
    dataColumns = null,
    recordsPerPage = null,
    pagination = null,
    onRowClicked = null) {
    ParentNode.call(this, creationTarget, dataSource, "table", [], DataRow, null, [], undefined, undefined, undefined, undefined, undefined, dataSourceParams);
    this.uiRouter = router;
    this.gridFactory = gridFactory;
    this.recordsPerPage = recordsPerPage;
    this.setOptions(options);
    this.columns = null;
    this.setColumns(dataColumns);
    this.onRowClicked = onRowClicked;
    this.setClearOnDataBind(true);
};
DataGrid.extends(ParentNode);
DataGrid.construct();
get(DataGrid, "columns", function () { return this.columns; });
set(Node, "columns", function (dataColumns) {
    if (dataColumns instanceof Array) {
        this.columns = dataColumns;
        if (this.columns !== null && this.columns !== undefined && this.columns.length > 0 && this.columns[0] instanceof DataColumn) {
            this.autoGenerate = false;
        }
        this.columns.sort(DataColumn.ASC);
    }
});
DataGrid.prototype.getUIRouter = function () {
    return this.uiRouter;
};
DataGrid.prototype.setUIRouter = function (router) {
    this.uiRouter = router;
};
DataGrid.prototype.dataBound = function () {
    if (this.getColumns() === null || this.getColumns() === undefined || this.getColumns().length === 0) {
        this.gridFactory.generateColumns(this);
    }
    this.dispatch("dataBound", {
        detail: {
            index: null,
            data: this.dat
        }
    });
};
DataGrid.prototype.clear = function () {
    ParentNode.prototype.clear.call(this);
    let display = this.getDisplay();
    display.innerHTML = "";
};
DataGrid.prototype.getDisplay = function () {
    let display = ParentNode.prototype.getDisplay.call(this);
    this.setSelectorIndex(document.getElementsByClassName(this.constructor.name).length);
    let mainId = this.constructor.name.concat(this.selectorIndex);
    display.id = mainId;
    if (display.childElementCount === 0 && this.hasValidData()) {
        if (this.hasValidOptions()) {
            if (this.getOptions().align !== undefined) {
                display.setAttribute("align", this.getOptions().align);
            }
            if (this.getOptions().cellspacing !== undefined) {
                display.setAttribute("cellspacing", this.getOptions().cellspacing);
            }
            let css = this.getOptions().gridCss;
            if (css !== null && css !== undefined && Array.isArray(css)) {
                css.push(this.constructor.name);
                css.forEach(cls => display.classList.add(cls));
            }
        }
        if (this.getOptions() !== null && !this.getOptions().hideColumns) {
            /** head creation */
            let tHead = document.createElement("thead");
            let headRow = document.createElement("tr");
            if (this.getOptions() !== null && this.getOptions().headerCss !== null && this.getOptions().headerCss instanceof Array && this.getOptions().headerCss.length > 0) {
                this.getOptions().headerCss.forEach(cls => { if (cls !== "") { headRow.classList.add(cls); } });
            }
            let colCss = [];
            if (this.getOptions() !== null && this.getOptions().columnCss !== null && this.getOptions().columnCss instanceof Array && this.getOptions().columnCss.length > 0) {
                colCss = this.getOptions().columnCss;
            }
            if (this.getColumns() !== null && this.getColumns() !== undefined) {
                this.getColumns().forEach(function (col, index) {
                    if (col.dat.display === undefined || col.dat.display.visibility !== "Invisible") {
                        let th = document.createElement("th");
                        colCss.forEach(cls => { if (cls !== "") { th.classList.add(cls); } });
                        th.classList.add(col.dat.display !== undefined ? col.dat.display.visibility : "Visible");
                        th.setAttribute("data-id", col.getId());
                        th.setAttribute("scope", "col");
                        if (index === 0) {
                            if (this.options !== null && this.options !== undefined && this.options.cornerCss !== null && this.options.cornerCss !== undefined && this.options.cornerCss instanceof Array && this.options.cornerCss.length > 0) {
                                this.options.cornerCss.forEach(cls => th.classList.add(cls));
                            }
                        }
                        th.appendChild(col.getDisplay());
                        headRow.appendChild(th);
                    }
                });
            }
            if (this.getOptions() !== null && this.getOptions().rowFunctions !== null && this.getOptions().rowFunctions !== undefined) {
                this.getOptions().rowFunctions.forEach(fn => {
                    let th = document.createElement("th");
                    ["white", "border-0"].forEach(cls => th.classList.add(cls));
                    headRow.appendChild(th);
                });
            }

            tHead.appendChild(headRow);
            display.appendChild(tHead);
            /** end of head creation */
        }
        /** body creation */
        let tBody = document.createElement("tbody");
        if (this.hasValidData()) {
            let d = this.getData();
            d.forEach(record => {
                let dataRow = this.add(new DataRow(undefined, undefined, record, this.getOptions().rowFunctions));
                tBody.appendChild(dataRow.getDisplay());
            });
        }

        display.appendChild(tBody);
        /** end of body creation */
    } else {
        display.innerHTML = "";
        let emptyRow = document.createElement("tr");
        emptyRow.style.backgroundColor = "lightgrey";
        let emptyCell = document.createElement("td");
        emptyCell.appendChild(document.createTextNode("No data to display"));
        emptyRow.appendChild(emptyCell);
        let bdy = document.createElement("tbody");
        bdy.appendChild(emptyRow);
        display.appendChild(bdy);
    }
    return display;
};
DataGrid.prototype.create = function (parentDomId) {
    ParentNode.prototype.create.call(this, parentDomId);
    if (parentDomId === null || parentDomId === undefined) {
        return;
    }
    let domParent = document.getElementById(parentDomId);
    if (domParent === undefined || domParent === null) {
        return;
    }
    if (domParent !== undefined && domParent !== null) {
        domParent.appendChild(this.getDisplay());
    }
};
DataGrid.prototype.addColumn = function (dataColumn) {
    if (dataColumn !== null && dataColumn !== undefined && dataColumn instanceof DataColumn) {
        if (this.getColumns() === null || this.getColumns() === undefined) {
            this.setColumns([]);
        }
        this.getColumns().push(dataColumn);
    }
};
DataGrid.prototype.hasValidData = function () {
    return Node.prototype.hasValidData.call(this) && this.dat !== null && this.dat !== undefined && (this.dat.data instanceof Array && this.dat.data.length > 0 || this.dat instanceof Array && this.dat.length > 0);
};
DataGrid.prototype.getData = function () {
    return Array.isArray(this.dat.data) ? this.dat.data : this.dat;
};

function SelectOption(creationTarget, dataSource, value, display, css = []) {
    Node.call(this, creationTarget, dataSource, "option", null, css);
    this.selected = false;
    this.disabled = false;
};
SelectOption.extends(Node);
SelectOption.construct();
is(SelectOption, "selected", function () { return this.selected; });
set(SelectOption, "selected", function (selected) {
    this.selected = selected;
});
is(SelectOption, "disabled", function () { return this.disabled; });
set(SelectOption, "disabled", function (disabled) {
    this.disabled = disabled;
});
SelectOption.prototype.getDisplay = function () {
    let option = Node.prototype.getDisplay.call(this);
    option.value = this.dat[this.getParent().getValueMember()];
    option.innerHTML = this.dat[this.getParent().getDisplayMember()];
    option.selected = this.isSelected();
    option.disabled = this.isDisabled();
    return option;
};

function RichSelect(creationTarget = null,
    dataSource = null,
    valueMember = "id",
    displayMember = "name",
    placeHolder = "Select an option",
    value = 0,
    dataRoute = null,
    searchable = true,
    defaultNone = true,
    options = null, width = "200px") {
    ParentNode.call(this, creationTarget, dataSource, "select", [], SelectOption, null, null, [], undefined, dataRoute);
    this.valueMember = null;
    this.displayMember = null;
    this.setValueMember(valueMember);
    this.setDisplayMember(displayMember);
    this.placeHolder = placeHolder;
    this.value = value;
    this.searchable = searchable;
    this.wrapper = null;
    this.width = width;
    this.defaultNone = defaultNone;
    if (this.defaultNone === true) {
        let none = {};
        none[this.valueMember] = 0;
        none[this.displayMember] = String.isString(this.placeHolder) ? this.placeHolder : "None";
        this.default = none;
    }
    this.setClearOnDataBind(true);
    this.setFocusable(true);
};
RichSelect.extends(ParentNode);
RichSelect.construct();
get(RichSelect, "valueMember", function () { return this.valueMember; });
set(RichSelect, "valueMember", function (valueMember) {
    this.valueMember = valueMember;
});
get(RichSelect, "displayMember", function () { return this.displayMember; });
set(RichSelect, "displayMember", function (displayMember) {
    this.displayMember = displayMember;
});
is(RichSelect, "searchable", function () { return this.searchable; });
set(RichSelect, "searchable", function (searchable) {
    this.searchable = searchable;
});
RichSelect.prototype.dataBound = function () {
    if (Array.isArray(this.dat)) {
        if (this.defaultNone === true) {
            let defOpt = new SelectOption(null, this.default);
            defOpt.dat = this.default;
            this.add(defOpt);
        }
        this.dat.forEach(d => {
            let option = new SelectOption(null, d);
            option.dataBind();
            this.add(option);
        });
    }
    if (this.getParent() !== null && this.getParent().dat !== null) {
        this.setValue(new DataRouter(this.getParent().dat, this.dataRoute).get());
    }
};
RichSelect.prototype.setupListeners = function (ctrl) {
    if (ctrl !== null && ctrl !== undefined) {
        let main = this;
        ctrl.addEventListener("change", function () {
            main.value = main.wrapper !== null ? main.wrapper.selected.getAttribute("data-value") : this.value;
            if (main.getParent() !== null && main.getParent().dat !== null) {
                new DataRouter(main.getParent().dat, main.dataRoute).set(main.value);
            }
        });
        ctrl.addEventListener("DOMNodeInsertedIntoDocument", function (e) {
            e.stopPropagation();
            if (document.querySelector('[data-rel="' + main.uid + '"]') === null) {
                //main.applyWrapper();
            }
        }, false);
    }
};
RichSelect.prototype.getDisplay = function () {
    let display = ParentNode.prototype.getDisplay.call(this);
    display.innerHTML = "";
    if (this.dataRoute !== null) {
        display.setAttribute("data-route", this.dataRoute);
    }
    let main = this;
    this.children.forEach(child => {
        let opt = child.getDisplay();
        opt.addEventListener("DOMNodeInsertedIntoDocument", function (e) {
            if (e.currentTarget.index === (main.children.length - 1)) {
                //main.applyWrapper();
            }
        });
        display.appendChild(opt);
    });
    display.addEventListener('focus', function () {
        main.focus();
    });
    display.addEventListener('blur', function () {
        main.blur();
    });
    display.addEventListener("change", function () {
        main.blur(false);
    });
    return display;
};
RichSelect.prototype.create = function (parentDomId) {
    let display = this.getDisplay();
    display.selectedIndex = this.value;
    if (String.isString(parentDomId)) {
        let target = document.getElementById(parentDomId);
        if (target !== null && target !== undefined) {
            target.appendChild(display);
        }
    }
};
RichSelect.prototype.parse = function (data) {
    this.getDisplay().innerHTML = "";
    this.clear();
    if (Array.isArray(this.dat)) {
        if (this.defaultNone === true) {
            let defOpt = new SelectOption(null, this.default);
            defOpt.dat = this.default;
            this.add(defOpt);
        }
        this.dat.forEach(d => {
            let option = new SelectOption(null, d);
            option.dataBind();
            this.add(option);
        });
    }
    if (data !== undefined && data !== null) {
        this.setValue(new DataRouter(data, this.dataRoute).get());
    }
    this.create(this.creationTarget);
};
RichSelect.prototype.isEmpty = function () {
    return this.getValue() == this.defaultValue();
};
RichSelect.prototype.defaultValue = function () {
    return this.default[this.valueMember];
};
RichSelect.prototype.reset = function () {
    this.setValue(this.defaultValue());
};
RichSelect.prototype.setValue = function (value) {
    if (value > -1) {
        if (this.wrapper !== null) {
            let item = this.wrapper.list.querySelector("[data-value='".concat(value).concat("']"));
            if (item !== null) {
                item.dispatchEvent(new Event("click"));
            }
        } else {
            let ctrl = this.getControl();
            if (ctrl !== null && ctrl !== undefined) {
                ctrl.value = value;
                ctrl.dispatchEvent(new Event("change"));
            }
        }
    }
};
RichSelect.prototype.getValue = function () {
    let ctrl = this.getControl();
    if (ctrl !== null) {
        return ctrl.value;
    }
    return null;
};
RichSelect.prototype.applyWrapper = function () {
    if (this.children.length > 0 && document.querySelector('[data-rel="' + this.uid + '"]') === null) {
        this.wrapper = new Select(this.getControl(), {
            filtered: 'auto',
            filter_threshold: 8,
            filter_placeholder: this.placeHolder
        }, this.uid);
        this.wrapper.select.style.width = this.width;
        let main = this;
        this.wrapper.select.addEventListener('focus', function () {
            main.focus(false);
        });
        this.wrapper.list.addEventListener('focus', function () {
            //console.log("wrapper.list.focus");
            main.focus(false);
        });
        this.wrapper.list.addEventListener('blur', function () {
            //console.log("wrapper.list.blur");
            main.blur(false);
        });
        this.wrapper.select.addEventListener('blur', function () {
            //console.log("wrapper.select.blur");
            main.blur(false);
        });
    }
};
RichSelect.prototype.focus = function (cascade = true) {
    if (cascade && this.wrapper !== null) {
        this.wrapper.select.focus();
    }
};
RichSelect.prototype.blur = function (cascade = true) {
    if (cascade && this.wrapper !== null) {
        this.wrapper.select.blur();
    }
    if (this.getParent() !== null) {
        this.getParent().blur();
    }
};
RichSelect.prototype.finalize = function () {
    let wrapper = document.querySelector('[data-rel="' + this.uid + '"]');
    if (wrapper === null || wrapper === undefined) {
        this.applyWrapper();
    }
};

function Input(creationTarget = null, dataSource = null, type = "text", css = ["form-control-sm"], name = null, dataRole = null, required = false, maxLength = null, dataRoute = null, label = null) {
    Node.call(this, creationTarget, dataSource, "input", null, css, undefined, undefined, dataRoute);
    this.type = type;
    this.name = name;
    this.dataRole = dataRole;
    this.required = required;
    this.maxLength = maxLength;
    this.default = "";
    this.label = label;
    this.setFocusable(true);
};
Input.extends(Node);
Input.construct();
get(Input, "name", function () {
    return this.name;
});
set(Input, "name", function (name) {
    this.name = name;
});
get(Input, "type", function () {
    return this.type;
});
set(Input, "type", function (type) {
    this.type = type;
});
get(Input, "dataRole", function () {
    return this.dataRole;
});
set(Input, "dataRole", function (dataRole) {
    this.dataRole = dataRole;
});
is(Input, "required", function () {
    return this.required;
});
set(Input, "required", function (required) {
    this.required = required;
});
Input.prototype.setupListeners = function (ctrl) {
    if (ctrl !== null && ctrl !== undefined) {
        let main = this;
        ctrl.addEventListener("focus", function (e) {
            main.focus(this);
            main.value = this.value;
            if (main.getParent() !== null) {
                main.getParent().focus();
            }
        });
        ctrl.addEventListener("blur", function (e) {
            main.value = this.value;
            main.blur();
            if (main.dat !== null) {
                new DataRouter(main.dat, main.dataRoute).set(this.value);
            }
            $(this).trigger("change");
        });
        ctrl.addEventListener("keyup", function (e) {
            if (e.keyCode === 13) {
                //e.preventDefault();
                if (main.getParent() !== null) {
                    main.getParent().focusNext(main);
                }
            }
        });
        ctrl.addEventListener("DOMNodeInsertedIntoDocument", function (e) {
            e.stopPropagation();
            main.finalize();
        }, false);
    }
};
Input.prototype.defaultValue = function () {
    return this.default;
};
Input.prototype.reset = function () {
    this.setValue(this.defaultValue());
};
Input.prototype.setValue = function (value) {
    let ctrl = this.getControl();
    if (ctrl !== null) {
        ctrl.value = value;
        $(ctrl).trigger("change");
    }
};
Input.prototype.getValue = function () {
    let ctrl = this.getControl();
    if (ctrl !== null) {
        return this.getControl().value;
    }
    return null;
};
Input.prototype.getDisplay = function () {
    let display = Node.prototype.getDisplay.call(this);
    display.id = "txt".concat(String.isString(this.dataRoute) && this.dataRoute.length > 0 ? this.dataRoute.concat(this.uid) : this.uid);
    if (String.isString(this.getName())) {
        display.setAttribute("name", this.getName());
    }
    if (String.isString(this.getDataRole())) {
        display.setAttribute("data-role", this.getDataRole());
    }
    if (String.isString(this.getType())) {
        display.setAttribute("type", this.getType());
    }
    if (this.maxLength !== null) {
        display.setAttribute("maxlength", this.maxLength);
    }
    if (this.maxLength !== null) {
        display.setAttribute("maxlength", this.maxLength);
    }
    if (this.dataRoute !== null) {
        display.setAttribute("data-route", this.dataRoute);
    }
    display.required = this.required;
    this.css.forEach(cls => display.classList.add(cls));
    if (this.dat !== null) {
        display.value = new DataRouter(this.dat, this.dataRoute).get();
        display.dispatchEvent(new Event("change"));
    }
    let main = this;
    display.addEventListener("change", function () {
        if (main.getParent() !== null && main.getParent().getParent() !== null && main.getParent().getIndex() === main.getParent().getParent().size() - 1) {
            if (String.isString(this.value) && this.value.length > 0) {
                main.getParent().getParent().addEmptySlot();
            }
        }
    });

    let mini = document.createElement("div");
    mini.classList.add("md-form");
    //mini.appendChild(display);

    return display;
};
Input.prototype.parse = function (data) {
    Node.prototype.parse.call(this, data);
    if (this.dat !== null) {
        if (String.isString(this.dataRoute)) {
            let display = this.getDisplay();
            this.setValue(new DataRouter(this.dat, this.dataRoute).get());
            //display.dispatchEvent(new Event("change"));
        }
    }
};
Input.prototype.getValueDOM = function () {
    return document.querySelector('[data-id="'.concat(this.uid).concat('"]'));
};
Input.prototype.create = function (parentDomId) {
    if (String.isString(parentDomId)) {
        let target = document.getElementById(parentDomId);
        if (target !== null && target !== undefined) {
            target.appendChild(this.getDisplay());
        }
    }
};

function FormRow(creationTarget = null, dataSource = null, dataRoute = null, selectorType = "div", children = [], capacity = null, data = null, css = ["form-row"], model = null) {
    ParentNode.call(this, creationTarget, dataSource, selectorType, children, Node, capacity, data, css, undefined, dataRoute);
    this.setClearOnDataBind(false);
    this.setId("frm-row-".concat(this.uid));
    this.setFocusable(true);
    this.emptySlot = false;
    this.setModel(model);
};
FormRow.extends(ParentNode);
FormRow.construct();
FormRow.prototype.setupListeners = function (ctrl) {
    if (ctrl !== null && ctrl !== undefined) {
        let main = this;
        ctrl.addEventListener("change", function () { main.value = this.value; });
        ctrl.addEventListener("DOMNodeInsertedIntoDocument", function (e) {
            e.stopPropagation();
            let firstChild = main.getChild(0);
            if (firstChild !== undefined) {
                //firstChild.focus();
            }
            main.finalize();
        }, false);
    }
};
FormRow.prototype.delete = function () {
    let ctrl = this.getControl();
    if (ctrl !== null && ctrl !== undefined) {
        ctrl.remove();
    }
    let parent = this.getParent();
    if (parent !== null) {
        parent.remove(this);
    }
};
FormRow.prototype.onChildAdded = function (children) {
    if (Array.isArray(children)) {
        children.forEach(child => {
            if (child.getDataSource() === null) {
                child.setDataSource(this.getDataSource());
            }
            child.dataBind();
            let display = ParentNode.prototype.getDisplay.call(this);
            let col = document.createElement("div");
            col.classList.add("col");
            col.appendChild(child.getDisplay());
            display.appendChild(col);
        });
    }
};
FormRow.prototype.getDisplay = function () {
    let main = this;
    let display = ParentNode.prototype.getDisplay.call(this);
    display.id = this.getId();
    this.css.forEach(cls => display.classList.add(cls));
    //if (!this.emptySlot) {
    let btnRemove = document.createElement("div");
    ["col", "w-40"].forEach(cls => btnRemove.classList.add(cls));
    let btn = document.createElement("a");
    ["btn", "btn-floating", "waves-effect", "waves-dark", "square-24", "btn-outline-del", "border-1"].forEach(cls => btn.classList.add(cls));
    btn.setAttribute("role", "button");
    btn.setAttribute("data-role", "remove-row");
    btn.addEventListener("click", function () {
        if (main.getParent() !== null) {
            if (main.getIndex() < main.getParent().size() - 1) {
                $(main).animate({ height: "0px", opacity: 0 }, "slow", function () {
                    main.getParent().remove(main)
                });
            }
        }
    });
    let icon = document.createElement("i");
    icon.classList.add("icon-remove");
    btn.appendChild(icon);
    btnRemove.appendChild(btn);

    display.appendChild(btnRemove);
    //}
    this.children.forEach(child => {
        let col = document.createElement("div");
        //col.classList.add("col");
        ["col", "h-64"].forEach(cls => col.classList.add(cls));
        col.appendChild(child.getDisplay());
        display.appendChild(col);
        if (String.isString(child.label)) {
            let label = document.createElement("label");
            label.setAttribute("for", child.id);
            label.innerHTML = child.label;
            col.appendChild(label);
        }
    });
    return display;
};
FormRow.prototype.dataBound = function () {
    if (this.children.length === 0) {
        let main = this;
        Object.keys(this.dat).forEach(key => {
            let input = new Input(undefined, main.dat, undefined, undefined, undefined, "input-".concat(key), true, 50, key);
            main.add(input);
        });
    } else {
        this.children.forEach(child => child.dataBind());
    }
};
FormRow.prototype.parse = function (data) {
    ParentNode.prototype.parse.call(this, data);
    if (this.dat !== null) {
        this.dataBound();
        let main = this;
        this.children.forEach(child => child.parse(main.dat));
    }
};
FormRow.prototype.create = function (parentDomId) {
    if (String.isString(parentDomId)) {
        let target = document.getElementById(parentDomId);
        if (target !== null && target !== undefined) {
            let display = this.getDisplay();
            target.appendChild(display);
        }
    }
};
FormRow.prototype.dataSourceChanged = function (oldSrc) {
    if (this.children !== null && this.children !== undefined) {
        let main = this;
        this.children.forEach(child => { if (child.getDataSource() === null) { child.setDataSource(main.getDataSource()); } });
    }
};
FormRow.prototype.isBasicallyValid = function () {
    if (Array.isArray(this.children)) {
        this.children.forEach(child => {
            let ctrl = child.getControl();
            if (ctrl.value !== "") {
                return true;
            }
        });
    }
    return false;
};
FormRow.prototype.blur = function () {
    if (this.isEmpty() && this.getParent() !== null) {
        if (this.getIndex() < this.getParent().size() - 1) {
            this.getParent().remove(this);
            //console.log(this.getParent().size());
        } else {
            let ctrl = this.getControl();
            if (ctrl !== null && ctrl !== undefined) {
                ctrl.classList.add("empty");
            }
            if (this.getModel() !== null) {
                this.dat[this.getModel().getUniqueKey()] = 0;
            }
        }
    } else {
        if (this.getParent() !== null && this.getIndex() < this.getParent().size() - 1) {
            let uKey = this.getModel().getUniqueKey();
            if (this.dat[uKey] === 0) {
                this.dat[uKey] = this.getParent().passiveId--;
                if (this.getParent().dat.where(uKey, this.dat[uKey]).length === 0) {
                    this.getParent().dat.push(this.dat);
                }
            }
            //console.log(this.getParent().size());
        }
        let ctrl = this.getControl();
        if (ctrl !== null && ctrl !== undefined) {
            ctrl.classList.remove("empty");

        }
    }
};

function ScalableForm(creationTarget = null, dataSource = null, dataRoute = null, selectorType = "div", children = [], childType = FormRow, capacity = null, data = null, css = ["form-row"], model = null) {
    ParentNode.call(this, creationTarget, dataSource, selectorType, children, childType, capacity, data, css, undefined, dataRoute);
    this.setId("scalable-form-".concat(this.uid));
    this.setModel(model);
    this.passiveId = -1;
};
ScalableForm.extends(ParentNode);
ScalableForm.construct();
ScalableForm.prototype.onChildAdded = function (children) {
    if (Array.isArray(children)) {
        //children.forEach(child => {
        //    child.setDataSource(this.dat);
        //    child.dataBind();
        //    let display = ParentNode.prototype.getDisplay.call(this);
        //    display.appendChild(child.getDisplay());
        //});
    }
};
ScalableForm.prototype.onChildRemoved = function (children) {
    if (Array.isArray(this.dat) && Array.isArray(children) && this.getModel() !== null) {
        let key = this.getModel().getUniqueKey();
        children.forEach(child => {
            this.dat.removeWhere(key, child.dat[key]);
        });
    }
};
ScalableForm.prototype.dataSourceChanged = function (oldSrc) {
    if (this.children !== null && this.children !== undefined) {
        let main = this;
        this.children.forEach(child => { if (child.getDataSource() === null) { child.setDataSource(main.getDataSource()); } });
    }
};
ScalableForm.prototype.dataBound = function () {
    let ctrl = this.getControl();
    if (ctrl !== undefined && ctrl !== null) {
        ctrl.innerHTML = "";
    }
    if (this.dat !== null && Array.isArray(this.dat)) {
        this.dat.forEach(d => {
            let formRow = new FormRow(null, d);
            formRow.dataBind();
            this.add(formRow);
        });
    }
};
ScalableForm.prototype.getDisplay = function () {
    let display = ParentNode.prototype.getDisplay.call(this);
    display.id = this.getId();
    //if (this.getModel() !== null) {
    //    let header = document.createElement("div");
    //    ["form-row", "md-form"].forEach(cls => header.classList.add(cls));
    //    this.getModel().getHeaderKeys().forEach(key => {
    //        let label = document.createElement("label");
    //        label.innerHTML = key;
    //        let col = document.createElement("div");
    //        col.classList.add("col");
    //        col.appendChild(label);
    //        header.appendChild(col);
    //    });
    //    display.appendChild(header);
    //}
    this.css.forEach(cls => display.classList.add(cls));
    this.children.forEach(child => {
        display.appendChild(child.getDisplay());
    });
    return display;
};
ScalableForm.prototype.parse = function (data) {
    ParentNode.prototype.parse.call(this, data);
};
ScalableForm.prototype.create = function (parentDomId) {
    if (String.isString(parentDomId)) {
        let target = document.getElementById(parentDomId);
        if (target !== null && target !== undefined) {
            target.appendChild(this.getDisplay());
        }
    }
};
ScalableForm.prototype.remove = function (formRow) {
    if (Array.isArray(this.children) && formRow !== null && this.children.includes(formRow)) {
        let oldLen = this.children.length;
        let ctrl = formRow.getControl();
        ctrl.remove();
        this.children.splice(this.children.indexOf(formRow), 1);
        if (this.children.length === oldLen - 1) {
            this.onChildRemoved([formRow]);
        }
    }
};

function EducationInput(creationTarget = null, dataSource = null, children = [], capacity = null, data = null) {
    FormRow.call(this, creationTarget, dataSource, null, "div", children, capacity, data, ["form-row", "md-form", "mb-0", "mt-0"], TutorEducation);
    let input1 = new Input(null, null, undefined, undefined, undefined, "input-institute", false, 50, "institute", "Institute");
    let input2 = new Input(null, null, undefined, undefined, undefined, "input-major", false, 50, "major", "Major");
    let ms1 = new RichSelect(null, tutorDegrees, "lookupDetailsId", "lookupDetailsDescription", "Select a degree", 0, "degreeId");
    this.add(input1);
    this.add(input2);
    this.add(ms1);
    this.setUiMethod("getDisplay");
};
EducationInput.extends(FormRow);
EducationInput.construct();
EducationInput.prototype.getDisplay = function () {
    let display = FormRow.prototype.getDisplay.call(this);
    this.setIndex(this.getParent() !== null ? this.getParent().children.length : 0);
    display.id = "eduInput".concat(this.getIndex());
    this.css.forEach(cls => display.classList.add(cls));
    return display;
};
EducationInput.prototype.data = function () {
    return this.dat;
};

function EducationForm(creationTarget = null, dataSource = null, dataRoute = null, selectorType = "div", children = [], capacity = null, data = null, css = ["form-row"]) {
    ScalableForm.call(this, creationTarget, dataSource, dataRoute, selectorType, children, EducationInput, capacity, data, css, TutorEducation);
};
EducationForm.extends(ScalableForm);
EducationForm.construct();
EducationForm.prototype.onChildAdded = function (children) {
    if (Array.isArray(children)) {
        //children.forEach(child => {
        //    child.setDataSource(this.dat);
        //    child.dataBind();
        //    let display = ScalableForm.prototype.getDisplay.call(this);
        //    display.appendChild(child.getDisplay());
        //});
    }
};
EducationForm.prototype.dataBound = function () {
    if (Array.isArray(this.dat)) {
        let main = this;
        this.dat.push({
            degree: "None",
            degreeId: "0",
            id: this.passiveId--,
            institute: "",
            major: "",
            tutorId: accountManager.currentUser.id
        });
        this.dat.forEach(function (item, index) {
            let input = new EducationInput(null, item);
            if (index === main.dat.length - 1) {
                //input.emptySlot = true;
            }
            main.add(input);
        });
    }
};
EducationForm.prototype.addEmptySlot = function () {
    let emptySlot = new EducationInput(this.getId(), {
        degree: "None",
        degreeId: "0",
        id: 0,
        institute: "",
        major: "",
        tutorId: accountManager.currentUser.id
    });
    emptySlot.emptySlot = true;
    this.add(emptySlot);
    emptySlot.dataBind();
};
EducationForm.prototype.finalize = function () {
    if (Array.isArray(this.children)) {
        this.children.forEach(child => {
            child.dataBind();
        });
    }
};
EducationForm.prototype.data = function () {
    return this.dat.except("id", 0);
};
EducationForm.prototype.save = function (onSuccess, onError) {
    if (Array.isArray(this.children)) {
        let main = this;
        let data = this.data();

        $.ajax({
            type: "POST",
            url: window.location.origin.concat("/tutor/SaveEducation"),
            data: { json: JSON.stringify(data), id: accountManager.currentUser.id, language },
            success: onSuccess,// sign function (data, text)
            error: onError// sign function (request, status, error)
        });
    }
};

function ProgressBar(data) {
    Node.call(this, undefined, undefined, "a", data);
    if (data !== null && data !== undefined && Object.getPrototypeOf(data) !== Number.prototype) {
        data = 0;
    }
    this.cartridge = null;
    this.label = null;
};
ProgressBar.extends(ParentNode);
ProgressBar.construct();
ProgressBar.prototype.create = function (parentDomId) {
    Node.prototype.create.call(this, parentDomId);
    if (parentDomId === null || parentDomId === undefined) {
        return;
    }
    let domParent = document.getElementById(parentDomId);
    if (domParent === undefined || domParent === null) {
        return;
    }
    let oldCreations = domParent.getElementsByClassName(this.constructor.name);
    if (oldCreations !== undefined && oldCreations.length > 0) {
        oldCreations.forEach(creation => domParent.removeChild(creation));
    }
    this.setSelectorIndex(document.getElementsByClassName(this.constructor.name).length);
    let mainId = this.constructor.name.concat(this.selectorIndex);
    let bar = document.createElement(this.selectorType);
    bar.id = mainId;
    ["pen-progress", "big", this.constructor.name].forEach(cls => bar.classList.add(cls));
    let capsule = document.createElement("div");
    ["pen-capsule"].forEach(cls => capsule.classList.add(cls));
    this.cartridge = document.createElement("div");
    ["pen-cartridge"].forEach(cls => this.cartridge.classList.add(cls));
    this.cartridge.setAttribute("style", "height: " + (100 - this.dat) + "%;");
    capsule.appendChild(this.cartridge);
    this.label = document.createElement("span");
    this.label.innerText = this.dat !== null && this.dat !== undefined && this.dat > 0 ? (this.dat + "%") : "";
    ["progress-value"].forEach(cls => this.label.classList.add(cls));
    capsule.appendChild(this.label);
    let penTip = document.createElement("div");
    ["pen-tip", "arrow-down"].forEach(cls => penTip.classList.add(cls));
    let penInkTip = document.createElement("div");
    ["pen-ink-tip", "arrow-down"].forEach(cls => penInkTip.classList.add(cls));
    bar.appendChild(capsule);
    bar.appendChild(penTip);
    bar.appendChild(penInkTip);
    if (domParent !== undefined && domParent !== null) {
        domParent.appendChild(bar);
    }
};
ProgressBar.prototype.setValue = function (data) {
    if (data !== null && data !== undefined && Object.getPrototypeOf(data) !== Number.prototype) {
        return;
    }
    if (data < 0) {
        data = 0;
    } else
        if (data > 100) {
            data = 100;
        }
    this.dat = data;
    if (this.cartridge !== null) {
        this.cartridge.setAttribute("style", "height: " + (100 - this.dat) + "%;");
    }
    if (this.label !== null) {
        this.label.innerText = this.dat + "%;";
    }
};
DataBindingEvent = function (properties = {
    detail: {
        index: null,
        data: null
    }
}) {
    Event.call(this, "dataBinding", properties);
};
DataBindingEvent.prototype = Object.create(Event.prototype);

DataBoundEvent = function (properties = {
    detail: {
        index: null,
        type: null,
        data: null
    }
}) {
    Event.call(this, "dataBound", properties);
};
DataBoundEvent.prototype = Object.create(Event.prototype);

const root = {
    length: 0,

    add: function (elem) {
        [].push.call(this, elem)
    },
    get: function (uid) {
        return [].filter.call(this, function (value, index, arr) {
            return value.uid === uid;
        });
    }
};
const recycleBin = new RecycleBin();

