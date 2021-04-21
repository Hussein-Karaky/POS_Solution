var materialsGrid = null;
var resumesGrid = null;
var progressBar = null;
$(document).ready(function () {
    materialsGrid = new DataGrid(
        "subjects-md",
        window.location.origin.concat("/tutor/MaterialsSvc/").concat(accountManager.currentUser.id).concat("/").concat(language),
        null,
        {
            uniqueKey: "sysId",
            gridCss: ["table", "table-striped", "border-separate", "round-corner-4"],
            headerCss: ["white", "blue-text", "cursor-pointer"],
            columnCss: ["btn-outline"],
            rowCss: ["btn-info", "cursor-pointer"],
            alternatingCss: ["cursor-pointer", "btn-info", "light-blue", "lighten-5", "blue-text"],
            hideColumns: false,
            align: "center",
            cellspacing: 0,
            rowFunctions: [{
                name: "Delete", function: function (e, data) {
                    console.log("deleting " + data);
                }
            }]
        },
        "materialsUI", undefined, undefined, undefined, undefined,
        function (e, sender) {
            $("#mdlEditMaterial .modal-body").empty();
            $("#mdlEditMaterial").modal("show", sender);
        });
    materialsGrid.dataBind();
    resumesGrid = new DataGrid(
        "uploadedResumes",
        window.location.origin.concat("/files/"),
        { userId: accountManager.currentUser.userId, sourceType: 100179, lang: language },
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
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete it!'
                    }).then((result) => {
                        if (result.value !== undefined && result.value === true) {
                            let caller = new AjaxCaller(function (response, text) {
                                if (response.data.length > 0 && response.data.where("id", fileId).length > 0) {
                                    swalInit.fire({
                                        text: "File(s) could not be deleted!",
                                        type: 'error',
                                        toast: true,
                                        showConfirmButton: true,
                                        position: 'top-right'
                                    });
                                } else {
                                    swalInit.fire({
                                        text: "File deleted!",
                                        type: 'success',
                                        toast: true,
                                        timer: 2000,
                                        timerProgressBar: true,
                                        showConfirmButton: false,
                                        position: 'top-right'
                                    });
                                }
                                resumesGrid.dataBind();
                                accountManager.setCVSubmitted(response.data.length > 0);
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
            console.log("show resume file...");
        });
    resumesGrid.addEventListener("dataBound", function (data) {
        accountManager.setCVSubmitted(data.details.detail.data.data.length > 0);
        if (data.details.detail.data.data.length === 0) {
            warn("You are invisible to schools, please upload your resume!");
        }
        document.getElementById("resumeUploader").style.display = data.details.detail.data.data.length > 0 ? "none" : "block";
    });
    resumesGrid.dataBind();
    $("#mdlEditMaterial").on("show.bs.modal", function (e) {
        this.data = e.relatedTarget.getData();//$(e.relatedTarget).data();
        let modal = this;
        let data = {
            data: [
                { property: "approved", value: this.data.approved, description: "Approval is a requirement prior to tutoring a material." },
                { property: "active", value: this.data.active, description: "Once you disactivate a material it wont be visible among your public info." },
                { property: "status", value: this.data.approved && this.data.active, description: this.data.approved ? "OK" : "Test Not Taken Yet" }]
        };
        let matGrid = new DataGrid("editMatBody", data, null,
            {
                gridCss: ["table", "table-striped"],
                headerCss: [""],
                columnCss: [""],
                rowCss: ["white"],
                alternatingCss: ["light-blue", "lighten-5", "blue-text"],
                hideColumns: true
            }, "materialPropsUI");
        matGrid.dataBind();
        $(this).find(".modal-title").html(this.data.subject.name.concat("/").concat(modal.data.name));
        let caller = new AjaxCaller(function (response, text) {
            if (response.length > 0) {
                modal.data.pricing = response;
                modal.data.pricing.forEach(pricing => {
                    let pricingInput = document.querySelector(`[data-rel=lesson-type][data-id="${pricing.lessonType}"]`);
                    if (pricingInput !== null) {
                        pricingInput.val(pricing.price);
                        pricingInput.trigger("change");
                    }
                });
            } else {
                modal.data.pricing = [];
            }
        }, function (request, status, error) {
            console.error(request.responseText);
        });
        let ratesRq = tutorRatesReq(modal.data.sysId);
        caller.postWithPromise(ratesRq);

        let btnSaveMaterial = document.querySelector("[data-role=save-material]");
        btnSaveMaterial.addEventListener("click", function (e) {
            let caller = new AjaxCaller(function (response, text) {
                if (response > 0) {
                    greet("Material Updated!", 3000, true);
                    if (materialsGrid !== null && materialsGrid !== undefined) {
                        materialsGrid.dataBind();
                    }
                    let mdl = $("#mdlEditMaterial");
                    if (mdl !== null && mdl !== undefined) {
                        mdl.modal("hide");
                    }
                } else {
                    err("Material could not be updated!");
                }
            }, function (request, status, error) {
                err("Material could not be updated!");
                console.error(request.responseText);
            });
            let iptActive = document.querySelector("#mdlEditMaterial [data-role=active]");
            let iptCurrency = document.getElementById("ddlCur");
            let modal = document.getElementById("mdlEditMaterial");
            if (iptActive !== null && iptCurrency !== null) {
                modal.data.pricing = [];
                modal.data.active = iptActive.checked;
                let pricingInputs = document.querySelectorAll("[data-rel=lesson-type]");
                if (pricingInputs !== null) {
                    pricingInputs.forEach(input => {
                        modal.data.pricing.push({ tutorId: accountManager.currentUser.id, materialId: modal.data.sysId, lessonType: parseInt(input.getAttribute("data-id")), price: parseFloat(input.value), currency: parseInt(iptCurrency.value) });
                    });
                }
                let matUpd = tutorMaterialUpdateReq(JSON.stringify(modal.data));
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.preventDefault();
                caller.postWithPromise(matUpd);
            }
        });
    });
    let saveCancelNotice = document.querySelector("[data-role=save-tutor-payment-infos]");
    let cancelNotice = document.querySelector("[data-role=cancel-pay]");
    saveCancelNotice.addEventListener("click", function (e) {
        let req = cancelNoticeReq(parseInt(cancelNotice.value));
        let caller = new AjaxCaller(function (response, text) {
                greet("Cancel notice updated!", 3000, true);
        }, function (request, status, error) {
                err("Cancel notice could not be updated!");
            console.error(request.responseText);
        });
        caller.postWithPromise(req);
    });
    $("#mdlEditMaterial").on("hide.bs.modal", function (e) {
        let editMatBody = document.getElementById("editMatBody");
        editMatBody.innerHTML = "";
        let pricingInputs = document.querySelectorAll("[data-rel=lesson-type]");
        if (pricingInputs !== null) {
            pricingInputs.forEach(input => {
                input.val(null);
            });
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
            resumesGrid.dataBind();
            greet("File uploaded successfully!");
        }).catch((message) => {
            console.log(message);
        });
    });

    progressBar = new ProgressBar(0);
    progressBar.create("avatarSpace");
    if (accountManager !== null && accountManager.currentUser !== null) {
        window.setTimeout(function () {
            progressBar.setValue(accountManager.currentUser.potential);
        }, 1000);
    }
    var mySelect = new Select('#ddlCountries', {
        // auto show the live filter
        filtered: 'auto',
        // auto show the live filter when the options >= 8
        filter_threshold: 8,
        // custom placeholder
        filter_placeholder: 'Select your country'
    });
    var privacySelect = new Select('#ddlPrivacyRadius', {
        filtered: 'auto',
        filter_threshold: 8,
        filter_placeholder: 'Select your privacy radius'
    });
    var curSelect = new Select('#ddlCur', {
        filtered: 'auto',
        filter_threshold: 8,
        filter_placeholder: null
    });
    $("[data-role='cancel-pay']").val(accountManager.currentUser.cancellationNotice).trigger("change");
    $("[data-role='input-tutor-privacy-radius']").val(accountManager.currentUser.locationSettings.privacyRadius).trigger("change");
    $("[data-role='input-tutor-travel-radius']").val(accountManager.currentUser.locationSettings.travelRadius).trigger("change");
    $("[data-value='".concat(accountManager.currentUser.locationSettings.country.id).concat("']")).click();
});