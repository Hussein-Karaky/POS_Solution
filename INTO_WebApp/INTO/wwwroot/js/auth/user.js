function User(fn, ln, emailOrMobile, pass, secEmail, type, selectorType) {
    ParentNode.call(this, undefined, undefined, selectorType);
    this.userId = -1;
    this.firstName = fn;
    this.lastName = ln;
    this.email = emailOrMobile;
    this.phone = null;
    this.password = pass;
    this.secondaryEmail = secEmail;
    this.entityType = type;
    this.gender = true;
    this.dOB = null;
    this.secondaryPhone = null;
    //this.country = null;
    //this.address = null;
    //this.secondAddress = null;
    //this.city = null;
    //this.longitude = null;
    //this.latitude = null;
    //this.privacyRadius = 0.125;
    //this.travelRadius = null;
    this.locationSettings = null;
    this.isBlocked = null;
    this.active = null;
    this.internal = null;
    this.notificationPreferences = [];
    this.potential = 0;
    /** following to be moved to subtype tutor later */
    this.id = -1;
    this.legalFN = null;
    this.legalLN = null;
    this.privateEmail = null;
    this.title = null;
    this.visible = false;
    this.inPersonHourRate = null;
    this.inPersonCurrency = null;
    this.onlineHourRate = null;
    this.onlineCurId = null;
    this.cancellationNotice = null;
    this.rateDetails = null;
    this.education = null;
    this.materials = null;
    this.preferences = null;
    this.typeOfDegrees = null;
    this.recognition = null;
    this.regStepsCompleted = null;
    this.availability = null;
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
User.prototype.parse = function (json) {
    let user = JSON.parse(json);
    return user;
};
User.prototype.fetchMaterials = function () {
    let error = function (request, status, error) {
        console.error(request.responseText);
    };
    let success = function (data, text) {
        if (data !== null && data.length > 0) {
            data.foreach(mat => console.log(mat.id
                + ", " + mat.name
                + ", " + mat.subject
                + ", " + mat.curriculum
                + ", " + mat.approved
                + ", " + mat.certified
                + ", " + mat.points
                + ", " + mat.subject
                + ", " + mat.subject)
            );
        }
    };
    $.ajax({
        type: "POST",
        url: window.location.origin.concat("/tutor/MaterialsSvc"),
        data: { id: 1, lang: 1 },
        success: success,
        error: error
    });
    let user = JSON.parse(json);
    return user;
};

function Country(id, code, name, latitude, longitude, isoCode, alpha3Code, alpha2Code, selectorType) {
    Node.call(this, undefined, undefined, selectorType);
    this.id = id;
    this.code = code;
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.iSOCode = isoCode;
    this.alpha3Code = alpha3Code;
    this.alpha2Code = alpha2Code;
}
function GeoLocation(latitude, longitude)
    {
        this.longitude = latitude;
        this.latitude = longitude;
    }
//function Tutor(selectorType) {
//    User.call(this, selectorType);
//    this.id = -1;
//    this.legalFN = null;
//    this.legalLN = null;
//    this.privateEmail = null;
//    this.gender = null;
//    this.dOB = null;
//    this.title = null;
//    this.visible = false;
//    this.InPersonHourRate = null;
//    this.InPersonCurrency = null;
//    this.OnlineHourRate = null;
//    this.OnlineCurId = null;
//    this.CancellationNotice = null;
//    this.RateDetails = null;
//    this.Education = null;
//    this.Materials = null;
//    this.Preferences = null;
//    this.TypeOfDegrees = null;
//    this.Recognition = null;
//    this.RegStepsCompleted = null;
//};
//Tutor.prototype = Object.create(User.prototype);
//Object.defineProperty(Tutor.prototype, 'constructor', {
//    enumerable: false,
//    configurable: false,
//    writable: false,
//    value: Tutor
//});
var user = new User();
