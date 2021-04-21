let TranslatedTexts = {
    dashboard: "Dashboard",
    dataIsNotFound: "Data Is Not Found.",
}

let BoardIcons = {
    student:"icon-student",
    course: "icon-course",
    request: "icon-request",
    message : "icon-message"
}

function BoardItem(
    boardItemId = Math.random() * 20000,
    // type of the object is the identifier to give it an icon
    type = "",
    data = "",
    dataTitle = "",
    icon = "",
    link = ""
) {
    this.boardItemId = boardItemId;
    this.type = type;
    this.data = data;
    this.dataTitle = dataTitle;
    this.icon = icon;
    this.link = link;
}

BoardItem.extends(Node);
BoardItem.construct();
BoardItem.prototype.create = function () { }
BoardItem.prototype.getDisplay = function () {

    let mainDiv = document.createElement("div");
    mainDiv.classList.add("col-xl-3", "col-md-6", "mb-4");

    let card = document.createElement("div");
    card.classList.add("card", "border-left-primary", "shadow", "h-100", "py-2");

    let bodyDiv = document.createElement("div");
    bodyDiv.classList.add("card-body");

    let subBody = document.createElement("div");
    subBody.classList.add("row", "no-gutters", "align-items-center");

    let dataDiv = document.createElement("div");
    dataDiv.classList.add("col", "mr-2");

    let title = document.createElement("div");
    title.classList.add("text-xs", "font-weight-bold", "text-primary", "text-uppercase", "mb-1");
    title.innerHTML = this.dataTitle;

    let data = document.createElement("div");
    data.classList.add("h5", "mb-0", "font-weight-bold", "text-gray-800");
    data.innerHTML = this.data;

    dataDiv.appendChild(title);
    dataDiv.appendChild(data);

    let iconDiv = document.createElement("div");
    iconDiv.classList.add("col-auto");

    let icon = document.createElement("div");
    icon.classList.add(BoardIcons[this.type]);

    iconDiv.appendChild(icon);

    subBody.appendChild(dataDiv);
    subBody.appendChild(iconDiv);

    bodyDiv.appendChild(subBody);

    card.appendChild(bodyDiv);

    mainDiv.appendChild(card);

    return mainDiv;
}

BoardItem.prototype.addLink = function (linkToAdd) {
    this.link = linkToAdd;
}

function Board(
    creationTarget = null,
    dataSource = null,
    dataSourceParams = {},
    selectorType = "div",
    children = [],
    childType = BoardItem,
    capacity = null,
    data = [],
    css = [],
    singleton = false,
    asRoot = false
) {
    this.dataSourceParams = dataSourceParams;
    ParentNode.call(this,
        creationTarget,
        dataSource,
        selectorType,
        children,
        childType,
        capacity,
        data,
        css,
        undefined,
        undefined,
        singleton,
        asRoot,
        this.dataSourceParams
    );
}

Board.extends(ParentNode);
Board.construct();

Board.prototype.dataBound = function () {
    let data = this.dat;
    let main = this;
    if (data.content.length > 0) {
        data.content.forEach(function (itemB, index) {
            let item = new BoardItem(itemB.id,itemB.type,itemB.data,itemB.dataTitle);
            main.add(item);
        })
    }
}

Board.prototype.dataBind = function (onsuccess = function (data, text) { }, onerror = function () { }) {
    ParentNode.prototype.dataBind.call(this,
        onsuccess, onerror
    );
};

Board.prototype.create = function (parameter) {
    if (this.creationTarget !== null && this.creationTarget.length > 0) {
        if (this.dat != undefined && this.dat != null) {
            let display = this.getDisplay();
            let target = document.getElementById(this.creationTarget);
            if (target !== null && display !== null) {
                target.appendChild(display);
            }
        }
    }
};

Board.prototype.getDisplay = function () {

    let childrenDiv = document.createElement("div");
    childrenDiv.classList.add("row");

    // appending the children
    if (this.children.length > 0) {
        this.children.forEach(function (child) {
            let childDiv = child.getDisplay();
            childrenDiv.appendChild(childDiv);
        });
    } else {
        childrenDiv.appendChild(makeDataNotFound(TranslatedTexts.dataIsNotFound, { "text-align": "center", color: "red" }, 1));
    }

    return childrenDiv;
}

function makeProgressBar(barTitle, barPercent) {
    barPercent = parseInt(barPercent);
    let progressBarDiv = document.createElement("div");

    let title = document.createElement("h4");
    title.classList.add("small", "font-weight-bold");
    title.innerHTML = barTitle;

    let percentageSpan = document.createElement("span");
    percentageSpan.classList.add("float-right");
    percentageSpan.innerHTML = barPercent + "%";

    title.appendChild(percentageSpan);

    let progress = document.createElement("div");
    progress.classList.add("progress");

    let progBar = document.createElement("div");
    progBar.setAttribute('role',"progressbar");
    progBar.setAttribute('aria-valuenow',barPercent);
    progBar.setAttribute('aria-valuemin',"0");
    progBar.setAttribute('aria-valuemax',"100");
    progBar.style.width = barPercent + "%" ;

    if (barPercent <= 20) {
        progBar.classList.add("progress-bar", "bg-danger");
    }
    else if (barPercent >= 21 && barPercent <= 40) {
        progBar.classList.add("progress-bar", "bg-warning");
    }
    else if (barPercent >= 41 && barPercent <= 60) {
        progBar.classList.add("progress-bar");
    }
    else if (barPercent >= 61 && barPercent <= 99) {
        progBar.classList.add("progress-bar", "bg-info");
    }
    else {
        progBar.classList.add("progress-bar", "bg-success");
    }

    progress.appendChild(progBar);

    progressBarDiv.appendChild(title);
    progressBarDiv.appendChild(progress);

    return progressBarDiv;
}

function makeDataNotFound(text, css = {}, hx = 2) {
    let h2 = document.createElement('h' + hx);
    h2.innerHTML = text;
    $(h2).css(css);
    return h2;
}

function tutorDashboard(target, dataSource, dataSourceParams) {
    let board = new Board(target, dataSource, { ...dataSourceParams});
    board.dataBind();
}