var checkedMats = [];
var myMaterials = new DataList(window.location.origin.concat("/tutor/MaterialsSvc/").concat(accountManager.currentUser.id).concat("/").concat(language));
$(document).ready(function () {
    var hiddenDiv = $('#DivCurriculum');
    var hiddenSave = $('#HiddenSAve');
    var selectedlanguage;
    var CheckedSubjectsMaterialsId = $('#CheckedSubjectsMaterialsId').empty();
    var CheckedMaterials = $('#CheckedMaterials').empty();
    myMaterials.dataBind();

    var CurriculumId;
    var CycleId;
    var ClassId = null;
    var SubjectMaterialsId = null;
    var InstituteTypeId;
    var tblInstituteType = $('#ddlInstituteType');
    var tblCurriculum = $('#ddlCurriculums');
    var tblCycle = $('#ddlCycle');
    var accordion = $('#accordion');
    new Select("#ddlLanguages", {
        filtered: 'auto',
        filter_threshold: 8,
        filter_placeholder: null
    });
    selectedlanguage = $('#ddlLanguages').children("option:selected").val();
    selectedCurriculums = $('#ddlCurriculums').children("option:selected").val();
    selectedInstituteType = $('#ddlInstituteType').children("option:selected").val();
    selectedCycle = $('#ddlCycle').children("option:selected").val();
    $("[data-role='btn-next']").click(function (e) {
        if (validateStep()) {
            new AjaxCaller(function (data, text) {
                if (data === true) {
                    new AjaxCaller(function (data, text) {
                        if (data !== null && String.isString(data.uiName) && data.uiName.length > 0) {
                            window.location.href = window.location.origin.concat("/tutor/").concat(data.uiName);
                        }
                    }, function (request, status, error) {
                        console.error(request.responseText);
                    }).postWithPromise(nextTutorStep());
                }
            }, function (request, status, error) {
                console.error(request.responseText);
            }).postWithPromise(completeTutorStep());
        }
    });
    CheckedSubjectsMaterialsId.empty();
    CheckedMaterials.empty();
    $('#accordion').empty();
    tblInstituteType.empty();
    $.ajax({
        url: window.location.origin.concat("/Tutor/GetInstituteTypeByLanguageId"),
        type: 'post',
        dataType: 'json',
        data: { Id: selectedlanguage },
        success: function (data) {
            $(data).each(function (index, ins) {
                tblInstituteType.append('<option value=' + ins.id + '>' + ins.name + '</option>');
            });
            new Select("#ddlInstituteType", {
                filtered: 'auto',
                filter_threshold: 8,
                filter_placeholder: null
            });
        },
        error: function () {
            alert('error');
        }
    });
    $.ajax({
        url: window.location.origin.concat("/Tutor/GetCurriculumByLanguageId"),
        type: 'post',
        dataType: 'json',
        data: { Id: selectedlanguage },
        success: function (data) {
            $(data).each(function (index, cur) {
                tblCurriculum.append('<option value=' + cur.id + '>' + cur.name + '</option>')
            });
            new Select("#ddlCurriculums", {
                filtered: 'auto',
                filter_threshold: 8,
                filter_placeholder: null
            });
            hiddenDiv.show();
        },
        error: function () {
            alert('error');
        }
    });
    $.ajax({
        url: window.location.origin.concat("/Tutor/GetCycleByLanguageId"),
        type: 'post',
        dataType: 'json',
        data: { Id: selectedlanguage },
        success: function (data) {
            $(data).each(function (index, cyc) {
                tblCycle.append('<option value=' + cyc.id + '>' + cyc.name + '</option>')
            });
            new Select("#ddlCycle", {
                filtered: 'auto',
                filter_threshold: 8,
                filter_placeholder: null
            });
            hiddenDiv.show();
        },
        error: function () {
            alert('error');
        }
    });
    $("#ddlLanguages").change(function () {
        selectedlanguage = $(this).children("option:selected").val();
        CheckedSubjectsMaterialsId.empty();
        CheckedMaterials.empty();
        $('#accordion').empty();
        tblInstituteType.empty();
        tblCurriculum.empty();
        tblCycle.empty();
        $.ajax({
            url: window.location.origin.concat("/Tutor/GetInstituteTypeByLanguageId"),
            type: 'post',
            dataType: 'json',
            data: { Id: selectedlanguage },
            success: function (data) {
                $(data).each(function (index, ins) {
                    tblInstituteType.append('<option value=' + ins.id + '>' + ins.name + '</option>')
                });
            },
            error: function () {
                alert('error');
            }
        });
        $.ajax({
            url: window.location.origin.concat("/Tutor/GetCurriculumByLanguageId"),
            type: 'post',
            dataType: 'json',
            data: { Id: selectedlanguage },
            success: function (data) {
                $(data).each(function (index, cur) {
                    tblCurriculum.append('<option value=' + cur.id + '>' + cur.description + '</option>')
                });
                hiddenDiv.show();
            },
            error: function () {
                alert('error');
            }
        });
        $.ajax({
            url: window.location.origin.concat("/Tutor/GetCycleByLanguageId"),
            type: 'post',
            dataType: 'json',
            data: { Id: selectedlanguage },
            success: function (data) {
                $(data).each(function (index, cyc) {
                    tblCycle.append('<option value=' + cyc.id + '>' + cyc.description + '</option>')
                });
                hiddenDiv.show();
                tblCycle.trigger("change");
            },
            error: function () {
                alert('error');
            }
        });
    });
    getSubjectById = function (id, data) {
        var subj = { id: 0, name: "unknown" };
        $(data).each(function (index, sm) { if (sm.id === id) { subj = { id: sm.id, name: sm.name }; return false; } });
        return subj;
    };

    getMatsBySubjId = function (id, data) {
        var mats = [];
        $(data).each(function (index, sm) { if (sm.id === id) { mats.push({ sysId: sm.materials[0].sysId, id: sm.materials[0].id, name: sm.materials[0].name }); } });
        return mats;
    };
    $('#ddlInstituteType').change(function () {
        tblCycle.trigger("change");
    });
    $("#ddlCycle").change(function () {
        CheckedSubjectsMaterialsId.empty();
        CheckedMaterials.empty();
        $('#accordion').empty();
        hiddenSave.hide();
        InstituteTypeId = $("#ddlInstituteType").children("option:selected").val();
        CurriculumId = $("#ddlCurriculums").children("option:selected").val();
        CycleId = $(this).children("option:selected").val();
        selectedlanguage = $('#ddlLanguages').children("option:selected").val();
        InstituteTypeId = $('#ddlInstituteType').children("option:selected").val();
        $.ajax({
            url: window.location.origin.concat("/Tutor/GetSubjectsMaterials"),
            type: 'post',
            dataType: 'json',
            data: { instiType: InstituteTypeId, cycleId: CycleId, lang: selectedlanguage },
            success: function (data) {
                var tblSubjectsMaterials = $('#tblSubjectsMaterials tbody');
                tblSubjectsMaterials.empty();
                let sbjcts = [];
                $(data).each(function (index, sm) {
                    if (sbjcts.indexOf(sm.id) === -1) {
                        sbjcts.push(sm.id);
                    }
                });
                $(sbjcts).each(function (index, sm) {
                    let subj = getSubjectById(sm, data);
                    subj.mats = getMatsBySubjId(sm, data);
                    let materials = "<div id=\"panelBodyOne" + subj.id + "\" class=\"panel-collapse collapse in lang-dependant\">" +
                        "<div class=\"panel-body\">";
                    $(subj.mats).each(function (index, sm) {
                        materials = materials.concat("<div style=\"display: inline-block; margin:2px 14px;\"><input id=\"" + subj.id + "_" + sm.id + "\" data-id=\"" + sm.sysId + "\" data-index=\"-1\" type=\"checkbox\" data-role=\"add-rem-mat\" name=\"" + sm.name + "\" value=\"" + sm.name + "\" class=\"option-input btn-outline square-24\" /><label class=\"cursor-pointer\" for=\"" + subj.id + "_" + sm.id + "\">" + sm.name + "</label></div>");
                    });

                    materials.concat("</div></div>");
                    accordion.append(
                        "<div class=\"panel panel-primary\">"
                        + "<div class= \"panel-heading\" >"
                        + "<h4 id=" + subj.id + " class=\"panel-title\">"
                        + "    <a class=\"bigtitle border-bottom waves-effect waves-dark match-parent no-shadow mt-3\" href=\"#panelBodyOne" + subj.id + "\" data-toggle=\"collapse\" data-parent=\"#accordion\">"
                        + subj.name
                        + "    </a>"
                        + "</h4>"
                        + "</div>"
                        + materials
                        + "</div>");
                });
                assignAction();
                hiddenSave.show(400);
                compareValues();
            },
            error: function () {
                alert('error');
            }
        });
    });
    $('.CurrBadge').click(function () {
        $(this).addClass('bg-primary');
    });
    let SubjectsMaterials = [];
    $('#btnSave').click(function () {

        $.each(checkedMats, function (index, value) {
            var x = (checkedMats[index]).id.split("_");
            let newItem = {
                TutorId: accountManager.currentUser.id,
                LanguageId: selectedlanguage,
                InstituteTypeId: InstituteTypeId,
                CurriculumId: CurriculumId,
                CycleId: CycleId,
                SubjectId: x[0],
                MaterialId: x[1],
                ClassId: ClassId,
                SubjectMaterialId: value.sysId
            };
            SubjectsMaterials.push(newItem);
        });
        if (SubjectsMaterials !== null && SubjectsMaterials.length > 0) {

            $.ajax({
                url: window.location.origin.concat("/Tutor/SaveTutorSubjectsMaterials"),
                type: 'post',
                dataType: 'json',
                data: { Sub: JSON.stringify(SubjectsMaterials), lang: language },
                success: function (data) {
                    if (myMaterials !== null && myMaterials.data !== null) {
                        myMaterials.data.data = data;
                    }
                    if (window["materialsGrid"] !== null && window["materialsGrid"] !== undefined) {
                        materialsGrid.dataBind();
                    }
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: "Materials has been saved Successfully!",
                        showConfirmButton: false,
                        timer: 1500
                    }).then((value) => {
                        console.log("Materials has been saved Successfully!");
                    });
                },
                error: function () {
                    alert('error');
                }
            });

        }
        else {
            Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: "Please choose one Subject at least!",
                showConfirmButton: true,
                buttons: {
                    confirm: {
                        className: 'btn btn-warning'
                    }
                },
            });
        }
    });
    $("#ddlCycle").trigger("change");
});

$(document).on("click", "i.icon-close", function () {
    let realId = ($(this).attr("id").replace("i_", ""));
    let checkboxTocheck = $('input[data-role=add-rem-mat][id=' + realId + ']')
    removeMaterial(checkboxTocheck);
    checkboxTocheck.prop("checked", false);
    $('span[id=' + "spn_" + realId + ']').remove();
});

function populate() {

};
compareValues = function () {
    let chBxs = document.querySelectorAll('[data-role="add-rem-mat"]');
    if (chBxs !== null && chBxs !== undefined && chBxs.length > 0 && myMaterials !== null && myMaterials.data !== null && myMaterials.data.data.length > 0) {
        chBxs.forEach(c => {
            myMaterials.data.data.forEach(d => {
                if (parseInt(c.getAttribute("data-id")) === d.sysId) {
                    c.checked = true;
                    c.dispatchEvent(new Event("change"));
                }
            });
        });
    }
};
function assignAction() {
    $('input[data-role=add-rem-mat]').each(function (index) {

        $(this).on("change", function () {
            if (!$(this).is(':checked')) {
                let realId = ($(this).attr("id").replace("i_", ""));
                let checkboxTocheck = $('input[data-role=add-rem-mat][id=' + realId + ']')
                removeMaterial(checkboxTocheck);
                $('span[id=' + "spn_" + realId + ']').remove();
            }
            if ($(this).is(":checked")) {
                let chk = addMaterial({ index: -1, sysId: parseInt($(this).attr("data-id")), id: $(this).attr("id") });
                $(this).attr("data-index", chk.index);
                $('#CheckedMaterials').append(" <span id=\"spn_" + $(this).attr("id") + "\" data-id=\"" + $(this).attr("data-id") + "\" class=\"badge badge-pill btn-outline pr-2 pb-2 pl-2 mb-2\">" + $(this).attr("name") + "<i class=\"icon-close inline-block square-16 ml-2\" id=\"i_" + $(this).attr("id") + "\"></i>" + " </span >");
            }
        });
    });
};
function addMaterial(el) { el.index = checkedMats.length; checkedMats.push(el); return el; };
function removeMaterial(el) {

    let index = $(el).attr("data-index");
    if (index < checkedMats.length) {
        checkedMats.splice(index, 1);
    }
    $(el).attr("data-index", -1);
    $(checkedMats).each(function (index, item) {
        item.index = index;
        $("#" + item.id).attr("data-index", index);
    });
};
validateStep = function () {
    return myMaterials !== null && myMaterials.data !== null && myMaterials.data.data.length > 0;
};

