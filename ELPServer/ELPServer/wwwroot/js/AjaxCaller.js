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
    return this.ip.concat(':').concat(this.port);
};
IpPortDomain.prototype.isValid = function () {
    return this.ip !== null && this.ip !== undefined &&
        this.ip.length > 0 && this.port !== null && this.port !== undefined &&
        this.port > 0;
};
IpPortDomain.prototype.validate = function () {
    let valid = this.isValid();
    if (!valid) {
        let i = this.ip === null ? "null" : this.ip === undefined ? "<undefined>" : this.ip.length === 0 ? "<empty>" : this.ip;
        let prt = this.port === null ? "null" : this.port === undefined ? "<undefined>" : this.port.length === 0 ? "<empty>" : this.port;
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
    return this.protocol.concat(this.protocol.endsWith(':') ? "//" : "://").concat(this.domain.name);
};
Server.prototype.default = function () {
    return new Server(window.location.protocol, new IpPortDomain(window.location.hostname, window.location.port));
};

function AjaxRequest(destServer, controller, action, jsonData) {
    this.destinationServer = destServer;
    this.controller = controller;
    this.action = action;
    this.data = jsonData;
    this.method = "post";
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
AjaxCaller.prototype.post = function (request) {
    if (request === null || request === undefined || !request.validate()) {
        return;
    }
    request.setMethod("POST");
    this.send(request);
};
AjaxCaller.prototype.put = function (request) {
    if (request === null || request === undefined || !request.validate()) {
        return;
    }
    request.setMethod("PUT");
    this.send(request);
};
AjaxCaller.prototype.del = function (request) {
    if (request === null || request === undefined || !request.validate()) {
        return;
    }
    request.setMethod("DEL");
    this.send(request);
};
AjaxCaller.prototype.send = function (request) {
    if (this.onSuccess === null || this.onSuccess === undefined) {
        console.warn("Call is almost valid, at least define a handler!");
    }
    $.ajax({
        type: request.method,
        url: request.getToken(),
        data: request.data,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: this.onSuccess,// sign function (data, text)
        error: this.onError// sign function (request, status, error)
    });
};

var defaultServer = Server.prototype.default();

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