function User(fn, ln, emailOrMobile, pass, secEmail, type, selectorType) {
    ParentNode.call(this, selectorType);
    this.userId = -1;
    this.firstName = fn;
    this.lastName = ln;
    this.email = null;
    this.phone = null;
    this.password = pass;
    this.secondaryEmail = secEmail;
    this.entityType = type;
    this.secondaryPhone = null;
    this.country = null;
    this.address = null;
    this.secondAddress = null;
    this.city = null;
    this.longitude = null;
    this.latitude = null;
    this.travelRadius = null;
    this.isBlocked = null;
    this.active = null;
    this.internal = null;
    this.notificationPreferences = [];
    this.validate(emailOrMobile);
};
User.prototype = Object.create(ParentNode.prototype);
Object.defineProperty(User.prototype, 'constructor', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: User
});
User.prototype.create = function (domParentId) { }
User.prototype.validate = function (emailOrMobile) {
    if (emailOrMobile !== null && emailOrMobile !== undefined && emailOrMobile.indexOf("@") > 1) {
        this.email = emailOrMobile;
    } else {
        this.phone = emailOrMobile;
    }
};
User.prototype.cache = function () {
    localStorage.setItem("user".concat(this.userId), JSON.stringify(this));
};
var user = new User();
