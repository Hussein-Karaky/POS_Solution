function Shortcut(ref, text, icon, iconType, iconClasses) {
    Node.call(this, undefined, undefined, "Shortcut");
    this.ref = ref;
    this.text = text;
    this.icon = icon;
    this.iconType = iconType;
    this.iconClasses = iconClasses;
};
Shortcut.prototype = Object.create(Node.prototype);
Object.defineProperty(Shortcut.prototype, 'constructor', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: Shortcut
});
Shortcut.prototype.create = function (domParentId) {
    let div = document.createElement('div');
    div.classList.add(this.constructor.name);
    this.setSelectorIndex(document.getElementsByClassName(this.constructor.name).length);
    div.id = this.constructor.name.concat(this.selectorIndex);
    if (domParentId !== null && domParentId !== undefined && domParentId.length > 0) {
        document.getElementById(domParentId).appendChild(div);
        let dom = this.getValueDOM();
        if (dom !== null && dom !== undefined) {
            dom.innerHtml = this.makeValueUI();
        }
    }
    let link = document.createElement('a');
    link.href = this.ref !== null && this.ref !== undefined ? this.ref : "#";
    div.appendChild(link);
    let iconContainer = document.createElement('div');
    iconContainer.classList.add("icon-container");
    link.appendChild(iconContainer);
    if (this.icon !== null && this.icon !== undefined && this.iconType !== null && this.iconType !== undefined) {
        let icon = document.createElement(this.iconType);
        if (this.iconClasses !== null && this.iconClasses !== undefined && this.iconClasses instanceof Array && this.iconClasses.length > 0) {
            this.iconClasses.forEach(cls => icon.classList.add(cls));
        }
        iconContainer.appendChild(icon);
    }
    let label = document.createElement('span');
    label.classList.add("shortcut-label");
    link.appendChild(label);
    label.innerText = this.text;
};
Shortcut.prototype.setText = function (text) {
    if (text !== null && text !== undefined && text.length > 0 && text !== this.text) {
        this.text = text;
        let label = this.getDOM().querySelectorAll(".shortcut-label")[0];
        if (label !== null && label !== undefined) {
            label.innerText = this.text;
        }
    }
};
Shortcut.prototype.setIcon = function (icon, iconType, iconClasses) {
    if (icon !== null && icon !== undefined && iconType !== null && iconType !== undefined) {
        this.icon = icon;
        this.iconType = iconType;
        this.iconClasses = iconClasses;
        let iconContainer = this.getDOM().querySelectorAll(".icon-container")[0];
        let icon = document.createElement(iconType);
        if (icon !== null && icon !== undefined && iconClasses !== null && iconClasses !== undefined && iconClasses instanceof Array && iconClasses.length > 0) {
            iconClasses.forEach(cls => icon.classList.add(cls));
        }
        iconContainer.appendChild(icon);
    }
};
function AppsViewer(shortcuts) {
    ParentNode.call(this, undefined, undefined, "AppsViewer", shortcuts);
    this.setChildType(Shortcut);
};
AppsViewer.prototype = Object.create(ParentNode.prototype);
Object.defineProperty(AppsViewer.prototype, 'constructor', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: AppsViewer
});
AppsViewer.prototype.create = function (domParentId) {
    let div = document.createElement('div');
    div.classList.add(this.constructor.name);
    div.classList.add("shortcuts-container");
    this.setSelectorIndex(document.getElementsByClassName(this.constructor.name).length);
    div.id = this.constructor.name.concat(this.selectorIndex);
    if (domParentId !== null && domParentId !== undefined && domParentId.length > 0) {
        document.getElementById(domParentId).appendChild(div);
        let dom = this.getValueDOM();
        if (dom !== null && dom !== undefined) {
            dom.innerHtml = this.makeValueUI();
        }
    }
    if (this.children !== null && this.children !== undefined && this.children instanceof Array && this.children.length > 0 && div !== null && div !== undefined) {
        this.children.forEach(shortcut => shortcut.create(div.id));
    }
};
AppsViewer.prototype.onChildAdded = function (children) {
    let div = this.getDOM();
    if (div !== null && div !== undefined) {
        children.forEach(child => child.create(div.id));
    }
};
AppsViewer.prototype.onChildRemoved = function (children) {
    let main = this;
    children.forEach(child => main.getDOM().removeChild(child));
};

