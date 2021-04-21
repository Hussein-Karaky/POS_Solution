//V1.0
//6:49PM 26/07/2020

//import { weekdays } from "moment";
function BriefAvailability(day = -1, time = -1) {
    this.day = day;
    this.time = time;
};
Object.defineProperty(BriefAvailability.prototype, 'constructor', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: BriefAvailability
});

var availTimes = [
    {
        time: { id: 0, name: "Before Noon" },
        sun: { time: 0, day: { id: 0, name: "sun" }, checked: false },
        mon: { time: 0, day: { id: 1, name: "mon" }, checked: false },
        tue: { time: 0, day: { id: 2, name: "tue" }, checked: false },
        wed: { time: 0, day: { id: 3, name: "wed" }, checked: false },
        thu: { time: 0, day: { id: 4, name: "thu" }, checked: false },
        fri: { time: 0, day: { id: 5, name: "fri" }, checked: false },
        sat: { time: 0, day: { id: 6, name: "sat" }, checked: false }
    },
    {
        time: {
            id: 1, name: "After Noon"
        },
        sun: { time: 1, day: { id: 0, name: "sun" }, checked: false },
        mon: { time: 1, day: { id: 1, name: "mon" }, checked: false },
        tue: { time: 1, day: { id: 2, name: "tue" }, checked: false },
        wed: { time: 1, day: { id: 3, name: "wed" }, checked: false },
        thu: { time: 1, day: { id: 4, name: "thu" }, checked: false },
        fri: { time: 1, day: { id: 5, name: "fri" }, checked: false },
        sat: { time: 1, day: { id: 6, name: "sat" }, checked: false }
    },
    {
        time: {
            id: 2, name: "Evening"
        },
        sun: { time: 2, day: { id: 0, name: "sun" }, checked: false },
        mon: { time: 2, day: { id: 1, name: "mon" }, checked: false },
        tue: { time: 2, day: { id: 2, name: "tue" }, checked: false },
        wed: { time: 2, day: { id: 3, name: "wed" }, checked: false },
        thu: { time: 2, day: { id: 4, name: "thu" }, checked: false },
        fri: { time: 2, day: { id: 5, name: "fri" }, checked: false },
        sat: { time: 2, day: { id: 6, name: "sat" }, checked: false }
    }
];

dayHours = function () {
    return [{ index: 0, selected: false, disabled: false, value: "Midnight" },
    { index: 1, selected: false, disabled: false, value: "1 am" },
    { index: 2, selected: false, disabled: false, value: "2 am" },
    { index: 3, selected: false, disabled: false, value: "3 am" },
    { index: 4, selected: false, disabled: false, value: "4 am" },
    { index: 5, selected: false, disabled: false, value: "5 am" },
    { index: 6, selected: false, disabled: false, value: "6 am" },
    { index: 7, selected: false, disabled: false, value: "7 am" },
    { index: 8, selected: false, disabled: false, value: "8 am" },
    { index: 9, selected: false, disabled: false, value: "9 am" },
    { index: 10, selected: false, disabled: false, value: "10 am" },
    { index: 11, selected: false, disabled: false, value: "11 am" },
    { index: 12, selected: false, disabled: false, value: "Noon" },
    { index: 13, selected: false, disabled: false, value: "1 pm" },
    { index: 14, selected: false, disabled: false, value: "2 pm" },
    { index: 15, selected: false, disabled: false, value: "3 pm" },
    { index: 16, selected: false, disabled: false, value: "4 pm" },
    { index: 17, selected: false, disabled: false, value: "5 pm" },
    { index: 18, selected: false, disabled: false, value: "6 pm" },
    { index: 19, selected: false, disabled: false, value: "7 pm" },
    { index: 20, selected: false, disabled: false, value: "8 pm" },
    { index: 21, selected: false, disabled: false, value: "9 pm" },
    { index: 22, selected: false, disabled: false, value: "10 pm" },
    { index: 23, selected: false, disabled: false, value: "11 pm" }];
};

weekDays = [{ index: 0, value: "Sunday", key: "sun" },
{ index: 1, value: "Monday", key: "mon" },
{ index: 2, value: "Tuesday", key: "tue" },
{ index: 3, value: "Wednesday", key: "wed" },
{ index: 4, value: "Thursday", key: "thu" },
{ index: 5, value: "Friday", key: "fri" },
{ index: 6, value: "Saturday", key: "sat" }];

function DropDown(creationTarget = null, dataSource = null, text = "", clsArr = [], autoComplete = "off", selectorType = "div", valueMember = "index", displayMember = "value") {
    ParentNode.call(this, creationTarget, dataSource, selectorType);
    this.text = text;
    this.css = clsArr;
    this.autoComplete = autoComplete;
    this.options = dataSource;
    this.onSelectionChanged = null;
    this.valueMember = valueMember;
    this.displayMember = displayMember;
};
DropDown.extends(ParentNode);
DropDown.construct();
DropDown.prototype.create = function (domParentId) {
    let div = document.createElement('div');
    div.classList.add(this.constructor.name);
    div.id = this.constructor.name.concat(document.getElementsByClassName(this.constructor.name).length);
    div.classList.add("dropdown");
    let btn = document.createElement('button');
    btn.id = div.id.concat(btn.type).concat(div.children.length);
    btn.type = "button";
    btn.innerText = this.text;
    this.css.forEach(cssClass => btn.classList.add(cssClass));
    btn.setAttribute("data-toggle", "dropdown");
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");
    div.appendChild(btn);
    let dropDownMenu = document.createElement('div');
    dropDownMenu.classList.add("dropdown-menu");
    dropDownMenu.setAttribute("aria-labelledby", "dropdownMenuButton");
    div.appendChild(dropDownMenu);
    this.setSelectorIndex(document.getElementsByClassName(this.selectorType).length);
    let selectId = this.selectorType.concat(this.selectorIndex);
    dropDownMenu.id = selectId;
    if (domParentId !== null && domParentId !== undefined && domParentId.length > 0) {
        document.getElementById(domParentId).appendChild(div);
        this.dataBind();
    }
    return this;
};
DropDown.prototype.dataBind = function () {
    this.options.forEach(option => {
        let a = document.createElement("a");
        a.classList.add("dropdown-item");
        a.href = "#";
        a.innerText = option;
        if (option.selected === true) {
            a.classList.add("active");
        } else {
            a.classList.remove("active");
        }
        if (option.disabled === true) {
            a.classList.add("disabled");
        } else {
            a.classList.remove("disabled");
        }

        this.getValueDOM().appendChild(a);
    });
};

function DropDownList(creationTarget = null, dataSource = null, text = "", clsArr = []) {
    DropDown.call(this, creationTarget, dataSource, text, clsArr, "off", "select");
};
DropDownList.extends(DropDown);
DropDownList.construct();
DropDownList.prototype.create = function (domParentId) {
    let div = document.createElement('div');
    div.classList.add(this.constructor.name);
    div.id = this.constructor.name.concat(document.getElementsByClassName(this.constructor.name).length);
    div.classList.add("form-group");
    let label = document.createElement('label');
    label.innerText = this.text;
    this.setSelectorIndex(document.getElementsByTagName(this.selectorType).length);
    let selectId = this.selectorType.concat(this.selectorIndex);
    let select = document.createElement(this.selectorType);
    this.css.forEach(cssClass => select.classList.add(cssClass));
    label.setAttribute("for", selectId);
    div.appendChild(label);
    select.id = selectId;
    select.classList.add("form-control");
    div.appendChild(select);

    if (domParentId !== null && domParentId !== undefined && domParentId.length > 0) {
        document.getElementById(domParentId).appendChild(div);
        this.dataBind();
    }
    return this;
};
DropDownList.prototype.select = function (index) {
    let dom = this.getValueDOM();
    if (index >= 0 && index < dom.options.length) {
        this.options[parseInt(this.getValueDOM().selectedIndex)].selected = false;
        dom.selectedIndex = index;
        this.options[index].selected = true;
    }
    dom.dispatchEvent(new Event("change"));
};
DropDownList.prototype.data = function (domParentId) {
    let dom = this.getValueDOM();
    //let ix = parseInt($(dom).val());
    //let val = dom.options[dom.selectedIndex] !== undefined ? dom.options[dom.selectedIndex].text : "";
    return {
        index: parseInt(dom.options[dom.selectedIndex].value),
        value: dom.options[dom.selectedIndex] !== undefined ? dom.options[dom.selectedIndex].text : ""
    };
};
DropDownList.prototype.dataBind = function () {
    let dom = this.getValueDOM();
    this.options.forEach(option => {
        let opt = dom.querySelector("option[value='".concat(option.index).concat("']"));
        let exists = true;
        if (opt === null) {
            exists = false;
            opt = document.createElement("option");
        }
        if (typeof option === "string" || option instanceof String) {
            opt.innerText = option;
        } else {
            opt.value = option.index;
            opt.innerHTML = option.value;
        }
        opt.selected = option.selected;
        opt.disabled = option.disabled
        if (exists !== true) {
            this.getValueDOM().appendChild(opt);
        }
    });
};
DropDownList.prototype.parse = function (data) {
    if (data !== null) {
        Node.prototype.parse.call(this, data);
        if (this.editing === true) {
            this.select(data.index);
        } else {
            console.warn("To be completed!");
        }
    }
};

function CheckBox(label, value, onChange, autoId = true, css = ["form-check-input"]) {
    Node.call(this, undefined, undefined, "check", value, css, autoId);
    this.label = label;
    this.value = value;
    this.onChange = onChange;
};
CheckBox.extends(Node);
CheckBox.construct();
CheckBox.prototype.change = function (onChange) {
    this.onChange = onChange;
};
CheckBox.prototype.getDisplay_ = function () {
    let div = document.createElement('div');
    div.classList.add(this.constructor.name);
    div.classList.add("form-check");
    this.setSelectorIndex(document.getElementsByClassName(this.constructor.name).length);
    div.id = this.constructor.name.concat(this.selectorIndex);
    let checkBox = this.getDisplay();
    div.appendChild(checkBox);
    let lbl = document.createElement('label');
    lbl.classList.add("form-check-label");
    lbl.setAttribute("for", checkBox.id);
    lbl.innerHTML = this.label;
    div.appendChild(lbl);
    return div;
};
CheckBox.prototype.create = function (domParentId) {
    let display = this.getDisplay_();
    if (domParentId !== null && domParentId !== undefined && domParentId.length > 0) {
        document.getElementById(domParentId).appendChild(display);
        let dom = this.getValueDOM();
        if (dom !== null && dom !== undefined) {
            dom.innerHtml = this.makeValueUI();
        }
    }
    return this;
};
CheckBox.prototype.data = function () {
    return this.getValueDOM().checked;
};
CheckBox.prototype.getDisplay = function () {
    let checkBox = document.createElement('input');
    checkBox.checked = this.value === true;
    this.css.forEach(cls => { if (String.isString(cls)) { checkBox.classList.add(cls); } });
    checkBox.type = "checkbox";
    if (this.autoId === true) {
        checkBox.id = this.selectorType.concat(this.selectorIndex);
    }
    let main = this;
    if (this.onChange !== null && this.onChange !== undefined && this.onChange instanceof Function) {
        checkBox.onchange = function (e) {
            main.onChange(e);
        };
    }
    return checkBox;
};

function MultiSelectList(creationTarget = null, dataSource = null) {
    ParentNode.call(this, creationTarget, dataSource, "ul");
    this.options = dataSource !== null && dataSource !== undefined ? dataSource : [{ index: 0, value: "All" }];
};
MultiSelectList.extends(ParentNode);
MultiSelectList.construct();
MultiSelectList.prototype.create = function (domParentId) {
    let list = document.createElement('ul');
    [this.constructor.name, "multiselect-item", "multiselect-all"].forEach(cls => list.classList.add(cls));
    this.setSelectorIndex(document.getElementsByClassName(this.constructor.name).length);
    list.id = this.constructor.name.concat(this.selectorIndex);

    if (domParentId !== null && domParentId !== undefined && domParentId.length > 0) {
        document.getElementById(domParentId).appendChild(list);
    }

    let main = this;
    this.options.forEach(option => {
        let item = document.createElement('li');
        ["multiselect-item", "multiselect-all"].forEach(cls => item.classList.add(cls));
        item.id = list.id.concat(".li").concat(option.index);
        list.appendChild(item);
        let check = new CheckBox(option.value, option.index, undefined, undefined, ["form-check-input", "sm"]);
        main.add(check);
        check.create(item.id);
    });
    return this;
};
MultiSelectList.prototype.clearSelection = function () {
    this.children.forEach(child => { child.getDOM().getElementsByTagName("input")[0].checked = false; });
};

MultiSelectList.prototype.data = function (domParentId) {
    let data = { list: [] };
    this.children.forEach(child => { if (child.getDOM().getElementsByTagName("input")[0].checked) { data.list.push(this.options[child.index]); } });
    return data;
};
MultiSelectList.prototype.getDisplay = function () {
    let span = document.createElement("span");
    let data = this.data();
    span.innerHTML = data.list.join(", ");
    return span;
};

function TimeLimit() {
    ParentNode.call(this, undefined, undefined, "div");
    this.from = null;
    this.to = null;
    this.before = null;
    this.after = null;
    this.flipped = false;
    this.extra = {
        phoneCall: { checked: false },
        onlineSession: { checked: false },
        faceToFace: { checked: false }
    }
};
TimeLimit.extends(ParentNode);
TimeLimit.construct();
TimeLimit.prototype.create = function (domParentId) {
    this.setSelectorIndex(document.getElementsByClassName(this.constructor.name).length);
    let mainId = this.constructor.name.concat(this.selectorIndex);
    let bodyDiv = document.createElement('div');
    bodyDiv.classList.add(this.constructor.name);
    bodyDiv.id = mainId;
    bodyDiv.classList.add("form-group");
    bodyDiv.classList.add("flip-card");
    if (domParentId !== null && domParentId !== undefined && domParentId.length > 0) {
        document.getElementById(domParentId).appendChild(bodyDiv);
    }

    let inCard = document.createElement('div');
    inCard.id = "innerCard".concat(document.getElementsByClassName("flip-card-inner").length);
    inCard.classList.add("flip-card-inner");
    bodyDiv.appendChild(inCard);
    let frontCard = document.createElement('div');
    frontCard.id = "frontCard".concat(document.getElementsByClassName("flip-card-front").length);
    frontCard.classList.add("flip-card-front");
    inCard.appendChild(frontCard);
    let backCard = document.createElement('div');
    backCard.id = "backCard".concat(document.getElementsByClassName("flip-card-back").length);
    backCard.classList.add("flip-card-back");
    inCard.appendChild(backCard);

    this.from = new DropDownList(undefined, dayHours(), "", ["form-control"]);
    this.from.create(frontCard.id);
    let sep = document.createElement('span');
    sep.innerHTML = "&nbsp;to&nbsp;";
    frontCard.appendChild(sep);
    this.to = new DropDownList(undefined, dayHours(), "", ["form-control"]);
    this.to.create(frontCard.id);
    let main = this;
    this.from.getValueDOM().onchange = function (e) {
        main.from.options.forEach(opt => { opt.selected = false; });
        main.from.options[main.from.data().index].selected = true;
        main.to.options.forEach(opt => { opt.disabled = opt.index <= main.from.data().index; });
        main.to.dataBind();
        if (main.to.data().index <= main.from.data().index) {
            main.to.select(main.from.data().index + 1);
        }
        if (main.before !== null && main.before !== undefined) {
            main.before.to.options.forEach(opt => { if (opt.index < main.from.data().index && opt.index >= main.before.to.data().index) { opt.disabled = false; } });
            main.before.dataBind();
        }
    };
    this.to.getValueDOM().onchange = function (e) {
        main.to.options.forEach(opt => { opt.selected = opt.index === e.target.selectedIndex; });
        main.to.dataBind();
        if (main.after !== null && main.to.data().index < main.after.from.data().index - 1) {
            main.after.from.options.forEach(opt => { opt.disabled = opt.index <= main.to.data().index; });
            main.after.from.dataBind();
        }
    };
    let btnClose = document.createElement('button');
    btnClose.type = "button";
    ["ml-2", "mb-1", "close"].forEach(c => btnClose.classList.add(c));
    btnClose.setAttribute("data-dismiss", "toast");
    btnClose.setAttribute("aria-label", "Close");
    let spn = document.createElement('span');
    spn.setAttribute("aria-hidden", "true");
    spn.innerHTML = "&times;";
    btnClose.appendChild(spn);
    btnClose.onclick = function (e) {
        if (main.parent !== null && main.parent !== undefined) {
            $(main.getDOM()).animate({
                opacity: 0,
                marginLeft: '-200px'
            }, 'fast', 'linear', function () { main.parent.remove(main); });

        } else {
            $(main.getDOM()).animate({
                opacity: 0,
                marginLeft: '-200px'
            }, 'fast', 'linear', function () { main.delete(); });
        }
    };
    frontCard.appendChild(btnClose);
    this.extra.phoneCall = new CheckBox("Phone calls", true, undefined, undefined, ["form-check-input", "sm"]);
    this.extra.phoneCall.create(backCard.id);
    this.extra.phoneCall.getDOM().classList.add("flip-check");
    this.extra.phoneCall.getValueDOM().onchange = function (e) {

    };
    this.extra.onlineSession = new CheckBox("Online only", true, undefined, undefined, ["form-check-input", "sm"]);
    this.extra.onlineSession.create(backCard.id);
    this.extra.onlineSession.getDOM().classList.add("flip-check");
    this.extra.onlineSession.getValueDOM().onchange = function (e) {

    };
    this.extra.faceToFace = new CheckBox("Face to face", true, undefined, undefined, ["form-check-input", "sm"]);
    this.extra.faceToFace.create(backCard.id);
    this.extra.faceToFace.getDOM().classList.add("flip-check");
    this.extra.faceToFace.getValueDOM().onchange = function (e) {

    };
    let btnFlip = document.createElement('button');
    btnFlip.type = "button";
    ["ml-2", "mb-1", "close"].forEach(c => btnFlip.classList.add(c));
    btnFlip.setAttribute("data-dismiss", "toast");
    btnFlip.setAttribute("aria-label", "Close");
    btnFlip.innerHTML = "<svg class=\"xsmall\"><path class=\"xsmall\" d=\"M0 40 L30 72 L60 40\"></path></svg>";
    btnFlip.onclick = function (e) {
        if (main.flipped === false) {
            inCard.setAttribute("style", "transform: rotateX(180deg)");
            main.flipped = true;
        } else {
            inCard.setAttribute("style", "transform: rotateX(0deg)");
            main.flipped = false;
        }
    };
    frontCard.appendChild(btnFlip);
    let btnFlipBack = document.createElement('button');
    btnFlipBack.type = "button";
    ["ml-2", "mb-1", "close", "btn-flip"].forEach(c => btnFlipBack.classList.add(c));
    btnFlipBack.setAttribute("data-dismiss", "toast");
    btnFlipBack.setAttribute("aria-label", "Close");

    btnFlipBack.innerHTML = "<svg class=\"xsmall\"><path class=\"xsmall\" d=\"M0 40 L30 72 L60 40\"></path></svg>";
    btnFlipBack.onclick = function (e) {
        if (main.flipped === false) {
            inCard.setAttribute("style", "transform: rotateX(180deg)");
            main.flipped = true;
        } else {
            inCard.setAttribute("style", "transform: rotateX(0deg)");
            main.flipped = false;
        }
    };
    backCard.appendChild(btnFlipBack);
    if (this.dat !== null && this.dat !== undefined) {
        this.from.select(this.dat.from.index);
        this.to.select(this.dat.to.index);
        this.extra.phoneCall.checked = this.dat.extra.phoneCall;
        this.extra.onlineSession.checked = this.dat.extra.onlineSession;
        this.extra.faceToFace.checked = this.dat.extra.faceToFace;
    }
    return this;
};
TimeLimit.prototype.getDisplay = function () {
    let div = document.createElement('div');
    div.classList.add("form-group");
    div.classList.add(this.constructor.name.concat("-Display"));

    if (this.dat !== null) {
        let from = document.createElement('label');
        from.innerText = this.dat.from.value;
        div.appendChild(from);
        let sep = document.createElement('span');
        sep.innerHTML = "&nbsp;-&nbsp;";
        div.appendChild(sep);
        let to = document.createElement('label');
        to.innerText = this.dat.to.value;
        div.appendChild(to);

        if (this.dat.extra.phoneCall !== true && this.dat.extra.onlineSession === true && this.dat.extra.faceToFace !== true) {
            let onlineSession = document.createElement('span');
            onlineSession.innerHTML = "&nbsp;(Online only)&nbsp;";
            div.appendChild(onlineSession);
        }
    }
    return div;
};
TimeLimit.prototype.data = function () {
    return {
        from: this.from.data(),
        to: this.to.data(),
        extra: {
            phoneCall: this.extra.phoneCall.getValueDOM().checked,
            onlineSession: this.extra.onlineSession.getValueDOM().checked,
            faceToFace: this.extra.faceToFace.getValueDOM().checked
        }
    };
};
TimeLimit.prototype.setBefore = function (limit, skip) {
    this.before = limit;
    if (limit !== null) {
        if (!skip) {
            limit.setAfter(this, true);
        }
        this.before.to.options.forEach(opt => { if (opt.index >= this.from.data().index) { opt.disabled = true; } });
        this.before.to.dataBind();
        this.from.options.forEach(opt => { if (opt.index <= this.before.to.data().index) { opt.disabled = true; } });
    } else {
        this.from.options.forEach(opt => { if (opt.index < this.from.data().index) { opt.disabled = false; } });
    }
    this.from.dataBind();
};
TimeLimit.prototype.setAfter = function (limit, skip) {
    this.after = limit;
    if (limit !== null) {
        limit.from.select(this.to.data().index + 1);
        if (!skip) {
            limit.setBefore(this, true);
        }
        this.to.options.forEach(opt => { if (opt.index >= this.after.from.data().index) { opt.disabled = true; } });
        this.after.from.select(this.to.data().index + 1);
        this.after.from.options.forEach(opt => { opt.disabled = (opt.index <= this.to.data().index); });
        this.after.from.dataBind();
        this.after.from.getValueDOM().dispatchEvent(new Event('change'));
    } else {
        this.to.options.forEach(opt => { if (opt.index > this.to.data().index) { opt.disabled = false; } });
    }
    this.to.dataBind();
};
TimeLimit.prototype.dataBind = function () {
    if (this.from !== null) {
        this.from.dataBind();
    }
    if (this.to !== null) {
        this.to.dataBind();
    }
};
TimeLimit.prototype.parse = function (data) {
    if (data !== null) {
        Node.prototype.parse.call(this, data);
        this.from.parse(data.from);
        this.to.parse(data.to);
        this.extra.phoneCall.getValueDOM().checked = data.extra.phoneCall;
        this.extra.onlineSession.getValueDOM().checked = data.extra.onlineSession;
        this.extra.faceToFace.getValueDOM().checked = data.extra.faceToFace;
    }
};

function AvailabilityDay(day) {
    ParentNode.call(this, undefined, undefined, "div");
    this.day = day;
    this.editing = false;
    this.extra = {
        active: { checked: false, selection: null }
    }
    this.front = null;
    this.back = null;
};
AvailabilityDay.extends(ParentNode);
AvailabilityDay.construct();
AvailabilityDay.prototype.defaultStartTime = 8;
AvailabilityDay.prototype.render = function (oldLength, length, limit) {
    limit.create(this.getDOM().id);
    if (length > 1) {
        this.children[oldLength - 1].setAfter(limit);
    } else {
        limit.from.select(AvailabilityDay.prototype.defaultStartTime);
    }
};
AvailabilityDay.prototype.add = function (limit) {
    if (limit !== null && limit !== undefined) {
        ParentNode.prototype.add.call(this, limit);
    }
    return limit;
};
AvailabilityDay.prototype.remove = function (limit) {
    let oldLength = this.children.length;
    let before = limit.before;
    let after = limit.after;
    if (before !== null && after !== null) {
        before.setAfter(after);
    } else if (before !== null && before !== undefined) {
        before.setAfter(null);
    } else if (after !== null && after !== undefined) {
        after.setBefore(null);
    }
    ParentNode.prototype.remove.call(this, limit);
    //console.log(this.children);
};
AvailabilityDay.prototype.calculateHeight = function () {
    return this.editing === true ? (60 + 74 * this.children.length) : $($(this.getDOM()).closest(".flip-card-inner").find(".".concat(this.constructor.name).concat("-Display"))[0]).height();
};
AvailabilityDay.prototype.onChildAdded = function (children) {
    $(this.getDOM()).closest(".flip-card-inner").animate({ height: this.calculateHeight() + "px" }, 300);
    $(this.getDOM()).animate({ height: this.calculateHeight() + "px" }, 300);
    if (this.children.length > 0) {
        $(this.getDOM()).parent().parent().find(".btn-edit").show();
    } else {
        $(this.getDOM()).parent().parent().find(".btn-edit").hide();
    }
};
AvailabilityDay.prototype.onChildRemoved = function (children) {
    $(this.getDOM()).closest(".flip-card-inner").animate({ height: this.calculateHeight() + "px" }, 300);
    $(this.getDOM()).animate({ height: this.calculateHeight() + "px" }, 300);
};
AvailabilityDay.prototype.create = function (domParentId) {
    let mainDiv = ParentNode.prototype.getDisplay.call(this);
    mainDiv.id = this.day.value;

    if (domParentId !== null && domParentId !== undefined && domParentId.length > 0) {
        document.getElementById(domParentId).appendChild(mainDiv);
    }
    this.extra.active = new CheckBox(this.day.value, false, undefined, undefined, ["form-check-input", "md"]);
    this.extra.active.create(mainDiv.id);

    let inCard = document.createElement('div');
    inCard.id = "innerCard".concat(document.getElementsByClassName("flip-card-inner").length);
    inCard.classList.add("flip-card-inner");
    inCard.classList.add("big");
    inCard.classList.add("data-empty");

    mainDiv.appendChild(inCard);
    let frontCard = document.createElement('div');
    frontCard.id = "frontCard".concat(document.getElementsByClassName("flip-card-front").length);
    frontCard.classList.add("flip-card-front");
    this.front = frontCard;
    inCard.appendChild(frontCard);
    let backCard = document.createElement('div');
    backCard.id = "backCard".concat(document.getElementsByClassName("flip-card-back").length);
    backCard.classList.add("flip-card-back");
    this.back = backCard;
    inCard.appendChild(backCard);

    let div = document.createElement('div');
    div.classList.add(this.constructor.name);
    div.classList.add("form-group");
    this.setSelectorIndex(document.getElementsByClassName(this.constructor.name).length - 1);
    div.id = this.constructor.name.concat(this.selectorIndex);
    backCard.appendChild(div);

    let control = document.createElement('div');
    control.classList.add("ribbon-control-mini");
    div.appendChild(control);

    let main = this;
    this.extra.active.getValueDOM().onchange = function (e) {
        if (this.checked === true) {
            main.editing = true;
            let tl = new TimeLimit();
            main.add(tl);
            $(main.getDOM()).closest(".flip-card-back").css("visibility", "visible");
            $(main.getDOM()).closest(".flip-card-inner").css("transform", "rotateY(180deg)");
        } else {
            main.editing = false;
            $(main.getDOM()).closest(".flip-card-back").css("visibility", "hidden");
            $(main.getDOM()).closest(".flip-card-inner").css("transform", "rotateY(0deg)");
            main.children.forEach(child => child.delete());
            main.clear();
        }
        $(main.getDOM()).closest(".flip-card-inner").find(".btn-edit").css("display", (main.dat !== null && main.dat !== undefined && main.children.length > 0) && !main.editing ? "inline-block" : "none");
    };
    let btnOK = document.createElement('button');
    btnOK.type = "button";
    ["ml-2", "mb-1", "close", "btn", "btn-check"].forEach(c => btnOK.classList.add(c));
    btnOK.setAttribute("data-dismiss", "toast");
    btnOK.setAttribute("aria-label", "Close");
    btnOK.setAttribute("style", "top: 28%; position: relative;");
    btnOK.innerHTML = "<svg viewBox=\"8 8 56 56\"><path class=\"path-checkmark\" fill=\"none\" d=\"M14.1 27.2l7.1 7.2 16.7-16.8\" stroke-width=\"3\"></path></svg>";
    btnOK.onclick = function (e) {
        main.editing = false;
        if (main.children !== null && main.children !== undefined && main.children.length > 0) {
            main.persist();
            main.extra.selection.data().list.forEach(day => { main.parent.children[day.index].children.forEach(child => child.delete()); main.parent.children[day.index].parse(main.dat); });
        } else {
            $(this.front).empty();
        }
        main.extra.selection.clearSelection();
        frontCard.innerHTML = "";
        frontCard.appendChild(main.getDisplay());
        let card = $(main.getDOM()).closest(".flip-card-inner");
        $(card.find(".btn-edit")[0]).css("display", main.dat === null || main.dat === undefined || main.children.length === 0 ? "none" : "inline-block");
        inCard.setAttribute("style", "transform: rotateY(0deg)");
        main.extra.active.getDOM().getElementsByTagName("input")[0].checked = main.dat !== null && main.dat !== undefined && main.children.length > 0;
        card.animate({ height: main.calculateHeight() + "px" }, 300);
        if (main.dat === null || main.dat === undefined || main.children.length === 0) {
            card.removeClass("data-filled");
            card.addClass("data-empty");
        } else {
            card.removeClass("data-empty");
            card.addClass("data-filled");
        }
        event.preventDefault();
        $(main.getDOM()).closest(".flip-card-inner").find(".btn-edit").css("display", (main.dat !== null && main.dat !== undefined && main.children.length > 0) && !main.editing ? "inline-block" : "none");
        $(main.getDOM()).closest(".flip-card-inner").find(".AvailabilityDay-Display").removeClass("editing");
    };
    control.appendChild(btnOK);

    let btnPlus = document.createElement('button');
    btnPlus.type = "button";
    ["ml-2", "mb-1", "close", "btn", "btn-plus"].forEach(c => btnPlus.classList.add(c));
    btnPlus.setAttribute("data-dismiss", "toast");
    btnPlus.setAttribute("aria-label", "Close");
    btnPlus.setAttribute("style", "top: 28%; position: relative;");
    btnPlus.innerHTML = "<svg viewBox=\"14 14 100 100\"><line x1=\"22.5\" y1=\"46.5\" x2=\"70.5\" y2=\"46.5\" stroke-width=\"4\"></line><line x1=\"46.5\" y1=\"22.5\" x2=\"46.5\" stroke-width=\"4\" y2=\"70.5\"></line></svg>";
    btnPlus.onclick = function (e) {
        main.add(new TimeLimit());
        //$(inCard).animate({ height: main.calculateHeight() + "px" }, 300);
    };
    control.appendChild(btnPlus);

    let cId = "collapsible".concat(document.getElementsByClassName("collapse").length);
    let collapser = document.createElement('button');
    collapser.type = "button";
    collapser.setAttribute("data-toggle", "collapse");
    collapser.setAttribute("aria-expanded", "false");
    collapser.setAttribute("aria-controls", cId);
    collapser.setAttribute("data-target", "#".concat(cId));
    collapser.setAttribute("style", "top: 28%; position: relative; padding: 4px 1px 1px 4px;");

    collapser.innerHTML = //"Copy";
        "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"-56 -50 768 768\" xml:space=\"preserve\" width=\"24\" height=\"24\" style=\"width: 24px; height: 24px;\"><g><g><g><path style=\"fill:#007bff;\" d=\"M335.328,332.459V44.569c0-13.079-10.64-23.711-23.719-23.711H23.711	C10.632,20.858,0,31.482,0,44.569v287.89c0,13.079,10.624,23.719,23.711,23.719h287.898" +
        "C324.688,356.178,335.328,345.546,335.328,332.459z M311.316,311.422c0,11.437-9.315,20.752-20.752,20.752h-245.8" +
        "c-11.437,0-20.752-9.315-20.752-20.752V65.614c0-11.437,9.315-20.736,20.752-20.736h245.8c11.437,0,20.752,9.299,20.752,20.736" +
        "V311.422z\"/></g><g>" +
        "   <path style=\"fill:#007bff;\" d=\"M448.47,116.011h-95.356v3.633v3.13v24.028h74.32c7.722,0,13.957,6.259,13.957,13.965v245.8" +
        "c0,7.69-6.235,13.957-13.957,13.957H181.625c-7.698,0-13.973-6.267-13.973-13.957v-28.361h-3.633h-3.13h-24.012v49.397" +
        "c0,13.079,10.632,23.727,23.695,23.727H448.47c13.079,0,23.719-10.648,23.719-23.727V139.722" +
        "C472.189,126.635,461.549,116.011,448.47,116.011z\"/>" +
        "</g></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>";
    ["ml-2", "mb-1", "close", "btn", "btn-col"].forEach(cls => collapser.classList.add(cls));
    control.appendChild(collapser);

    let copyList = document.createElement('div');
    copyList.id = cId;
    copyList.classList.add("collapse");
    control.appendChild(copyList);

    collapser.onclick = function (e) {
        control.setAttribute("style", "height: ".concat(copyList.classList.contains("show") ? "30px;" : "216px"));
    };

    let card = document.createElement('div');
    ["card", "card-body"].forEach(cls => card.classList.add(cls));
    card.id = copyList.id.concat(".card");
    copyList.appendChild(card);

    let filtered = [];
    weekDays.forEach(item => { if (item.index !== this.index) { filtered.push(item); } });
    this.extra.selection = new MultiSelectList(undefined, filtered);
    this.extra.selection.create(card.id);

    frontCard.appendChild(this.getDisplay());
    $(this.getDOM()).closest(".flip-card-inner").find(".btn-edit").css("display", (this.dat !== null && this.dat !== undefined && this.children.length > 0) && !this.editing ? "inline-block" : "none");
    return this;
};
AvailabilityDay.prototype.getDisplay = function () {
    let main = this;
    let div = document.createElement("div");
    div.classList.add(this.constructor.name.concat("-Display"));
    let btnEdit = document.createElement('button');
    btnEdit.type = "button";
    ["ml-2", "mb-1", "close", "btn", "btn-edit"].forEach(c => btnEdit.classList.add(c));
    btnEdit.setAttribute("data-dismiss", "toast");
    btnEdit.setAttribute("aria-label", "Close");
    btnEdit.setAttribute("style", "top: 28%; position: relative;");
    btnEdit.innerHTML = "<svg height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"#007bff\" d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z\"></path></svg>";
    div.appendChild(btnEdit);
    btnEdit.onclick = function (e) {
        main.editing = true;
        $(main.getDOM()).closest(".flip-card-inner").animate({ height: main.calculateHeight() + "px" }, 300);
        $(main.getDOM()).closest(".flip-card-inner").css("transform", "rotateY(180deg)");
        $(main.getDOM()).closest(".flip-card-inner").find(".AvailabilityDay-Display").addClass("editing");
    };
    $(main.getDOM()).closest(".flip-card-inner").find(".btn-edit").css("display", (main.dat !== null && main.dat !== undefined && main.children.length > 0) && !main.editing ? "inline-block" : "none");

    if (this.children !== null && this.children !== undefined) {
        let cDisp = document.createElement("div");
        this.children.forEach(child => cDisp.appendChild(child.getDisplay()));
        div.appendChild(cDisp);
    }

    return div;
};
AvailabilityDay.prototype.clear = function (skip) {
    //    ParentNode.prototype.clear.call(this, skip);
    this.children = [];
    if (this.dat !== null && this.data !== undefined) {
        this.dat.limits = [];
    }
    this.dat = null;
    $(this.front).empty();
    if (this.dat !== null && this.dat !== undefined && this.dat.limits.length > 0) {
        $(this.getDOM()).closest(".flip-card-inner").removeClass("data-empty");
        $(this.getDOM()).closest(".flip-card-inner").addClass("data-filled");
    } else {
        $(this.getDOM()).closest(".flip-card-inner").removeClass("data-filled");
        $(this.getDOM()).closest(".flip-card-inner").addClass("data-empty");
        $(this.getDOM()).closest(".flip-card-inner").animate({ height: "5px" }, 300);
    }
    this.onEmpty();
};
AvailabilityDay.prototype.data = function () {
    let data = {
        day: this.day,
        active: this.extra.active.getValueDOM().checked,
        limits: []
    };
    this.children.forEach(limit => data.limits.push(limit.data()));
    return data;
};
AvailabilityDay.prototype.parse = function (data) {
    if (data !== null) {
        Node.prototype.parse.call(this, data);
        this.extra.active.checked = data.active;
        this.extra.active.getDOM().getElementsByTagName("input")[0].checked = data.active;
        data.limits.forEach(limit => this.add(new TimeLimit()).parse(limit));
        let main = this;
        //$(this.getDOM().closest(".flip-card-inner")).find(".flip-card-front").empty();
        $(this.front).empty();
        //$(this.getDOM().closest(".flip-card-inner")).find(".flip-card-front").append($(this.getDisplay()));
        this.front.appendChild(this.getDisplay());
        $(this.getDOM()).closest(".flip-card-inner").animate({ height: this.calculateHeight() + "px" }, 300);
        if (this.dat !== null && this.dat !== undefined && this.dat.limits.length > 0) {
            $(this.getDOM()).closest(".flip-card-inner").removeClass("data-empty");
            $(this.getDOM()).closest(".flip-card-inner").addClass("data-filled");
        } else {
            $(this.getDOM()).closest(".flip-card-inner").removeClass("data-filled");
            $(this.getDOM()).closest(".flip-card-inner").addClass("data-empty");
        }
        //$(this.getDOM().closest(".flip-card-inner")).find(".flip-card-front").find(".btn-edit").click(function (e) {
        //    $(main.getDOM()).closest(".flip-card-inner").animate({ height: 100 * main.children.length + "px" }, 300);
        //    $(main.getDOM()).closest(".flip-card-inner").css("transform", "rotateY(180deg)");
        //});

    }
};
AvailabilityDay.prototype.onEmpty = function () {
    $(this.getDOM()).find(".TimeLimit").each(function () { $(this).detach().appendTo($(recycleBin.getDOM())); });
};
AvailabilityDay.prototype.onContentChanged = function () {
    if (this.getDOM().getElementsByClassName("TimeLimit").length !== this.children.length) {
        this.clear();
    }
    this.extra.active.getDOM().getElementsByTagName("input")[0].checked = this.children !== null && this.children !== undefined && this.children.length > 0;
};

function Availability() {
    ParentNode.call(this, undefined, undefined, "div");
    weekDays.forEach(day => this.add(new AvailabilityDay(day)));
};
Availability.extends(ParentNode);
Availability.construct();
Availability.prototype.create = function (domParentId) {
    let div = ParentNode.prototype.getDisplay.call(this);
    div.classList.add(this.constructor.name);
    this.setSelectorIndex(document.getElementsByClassName(this.constructor.name).length);
    div.id = this.constructor.name.concat(this.selectorIndex);
    if (domParentId !== null && domParentId !== undefined && domParentId.length > 0) {
        document.getElementById(domParentId).appendChild(div);
    }
    this.children.forEach(child => { child.create(div.id); });
    return this;
};
Availability.prototype.data = function () {
    let data = {
        days: []
    };
    this.children.forEach(day => data.days.push(day.data()));
    return data;
};
Availability.prototype.parse = function (data) {
    if (data !== null) {
        let main = this;
        this.dat = data;
        data.days.forEach(function (day, index, days) {
            main.children[index].parse(day);
        });
    }
};
Availability.prototype.fetch = function (onError) {
    let main = this;
    $.ajax({
        type: "POST",
        url: window.location.origin.concat("/tutor/AvailSvc"),
        data: { json: null, id: accountManager.currentUser.userId, entityType: accountManager.currentUser.entityType },
        success: function (data, text) { main.parse(data); },// sign function (data, text)
        error: onError// sign function (request, status, error)
    });
};
Availability.prototype.save = function (onSuccess, onError) {
    let data = this.data();
    $.ajax({
        type: "POST",
        url: window.location.origin.concat("/tutor/availSvc"),
        data: { json: JSON.stringify(data), id: accountManager.currentUser.userId, entityType: accountManager.currentUser.entityType },
        success: onSuccess,// sign function (data, text)
        error: onError// sign function (request, status, error)
    });
};

function BriefAvailabilityUI(creationTarget, router = null,
    options = {
        gridCss: ["round-corner-5"],
        headerCss: ["white"],
        rowCss: ["white", "cursor-pointer"],
        alternatingCss: ["cursor-pointer"],
        innerCellCss: ["pt-0"],
        cornerCss: ["inVisible"],
        hideColumns: false,
        align: "center"
    }
) {
    DataGrid.call(this, creationTarget, availTimes, undefined, options, router, new SimpleGridFactory());
};
BriefAvailabilityUI.extends(DataGrid);
BriefAvailabilityUI.construct();
BriefAvailabilityUI.prototype.data = function () {
    return this.dat;
};
BriefAvailabilityUI.prototype.dataChecked = function () {
    let checkedData = [];
    this.dat.forEach(avail => {
        weekDays.forEach(day => {
            if (avail[day.key].checked === true) {
                checkedData.push({ time: avail.time, day: avail[day.key].day });
            }
        });
    });
    return checkedData;
};
BriefAvailabilityUI.prototype.hasValidData = function () {
    return Node.prototype.hasValidData.call(this) && this.dat !== null && this.dat instanceof Array && this.dat.length > 0;
};
BriefAvailabilityUI.prototype.getData = function () {
    return this.dat;
};

function SimpleGridFactory() {
    GridFactory.call(this);
};
SimpleGridFactory.extends(GridFactory);
SimpleGridFactory.construct();
SimpleGridFactory.prototype.generateColumns = function (grid) {
    if (grid !== null && grid.hasValidData()) {
        let columns = new Array();
        Object.keys(grid.dat[0]).forEach(key => { columns.push(new DataColumn(undefined, undefined, columns.length, key, key.toWords(), Object.getPrototypeOf(grid.dat[0][key]), key === "Id" || key === "id")); });
        grid.setColumns(columns);
    } else {
        grid.setColumns([]);
    }
};

$(document).ready(function () {
    //var sched = new Availability();
    //sched.create("availability");
});