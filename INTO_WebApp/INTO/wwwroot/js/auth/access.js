function Language(id = 1, desc = "English", rtl = false) {
    this.id = id;
    this.description = desc;
    this.rTL = rtl;
};
Object.defineProperty(Language.prototype, 'constructor', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: Language
});
Language.prototype.create = function (domParentId) { }
Language.prototype.validate = function (emailOrMobile) {
};
Language.prototype.cache = function () {
    localStorage.setItem("Language".concat(this.LanguageId), JSON.stringify(this));
};
Language.prototype.parse = function (json) {
    let language = JSON.parse(json);
    return language;
};

function AccessToken(approved = false, expiryDate = null) {
    this.approved = approved;
    this.expiryDate = expiryDate;
};
Object.defineProperty(AccessToken.prototype, 'constructor', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: AccessToken
});
AccessToken.prototype.create = function (domParentId) { }
AccessToken.prototype.validate = function () {
};
AccessToken.prototype.cache = function () {
    localStorage.setItem("AccessToken".concat(this.AccessTokenId), JSON.stringify(this));
};
AccessToken.prototype.parse = function (json) {
    let accessToken = JSON.parse(json);
    return accessToken;
};

function LoginModel(user = null,
                    success = function () { console.log("login succeded."); },
                    error = function () { console.log("login failed."); },
                    date = new Date(),
                    rememberMe = false,
                    redirectAction = null,
                    redirectController = null,
                    token = null,
                    languages = []) {
    this.user = user;
    this.success = success;
    this.error = error;
    this.date = date;
    this.rememberMe = rememberMe;
    this.redirectAction = redirectAction;
    this.redirectController = redirectController === null && redirectAction !== null && redirectAction.length > 0 ? "Home" : redirectController;
    this.token = token;
    this.languages = languages;
};
Object.defineProperty(LoginModel.prototype, 'constructor', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: LoginModel
});
LoginModel.prototype.login = function () {
    let main = this;
    $.ajax({
        type: "POST",
        url: '@Url.Action("loginSvc", "login")',//window.location.origin.concat("/login/loginSvc"),
        data: { json: JSON.stringify(this) },
        success: main.success,
        error: main.error
    });
};
LoginModel.prototype.create = function (domParentId) { }
LoginModel.prototype.validate = function (emailOrMobile) {
};
LoginModel.prototype.cache = function () {
    localStorage.setItem("LoginModel".concat(this.LoginModelId), JSON.stringify(this));
};
LoginModel.prototype.parse = function (json) {
    let loginModel = JSON.parse(json);
    return loginModel;
};

showSignIn = function (jsonModel) {
    accountManager.setupLogin(jsonModel);
    //$("[data-auth-modal-tab=\"sign-in\"]").click();
};
showSignUp = function () {
    accountManager.setupLogin();
    $("[data-auth-modal-tab=\"sign-in\"]").click();
};
setupSignAgreement = function () {
    $("[data-role=\"agree-check\"]").on("change", function (e) {
        if (this.checked === true) {
            $("[data-role=\"signUp-submit\"]").removeAttr("disabled");;
        } else {
            $("[data-role=\"signUp-submit\"]").attr("disabled", true);;
        }
    });
};
/*----*/
setupBusinessType = function () {
    $(".purpose-radio-input").on("change", function (e) {
        console.log($(this).val());
        let v = parseInt($(this).val());
        let documentId = 0;
        switch (v) {
            case 1://Tutor
                window.location.href = window.location.origin.concat("/SignUp/TutorDocumentary/").concat(documentId).concat("/").concat(v);
                break;
            case 2://Student
                window.location.href = window.location.origin.concat("/SignUp/SignUp").concat("/2/0/1");//jinan
                break;
            case 3://Parent
                window.location.href = window.location.origin.concat("/SignUp/SignUp").concat("/3/0/1");//jinan
                break;
            default:
                console.log("Student");
        }
    });
};
