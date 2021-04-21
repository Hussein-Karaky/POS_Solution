function DataList(dataSource = null, method = "POST", data = [], name = null) {
    EventDispatcher.call(this);
    this.dataSrc = null;
    this.method = method;
    this.data = data;
    this.name = null;
    this.clearOnDataBind = true;
    this.setDataSource(dataSource);
    this.setName(name);
};
DataList.extends(EventDispatcher);
DataList.construct();
get(DataList, "dataSource", function () { return this.dataSrc; });
set(DataList, "dataSource", function (dataSource) {
    let oldSrc = this.dataSrc;
    this.dataSrc = dataSource;
    if (this.dataSrc !== oldSrc) {
        this.dataSourceChanged(oldSrc);
    }
});
get(DataList, "name", function () { return this.name; });
set(DataList, "name", function (name) {
    let oldName = this.name;
    this.name = name;
    if(this.name !== oldName){
        this.nameChanged(oldName);
    }
});
DataList.prototype.dataBind = function (onDataBound) {
    let main = this;
    let url = URL.parseUrl(this.getDataSource());
    if (url !== null) {
        let error = function (request, status, error) {
            console.error(request.responseText);
        };
        $.ajax({
            type: main.method,
            url: main.getDataSource(),
            data: null,
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
                        main.data = data;
                        main.dataBound(onDataBound);
                    }
                }
            },
            error: error
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
            this.data = this.getDataSource();
            this.dataBound(onDataBound);
        }
    }
};
DataList.prototype.dataBound = function (success) {
    if (Function.isFunction(success)) {
        success();
    }
};
DataList.prototype.dataSourceChanged = function (oldSrc) { };
DataList.prototype.clear = function () {
    this.data = [];
};
var langList = new DataList(window.location.origin.concat("/account/langs/"), "POST");
langList.addEventListener("dataBinding", function () {
    

});
langList.dataBind(function () {
    selectedLang = langList.data.filter(l => l.id === language)[0];
    if (selectedLang !== null) {
        document.querySelector("html").lang = selectedLang.code;
        document.dir = selectedLang.rTL ? "rtl" : "ltr";
    }
});
if (langList.data.length > 0) {
    selectedLang = langList.data.filter(l => l.id === language)[0];
    if (selectedLang !== null && selectedLang !== undefined) {
        document.querySelector("html").lang = selectedLang.code;
        document.dir = selectedLang.rtl ? "rtl" : "ltr";
        accountManager.currentUser.language = selectedLang;
        accountManager.updateLang();
    }
}
var genderList = new DataList(window.location.origin.concat("/lookup/val/").concat(language).concat("/gender"), "GET");
genderList.dataBind();

var fileSourceTypes = new DataList(window.location.origin.concat("/lookup/val/").concat(language).concat("/FileSourceType"), "GET");
fileSourceTypes.dataBind();

let lessonTypes = new DataList(window.location.origin.concat("/lookup/val/").concat(language).concat("/LessonTypes/LearningSession"), "GET");
lessonTypes.dataBind();

$(document).ready(function () {
    setupProfileDataControl();
    langList.dataBind(function () {
        selectedLang = langList.data.filter(l => l.id === language)[0];
        if (selectedLang !== null) {
            document.querySelector("html").lang = selectedLang.code;
            document.dir = selectedLang.rTL ? "rtl" : "ltr";
        }
    });

});

var titleMinLen = 1;
var freeResponseMinLen = 0;
var ambitionMinLen = 0;

setupProfileDataControl = function () {
    if (accountManager === null) {
        accountManager = new AccountManager();
        accountManager.load();
    }
    $("[data-role='save-tutor-title']").click(function () {
        let title = $("[data-role='input-tutor-title']").val();
        if (title !== null && title !== undefined && title.length >= titleMinLen) {
            accountManager.saveTitle(title);
        }
    });
    $("[data-role='save-tutor-freeResponse']").click(function () {
        let freeResponse = $("[data-role='input-tutor-freeResponse']").val();
        if (freeResponse !== null && freeResponse !== undefined && freeResponse.length >= freeResponseMinLen) {
            accountManager.saveFreeResponse(freeResponse);
        }
    });
    $("[data-role='save-tutor-availability']").click(function () {
        let any = false;
        let days = accountManager.sched.data().days;
        for (i = 0; i < days.length; i++) {
            if (days[i].active === true) {
                any = true;
                break;
            }
        }
        if (any === true) {
            accountManager.sched.save();
        }
    });
    $("[data-role='save-tutor-location']").click(function () {
        if (marker !== null && marker !== undefined) {
            accountManager.currentUser.locationSettings.location.latitude = marker.getPosition().lat();
            accountManager.currentUser.locationSettings.location.longitude = marker.getPosition().lng();
            accountManager.currentUser.locationSettings.privacyRadius = parseFloat($("#ddlPrivacyRadius").val());
            accountManager.currentUser.locationSettings.travelRadius = parseFloat($("#txtTravelRadius").val());
            accountManager.saveLocation();
        }
    });
    $("[data-role='save-std-ambition']").click(function () {
        let ambition = $("[data-role='input-std-ambition']").val();
        if (ambition !== null && ambition !== undefined && ambition.length >= ambitionMinLen) {
            accountManager.saveAmbition(ambition);
        }
    });
}

likeObj = function (objId, objType, like, success, err) {
    let caller = new AjaxCaller(function (response, text) {
        if (success !== null) {
            success(response, text);
        }
    }, function (request, status, error) {
        if (err !== null) {
            err(request, status, error);
        }
    });
    let req = likeObjReq(objId, objType, like);
    caller.postWithPromise(req);
};

requestFriend = function (objId, state, success, err) {
    let caller = new AjaxCaller(function (response, text) {
        if (success !== null) {
            success(response, text);
        }
    }, function (request, status, error) {
        if (err !== null) {
            err(request, status, error);
        }
    });
    let req = friendReq(objId);
    caller.postWithPromise(req);
};