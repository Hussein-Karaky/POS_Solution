var ddlGen;
var eduForm;
var selectedBackCheckFiles = [];
loadDegrees = function () {
    let caller = new AjaxCaller(function (data, text) {
        tutorDegrees = data;
        eduForm = new EducationForm("eduInput"
            , window.location.origin.concat("/tutor/GetEducation/").concat(accountManager.currentUser.id).concat("/").concat(language));
        eduForm.dataBind(function (data, text) {
            accountManager.currentUser.education = data;
        });
        setTimeout(function () { eduForm.finalize(); }, 400);
    }, function (request, status, error) {
        console.error(request.responseText);
    });
    caller.postWithPromise(tutorDegreesRequest());
};

$(document).ready(function () {

    document.querySelectorAll("select").forEach(s => {
        new Select(s, {
            filtered: 'auto',
            filter_threshold: 8,
            filter_placeholder: ''
        });
    });
    loadDegrees();

    ddlGen = new RichSelect("persInfoGender", genderList.data, "lookupDetailsId", "lookupDetailsDescription", "Select gender");
    ddlGen.dataBind();
    ddlGen.finalize();

    $("[data-role='save-basic-info']").click(function () {
        accountManager.saveBasicInfo(txtDoB.value, ddlGen.value);
    });

    $("[data-role='save-tutor-edu']").click(function () {
        eduForm.save(
            function (data, text) {
                greet("Education info successfully updated!");
            },
            function (request, status, error) {
                err("Education info could not be updated!");
            }
        );
    });

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
    let fileInput = document.querySelectorAll("[type=file][data-role=file-upload]");
    fileInput.forEach(input => {
        let btnUpload = document.querySelector(`[data-role=${input.getAttribute("data-rel")}]`);
        btnUpload.style.visibility = input.files.length > 0 ? "visible" : "hidden";
        input.addEventListener("change", function (e) {
            let btnUpload = document.querySelector(`[data-role=${input.getAttribute("data-rel")}]`);
            if (btnUpload !== null) {
                btnUpload.style.visibility = input.files.length > 0 ? "visible" : "hidden";
            }
        });
    });
    let frmFiles = document.getElementById("frmFiles");
    frmFiles.addEventListener("submit", function (event) {
        event.preventDefault();
        const promise = new Promise((resolve, reject) => {
            let frmError = function (request, status, error) {
                reject(request.responseText);
            };
            let frmSuccess = function (data, text) {
                resolve(data);
            };
            $.ajax({
                url: this.getAttribute("action"),
                type: this.getAttribute("method"),
                dataType: "JSON",
                data: new FormData(this),
                processData: false,
                contentType: false,
                success: frmSuccess,
                error: frmError
            });
        }).then((data) => {
            bgCheckGrid.dataBind();
            greet("File(s) uploaded");
            document.querySelector("[data-role=file-upload][data-rel=save-tutor-bgcheck]").value = "";
            document.querySelector("[data-role=file-upload][data-rel=save-tutor-bgcheck]").trigger("change");

        }).catch((message) => {
            console.log(message);
        });
    });

    $('input[data-role=file-upload]').change(function (e) {
        //$(this).parents('.giz-upload').find('.element-to-paste-filename').text(e.target.files[0].name);
        e.target.files.forEach(file => {
            selectedBackCheckFiles.push(file.name);
        });
    });
    ddlGen.setValue(accountManager.currentUser.gender ? 100174 : 100173);
    if (accountManager.currentUser.dob !== null) {
        $("#txtDoB").val(moment(accountManager.currentUser.dob).format('YYYY-MM-DD'));
        $("#txtDoB").trigger("change");
    }
    $("[data-role='input-tutor-privacy-radius']").val(accountManager.currentUser.locationSettings.privacyRadius).trigger("change");
    $("[data-role='input-tutor-travel-radius']").val(accountManager.currentUser.locationSettings.travelRadius).trigger("change");
    $("[data-value='".concat(accountManager.currentUser.locationSettings.country.id).concat("']")).click();
    bgCheckGrid = new DataGrid(
        "uploadedBgFiles",
        window.location.origin.concat("/files/"),
        { userId: accountManager.currentUser.userId, sourceType: 100178, lang: language },
        {
            gridCss: ["table", "table-striped", "border-separate", "round-corner-4"],
            headerCss: ["white", "blue-text", "cursor-pointer"],
            columnCss: ["btn-outline"],
            rowCss: ["btn-info", "cursor-pointer"],
            alternatingCss: ["cursor-pointer", "btn-info", "light-blue", "lighten-5", "blue-text"],
            hideColumns: true,
            align: "center",
            cellspacing: 0,
            rowFunctions: [{
                name: "Delete", function: function (e, data) {
                    assure("Are you sure?", "You won't be able to revert this!").then((result) => {
                        if (result.value !== undefined && result.value === true) {
                            let fileId = data.id;
                            let caller = new AjaxCaller(function (response, text) {
                                if (response.data.length > 0 && response.data.where("id", fileId).length > 0) {
                                    err("File(s) could not be deleted!");
                                } else {
                                    greet("File deleted!");
                                }
                                bgCheckGrid.dataBind();
                                accountManager.setBgCheckSubmitted(response.data.length > 0);
                            }, function (request, status, error) {
                                console.error(request.responseText);
                            });
                            let delReq = deleteFileRequest(data.id, data.sourceType, data.userId);
                            caller.postWithPromise(delReq);
                        }
                    });
                }
            }]
        },
        "filesUI", undefined, undefined, undefined, undefined,
        function (e, sender) {
            console.log("show bgCheck file...");
        });
    bgCheckGrid.addEventListener("dataBound", function (data) {
        accountManager.setBgCheckSubmitted(data.details.detail.data.data.length > 0);
    });
    bgCheckGrid.dataBind();

});

validateStep = function () {
    return accountManager.currentUser.dob !== null &&
        accountManager.currentUser.dob.length > 0 &&
        accountManager.currentUser.bgCheckSubmitted === true &&
        accountManager.currentUser.education.length > 0 &&
        accountManager.currentUser.locationSettings.country !== null &&
        accountManager.currentUser.locationSettings.country.id > 0 &&
        accountManager.currentUser.locationSettings.location !== null &&
        accountManager.currentUser.locationSettings.location.latitude > 0 &&
        accountManager.currentUser.locationSettings.location.longitude > 0;
};

