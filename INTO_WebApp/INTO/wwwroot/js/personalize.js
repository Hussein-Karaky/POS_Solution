$("[data-role='btn-next']").click(function (e) {
    if (validateStep()) {
        new AjaxCaller(function (data, text) {
            new AjaxCaller(function (data, text) {
                if (data !== null && String.isString(data.uiName) && data.uiName.length > 0) {
                    window.location.href = window.location.origin.concat("/tutor/").concat(data.uiName);
                }
            }, function (request, status, error) {
                console.error(request.responseText);
            }).postWithPromise(nextTutorStep());
        }, function (request, status, error) {
            console.error(request.responseText);
        }).postWithPromise(completeTutorStep());
    }
});

validateStep = function () {
    return accountManager.profilePicture !== null &&
        accountManager.profilePicture.length > 22 &&
        accountManager.currentUser.title !== null &&
        accountManager.currentUser.title.length > 0 &&
        accountManager.currentUser.freeResponse !== null &&
        accountManager.currentUser.freeResponse.length > 0;
};
