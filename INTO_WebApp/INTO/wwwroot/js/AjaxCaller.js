function Domain(name) {
    this.name = name;
};
Object.defineProperty(Domain.prototype, 'constructor', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: Domain
});
Domain.prototype.getName = function () {
    return this.name;
};
Domain.prototype.isValid = function () {
    return this.name !== null && this.name !== undefined &&
        this.name.length > 0;
};
Domain.prototype.validate = function () {
    let valid = this.isValid();
    if (!valid) {
        let nm = this.name === null ? "null" : this.name === undefined ? "<undefined>" : this.name.length === 0 ? "<empty>" : this.name;
        console.error("Invalid domain: ".concat(nm));
    }
    return valid;
};

function IpPortDomain(ip, port) {
    Domain.call(this, ip.concat(':').concat(port));
    this.ip = ip;
    this.port = port;
};
IpPortDomain.prototype = Object.create(Domain.prototype);
Object.defineProperty(IpPortDomain.prototype, 'constructor', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: IpPortDomain
});
IpPortDomain.prototype.getName = function () {
    return this.port !== null && this.port !== undefined && this.port.length > 0 ? this.ip.concat(':').concat(this.port) : this.ip;
};
IpPortDomain.prototype.isValid = function () {
    return this.ip !== null && this.ip !== undefined &&
        this.ip.length > 0;
};
IpPortDomain.prototype.validate = function () {
    let valid = this.isValid();
    if (!valid) {
        let i = this.ip === null ? "null" : this.ip === undefined ? "<undefined>" : this.ip.length === 0 ? "<empty>" : this.ip;
        //let prt = this.port === null ? "null" : this.port === undefined ? "<undefined>" : this.port.length === 0 ? "<empty>" : this.port;
        console.error("Invalid domain: ".concat(i).concat(':').concat(prt));
    }
    return valid;
};

function Server(protocol, domain) {
    this.protocol = protocol;
    this.domain = domain;
};
Object.defineProperty(Server.prototype, 'constructor', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: Server
});
Server.prototype.isValid = function () {
    return this.domain.validate() && this.protocol !== null && this.protocol !== undefined &&
        this.protocol.length > 0;
};
Server.prototype.validate = function () {
    let valid = this.isValid();
    if (!valid) {
        let prtcl = this.protocol === null ? "<null>" : this.protocol === undefined ? "<undefined>" : this.protocol.length === 0 ? "<empty>" : this.protocol;
        let dmn = this.domain === null ? "<null>" : this.domain === undefined ? "<undefined>" : this.domain.name.length === 0 ? "<empty>" : this.domain.getName();
        console.error("Invalid server url: ".concat(prtcl).concat('://').concat(dmn));
    }
    return valid;
};
Server.prototype.fullName = function () {
    return this.protocol.concat(this.protocol.endsWith(':') ? "//" : "://").concat(this.domain.getName());
};
Server.prototype.default = function () {
    return new Server(window.location.protocol, new IpPortDomain(window.location.hostname, window.location.port));
};

function AjaxRequest(jsonData = null, action = "Index", controller = "Home", destServer = Server.prototype.default(), area = "default", contentType = "application/x-www-form-urlencoded; charset=UTF-8", asJsonString = false, method = "POST", crossDomain = false, dataType = null) {
    this.data = asJsonString === true ? {
        json: JSON.stringify(jsonData)
    } : jsonData;
    this.action = action !== null && action !== undefined ? action : "Index";
    this.controller = controller !== null && controller !== undefined ? controller : "home";
    this.destinationServer = destServer !== null && destServer !== undefined ? destServer : Server.prototype.default();
    this.area = area !== null && area !== undefined ? area : "default";
    this.contentType = contentType !== null && contentType !== undefined ? contentType : "application/x-www-form-urlencoded; charset=UTF-8";
    this.method = method !== null && method !== undefined ? method : "POST";
    this.crossDomain = crossDomain !== null && crossDomain !== undefined ? crossDomain : false;
    this.dataType = dataType;
};
Object.defineProperty(AjaxRequest.prototype, 'constructor', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: AjaxRequest
});
AjaxRequest.prototype.setMethod = function (method) {
    this.method = method;
};
AjaxRequest.prototype.isValid = function () {
    return !((this.destinationServer === null || this.destinationServer === undefined)
        || this.destinationServer.length === 0
        || (this.controller !== null && this.controller !== undefined && this.controller.length === 0)
        || (this.action !== null && this.action !== undefined && this.action.length === 0)
        || (this.method === null || this.method === undefined)
        || this.method.length === 0);
};
AjaxRequest.prototype.validate = function () {
    let serverExists = this.destinationServer !== null && this.destinationServer !== undefined;
    if (!serverExists) {
        console.error("Destination server is undefined! You must defined a destination server, example: let server = new Server(\"https\", new IpPortDomain(\"localhost\", \"12345\"));");
    }
    let validServer = serverExists && this.destinationServer.validate();
    let valid = this.isValid();
    if (!valid) {
        console.error("Invalid request and hence not sent! Please check the defined domain, controller, and action.");
    }
    return validServer && valid;
};
AjaxRequest.prototype.getToken = function () {
    return this.destinationServer.fullName().concat('/').concat(this.controller).concat('/').concat(this.action);
};

function AjaxCaller(successHandler, errorHandler) {
    this.onSuccess = successHandler;
    this.onError = errorHandler;
};
Object.defineProperty(AjaxCaller.prototype, 'constructor', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: AjaxCaller
});
AjaxCaller.prototype.onSuccessCall = function (successHandler) {
    this.onSuccess = successHandler;
};
AjaxCaller.prototype.onErrorCall = function (errorHandler) {
    this.onError = errorHandler;
};
AjaxCaller.prototype.get = function (request) {
    if (request === null || request === undefined || !request.validate()) {
        return;
    }
    request.setMethod("GET");
    this.send(request);
};
AjaxCaller.prototype.getWithPromise = function (request) {
    if (request === null || request === undefined || !request.validate()) {
        return;
    }
    request.setMethod("GET");
    this.sendWithPromise(request);
};
AjaxCaller.prototype.post = function (request) {
    if (request === null || request === undefined || !request.validate()) {
        return;
    }
    request.setMethod("POST");
    this.send(request);
};
AjaxCaller.prototype.postWithPromise = function (request) {
    if (request === null || request === undefined || !request.validate()) {
        return;
    }
    request.setMethod("POST");
    this.sendWithPromise(request);
};
AjaxCaller.prototype.put = function (request) {
    if (request === null || request === undefined || !request.validate()) {
        return;
    }
    request.setMethod("PUT");
    this.send(request);
};
AjaxCaller.prototype.putWithPromise = function (request) {
    if (request === null || request === undefined || !request.validate()) {
        return;
    }
    request.setMethod("PUT");
    this.sendWithPromise(request);
};
AjaxCaller.prototype.del = function (request) {
    if (request === null || request === undefined) {
        console.error("Call couldn't be made, because request is " + request + "!");
        return false;
    }
    if (request === null || request === undefined || !request.validate()) {
        return;
    }
    request.setMethod("DEL");
    this.send(request);
};
AjaxCaller.prototype.delWithPromise = function (request) {
    if (request === null || request === undefined || !request.validate()) {
        return;
    }
    request.setMethod("DEL");
    this.sendWithPromise(request);
};
AjaxCaller.prototype.send = function (request) {
    if (this.onSuccess === null || this.onSuccess === undefined) {
        console.warn("Call is almost valid, at least define a handler!");
    }
    let caller = this;
    $.ajax({
        type: request.method,
        url: request.getToken(),
        data: request.data,
        contentType: request.contentType,
        success: caller.onSuccess,// sign function (data, text)
        error: caller.onError// sign function (request, status, error)
    });
};

AjaxCaller.prototype.sendWithPromise = function (request) {
    if (request === null || request === undefined) {
        console.error("Call couldn't be made, because request is " + request + "!");
        return false;
    }
    if (this.onSuccess === null || this.onSuccess === undefined) {
        console.warn("Call is almost valid, at least define a handler!");
    }
    if (Function.isFunction(this.onSuccess) && Function.isFunction(this.onError)) {
        let caller = this;

        const promise = new Promise((resolve, reject) => {
            let error = function (request, status, error) {
                reject(request.responseText);
            };
            let success = function (data, text) {
                resolve(data);
            };
            $.ajax({
                type: request.method,
                url: request.getToken(),
                data: request.data,
                contentType: request.contentType,
                success: success,// sign function (data, text)
                error: error// sign function (request, status, error)
            });
        }).then((data) => {
            caller.onSuccess(data);
        }).catch((message) => {
            caller.onError(message);
        });
    } else {
        console.error("Ajax call not made because at least the success handler is invalid!");
    }
};

var defaultServer = Server.prototype.default();

cancelNoticeReq = function (notice) {
    let request = new AjaxRequest({ id: accountManager.currentUser.id, notice: notice, lang: language }, "CancelNoticeSvc", "tutor");
    return request;
};

buildTutorStepsRequest = function () {
    let request = new AjaxRequest({ uId: accountManager.currentUser.userId, objEntityId: accountManager.currentUser.entityType, lang: language }, "FetchSteps", "tutor");
    return request;
};

buildTutorEduRequest = function () {
    let request = new AjaxRequest({ id: accountManager.currentUser.id, lang: language }, "Education", "tutor");
    return request;
};

tutorDegreesRequest = function () {
    let request = new AjaxRequest(null, "TutorDegrees", "LookUp");
    return request;
};

completeTutorStep = function () {
    let request = new AjaxRequest({ uId: accountManager.currentUser.userId, stepId: stepId, objEntityId: accountManager.currentUser.entityType }, "stepComplete", "tutor");
    return request;
};

deleteFileRequest = function (fileId, sourceType, userId) {
    let request = new AjaxRequest({ id: fileId, sourceType: sourceType, userId: userId, lang: language }, "delete", "files");
    return request;
};

visitTutorStep = function () {
    let request = new AjaxRequest({ uId: accountManager.currentUser.userId, stepId: stepId, objEntityId: accountManager.currentUser.entityType }, "stepVisit", "tutor");
    return request;
};

nextTutorStep = function () {
    let request = new AjaxRequest({ uId: accountManager.currentUser.userId, stepId: stepId, objEntityId: accountManager.currentUser.entityType }, "NextStep", "tutor");
    return request;
};

tutorPrefReq = function () {
    let request = new AjaxRequest({ tutor: accountManager.currentUser.id }, "pref", "tutor");
    return request;
};

tutorMaterialUpdateReq = function (json) {
    let request = new AjaxRequest({ id: accountManager.currentUser.id, json: json, lang: language }, "material", "tutor");
    return request;
};

tutorRatesReq = function (materialId) {
    let request = new AjaxRequest({ id: accountManager.currentUser.id, material: materialId, lang: language }, "RatesSvc", "tutor");
    return request;
};

userPicReq = function (userId) {
    let request = new AjaxRequest({ picture: null, miniPicture: null, userId: userId }, "Picture", "Account");
    return request;
};

roomInfoReq = function (roomId) {
    let request = new AjaxRequest({ id: roomId, tZOS: (new Date()).getTimezoneOffset(), lang: language }, "room", "meeting");
    return request;
};

joinRoomReq = function (roomId) {
    let request = new AjaxRequest({ id: roomId, participant: me.UserId, tzOffset: (new Date()).getTimezoneOffset(), lang: language }, "join", "meeting");
    return request;
};

abandonRoomReq = function (roomId, rating, feedback) {
    let request = new AjaxRequest({ id: roomId, participant: me.UserId, rating: rating, feedback: feedback, tzOffset: (new Date()).getTimezoneOffset(), lang: language }, "abandon", "meeting");
    return request;
};

rateObjReq = function (objId, objType, value) {
    let request = new AjaxRequest({ userId: accountManager.currentUser.userId, objId: objId, objType: objType, value: value, lang: language }, "Rate", "Account");
    return request;
};

likeObjReq = function (objId, objType, like) {
    let request = new AjaxRequest({ userId: accountManager.currentUser.userId, objId: objId, objType: objType, like: like, lang: language }, "Like", "Account");
    return request;
};

reviewObjReq = function (objId, objType, review) {
    let request = new AjaxRequest({ userId: accountManager.currentUser.userId, objId: objId, objType: objType, review: review, lang: language }, "review", "Account");
    return request;
};

ratingsReq = function (objId = null, objType = null) {
    let request = new AjaxRequest({ userId: accountManager.currentUser.userId, objId: objId, objType: objType, lang: language }, "Ratings", "Account");
    return request;
};

friendReq = function (requestee) {
    let request = new AjaxRequest({ requester: accountManager.currentUser.userId, requestee: requestee, lang: language }, "Friend", "Account");
    return request;
};
/**
 * Example:
 * let request = new AjaxRequest(defaultServer, "tutor", "detailsSvc", {id: 1});
 *
 * let success = function(data, text){ alert(data.legalFirstName);};

 * let error = function(request, status, error){ alert("Error!");};
 *
 * let caller = new AjaxCaller(success, error);
 *
 * caller.post(request);
 *
 */