$(document).ready(function () {
    let LFN = $('#txtLegalFN');
    let LLN = $('#txtLegalLN');
    $("[data-role='btn-next']").click(function () {
        if ($('#chkAgree').is(":checked")) {
            if (LFN.val() === '' || LLN.val() === '') {
                swal("Missing Field!", "Please fill both Legal First name and Last name textbox !!", {
                    icon: "error",
                    buttons: {
                        confirm: {
                            className: 'btn btn-danger'
                        }
                    },
                });
            }
            else {
                new AjaxCaller(function (data, text) {
                    if (data !== null && String.isString(data.uiName) && data.uiName.length > 0) {
                        if (data.uiName !== "EmailConfirmation") {
                            window.location.href = window.location.origin.concat("/tutor/").concat(data.uiName);
                        }
                    }
                }, function (request, status, error) {
                    console.error(request.responseText);
                }).postWithPromise(nextTutorStep());
                $.ajax({
                    url: window.location.origin.concat("/Tutor/SaveAgreement"),
                    type: 'post',
                    dataType: 'json',
                    data: {
                        UId: accountManager.currentUser.userId, ObjEntityId: 1, RegistrationStepId: stepId, StepStatus: 1, LegalFN: LFN.val(), LegalLN: LLN.val()
                    },
                    success: function (data) {
                        greet("Agreement has been saved successfully!");
                        new AjaxCaller(function (data, text) {
                            new AjaxCaller(function (data, text) {
                                if (data !== null && String.isString(data.uiName) && data.uiName.length > 0) {
                                    window.location.href = window.location.origin.concat("/tutor/").concat(data.uiName).concat("/").concat(accountManager.currentUser.userId).concat("/1/").concat(stepId).concat("/").concat(language);
                                }
                            }, function (request, status, error) {
                                console.error(request.responseText);
                            }).postWithPromise(nextTutorStep());
                        }, function (request, status, error) {
                            console.error(request.responseText);
                        }).postWithPromise(completeTutorStep());
                    },
                    error: function () {
                        alert('error');
                    }
                });
            }
        }
        else {
            swal("Missing Info!", "Please check the agreement before proceeding", {
                icon: "error",
                buttons: {
                    confirm: {
                        className: 'btn btn-danger'
                    }
                },
            });
        }
    });
    //LFN.keydown(function () {
    //    $(this).css({ "background-color": "white" });
    //});
    //LLN.keydown(function () {
    //    $(this).css({ "background-color": "white" });
    //});
});
