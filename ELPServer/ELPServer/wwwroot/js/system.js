getNode = function (domObj) {
    return domObj.getAttribute("data-id");
};
Array.prototype.contains = function (hasId) {
    this.forEach(c => { if (c.id === hasId.id) { return true; } return false; })
};
function Node(selectorType) {
    this.index = 0;
    this.id = "0";
    this.parent = null;
    this.selectorType = selectorType;
    this.selectorIndex = null;
    this.dat = null;
    this.editing = false;
};
Object.defineProperty(Node.prototype, 'constructor', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: Node
});
Node.prototype.setIndex = function (ix) {
    this.index = ix;
};
Node.prototype.setId = function (id) {
    this.id = id;
};
Node.prototype.setSelectorType = function (selectorType) {
    this.selectorType = selectorType;
};
Node.prototype.setSelectorIndex = function (selectorIndex) {
    this.selectorIndex = selectorIndex;
};
Node.prototype.getValueDOM = function () {
    return document.getElementById(this.selectorType.concat(this.selectorIndex));
};
Node.prototype.getDOM = function () {
    return document.getElementById(this.constructor.name.concat(this.selectorIndex));
};
Node.prototype.getValue = function () {
    return document.getElementById(this.selectorType.concat(this.selectorIndex)).value;
};
Node.prototype.data = function () {
    return document.getElementById(this.selectorType.concat(this.selectorIndex)).value;
};
Node.prototype.dataBind = function () { };
Node.prototype.create = function () { };
Node.prototype.delete = function () {
    recycleBin.add(this);
};
Node.prototype.setParent = function (p) {
    this.parent = p;
};
Node.prototype.get = function () {
    return document.getElementById(this.constructor.name.concat(this.id));
};
Node.prototype.val = function () {
    return document.getElementById(this.constructor.name.concat(this.id));
};
Node.prototype.isParent = function () {
    return this instanceof ParentNode;
};
Node.prototype.stillContained = function () {
    return this.parent !== null && this.parent !== undefined && this.parent.contains(this);
};
Node.prototype.persist = function () {
    this.dat = this.data();
};
Node.prototype.parse = function (json) { this.dat = json; return this; };
Node.prototype.getDisplay = function () {
    return this.getValueDOM();
};
Node.prototype.cache = function () {};

function ParentNode(selectorType) {
    Node.call(this, selectorType);
    this.childType = null;
    this.children = [];
};
ParentNode.prototype = Object.create(Node.prototype);
Object.defineProperty(ParentNode.prototype, 'constructor', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: ParentNode
});
ParentNode.prototype.create = function () { }
ParentNode.prototype.setChildType = function (cType) {
    this.childType = cType !== undefined ? cType : null;
};
ParentNode.prototype.add = function (child) {
    if (this.childType !== null && !(child instanceof this.childType)) {
        return child;
    }
    let oldLen = this.children.length;
    if (!this.children.includes(child)) {
        this.children.push(child);
        child.setParent(this);
        child.setIndex(this.children.length - 1);
        child.setId(this.id.concat('.').concat(this.children.length - 1));
    }
    if (this.children.length > oldLen) {
        this.render(oldLen, this.children.length, child);
        this.onContentChanged();
        this.onChildAdded([child]);
    }
    return child;
};
ParentNode.prototype.render = function (oldLen, child) { }
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
ParentNode.prototype.persist = function () {
    Node.prototype.persist.call(this);
    if (this.children !== null && this.children !== undefined) {
        this.children.forEach(child => child.persist());
    }
};
ParentNode.prototype.onEmpty = function () { };
ParentNode.prototype.onContentChanged = function () { };
ParentNode.prototype.onChildAdded = function (children) { };
ParentNode.prototype.onChildRemoved = function (children) { };
ParentNode.prototype.getDisplay = function () {
    if (this.children !== null && this.children !== undefined) {
        let div = document.createElement("div");
        this.children.forEach(child => div.appendChild(child.getDisplay()));
        return div;
    }

    return this.getValueDOM();
};

function RecycleBin() {
    ParentNode.call(this, "div");
};
RecycleBin.prototype = Object.create(ParentNode.prototype);
Object.defineProperty(RecycleBin.prototype, 'constructor', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: RecycleBin
});
RecycleBin.prototype.create = function (domParentId) {
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
        $(this.getDOM()).append($(child.getDOM()).detach());
    }
    return child;
};
RecycleBin.prototype.getDOM = function () {
    let rbs = document.getElementsByClassName("RecycleBin");
    let rb = rbs.length > 0 ? rbs[0] : null;
    return rb;
};
