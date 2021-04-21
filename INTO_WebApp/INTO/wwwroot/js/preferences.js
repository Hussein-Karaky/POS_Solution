var checkedOlRad = null;
var preferences = null;
$(document).ready(function () {
    document.querySelectorAll("input[min][max]").forEach(input => {
        input.addEventListener('blur', (event) => {
            if (input.value < parseInt(input.getAttribute("min"))) {
                input.value = parseInt(input.getAttribute("min"));
            }
            if (input.value > parseInt(input.getAttribute("max"))) {
                input.value = parseInt(input.getAttribute("max"));
            }
        });
    });
    fetchPreferences();
    $("[data-role='btn-next']").click(function (e) {
        if (validateStep()) {
            let query = ["user=" + accountManager.currentUser.userId, "tutor=" + accountManager.currentUser.id, "firstName=" + accountManager.currentUser.firstName, "lastName=" + accountManager.currentUser.lastName];
            let checkedTeacRad = document.querySelector('input[name="isTeacher"]:checked');
            let isTeacher = checkedTeacRad !== null && checkedTeacRad.value === "true";
            query.push("alreadyTeacher=" + isTeacher);
            let schoolName = "";
            let hasCert = false;
            let tutExp = 0;
            if (isTeacher) {
                let txtSchoolName = document.getElementById("txtSchoolName");
                schoolName = txtSchoolName.value;
                if (schoolName === null || schoolName === undefined || schoolName.length === 0) {
                    txtSchoolName.focus();
                    txtSchoolName.classList.add("glow-error");
                    showElementInPage("#txtSchoolName");
                    setTimeout(function () {
                        txtSchoolName.classList.remove("glow-error");
                    }, 3000);
                    e.preventDefault();
                    return false;
                }
                let checkedCertRad = document.querySelector('input[name="hasCert"]:checked');
                hasCert = checkedCertRad !== null && checkedCertRad.value === "true";
                let txtTutorExp = document.getElementById("txtTutorExp");
                tutExp = txtTutorExp.value;
                if (tutExp === null || tutExp === undefined || tutExp.length === 0) {
                    txtTutorExp.focus();
                    txtTutorExp.classList.add("glow-error");
                    showElementInPage("#txtTutorExp");
                    setTimeout(function () { txtTutorExp.classList.remove("glow-error"); }, 3000);
                    e.preventDefault();
                    return false;
                }
            }
            query.push("school=" + schoolName);
            query.push("hasCert=" + hasCert);
            query.push("yearsOfExperience=" + tutExp);

            let chkTutTypes = document.querySelectorAll('input[name="chkTutTypes"]:checked');
            let tutTypes = [];
            chkTutTypes.forEach(chk => tutTypes.push(chk.getAttribute("data-id")));
            query.push("typeOfStudents=" + tutTypes.join(","));

            let chkLsnTypes = document.querySelectorAll('input[name="chkLsnTypes"]:checked');
            let lsnTypes = [];
            chkLsnTypes.forEach(chk => lsnTypes.push(chk.getAttribute("data-id")));
            query.push("lessonTypes=" + lsnTypes.join(","));

            let chkRewdPts = document.querySelectorAll('input[name="chkRewdPts"]:checked');
            let rewdPts = [];
            chkRewdPts.forEach(chk => rewdPts.push(chk.getAttribute("data-id")));
            query.push("rewardings=" + rewdPts.join(","));

            let checkedCarRad = document.querySelector('input[name="hasCar"]:checked');
            let hasCar = checkedCarRad !== null && checkedCarRad.value === "true";
            query.push("hasCar=" + hasCar);

            checkedOlRad = document.querySelector('input[name="onlineInterest"]:checked');
            let onlineInterest = checkedOlRad !== null && checkedOlRad.value === "true";
            query.push("onlineTutoringInterest=" + onlineInterest);

            let hoursOutSys = document.getElementById("txtHrsOutside").value;
            query.push("hrsOutsideINTO=" + hoursOutSys);
            query.push("lang=" + language);
            query.push("step=" + stepId);
            query.push("entityType=" + accountManager.currentUser.entityType);

            window.location.href = window.location.origin.concat("/tutor/preferences?").concat(query.join("&"));
        }
    });
});
validateStep = function () {
    return true;//checkedOlRad !== null;
};
function isNumber(evt, element) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (
        (charCode !== 45 || $(element).val().indexOf('-') !== -1) &&      // “-” CHECK MINUS, AND ONLY ONE.
        //(charCode !== 46 || $(element).val().indexOf('.') !== -1) &&      // “.” CHECK DOT, AND ONLY ONE.
        (charCode !== 44 || $(element).val().indexOf(',') !== -1) &&      // "," ChECK COMMA
        (charCode < 48 || charCode > 57))
        return false;
    return true;
};
function isNumber2(evt, element) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (
        (charCode !== 45 || $(element).val().indexOf('-') !== -1) &&      // “-” CHECK MINUS, AND ONLY ONE.
        (charCode !== 46 || $(element).val().indexOf('.') !== -1) &&      // “.” CHECK DOT, AND ONLY ONE.
        (charCode !== 44 || $(element).val().indexOf(',') !== -1) &&      // "," ChECK COMMA
        (charCode < 48 || charCode > 57))
        return false;
    return true;
};
fetchPreferences = function () {
    let caller = new AjaxCaller(function (data, text) {
        if (data.length === 0) {
            swalInit.fire({
                text: "Please fill in your preferences!",
                type: 'warning',
                toast: true,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                position: 'bottom-right'
            });
        } else {
            preferences = data;
            displayPreferences();
        }
    }, function (request, status, error) {
        console.error(request.responseText);
    });
    caller.postWithPromise(tutorPrefReq());
};
displayPreferences = function () {
    if (preferences !== null && preferences.length === 1) {
        let chkIsTeacher = document.querySelector(`input[name=isTeacher][value=${preferences[0].isTeacher}]`);
        if (chkIsTeacher !== null) {
            chkIsTeacher.checked = true;
            chkIsTeacher.trigger("change");
        }
        document.querySelectorAll("[data-role=input-school-name]").forEach(input => {
            input.value = preferences[0].teachingInstitute;
            input.trigger("change");
        });
        let chkHasCert = document.querySelector(`input[name=hasCert][value=${preferences[0].hasCertification}]`);
        if (chkHasCert !== null) {
            chkHasCert.checked = true;
            chkHasCert.trigger("change");
        }
        document.querySelectorAll("[data-role=input-tutoring-exp]").forEach(input => {
            input.value = preferences[0].yearsOfExperience;
            input.trigger("change");
        });
        let tutTypes = preferences[0].tutoringTypes.replace(" ", "").split(",");
        document.querySelectorAll("[data-role=tutoring-types]").forEach(input => {
            input.checked = tutTypes.indexOf(input.getAttribute("data-id")) >= 0;
            input.trigger("change");
        });
        let lsnTypes = preferences[0].lessonTypes.replace(" ", "").split(",");
        document.querySelectorAll("[data-role=lesson-types]").forEach(input => {
            input.checked = lsnTypes.indexOf(input.getAttribute("data-id")) >= 0;
            input.trigger("change");
        });
        let rwdPtsTypes = preferences[0].rewardingPoints.replace(" ", "").split(",");
        document.querySelectorAll("[data-role=rewarding-points]").forEach(input => {
            input.checked = rwdPtsTypes.indexOf(input.getAttribute("data-id")) >= 0;
            input.trigger("change");
        });
        let chkHasCar = document.querySelector(`input[name=hasCar][value=${preferences[0].hasCar}]`);
        if (chkHasCar !== null) {
            chkHasCar.checked = true;
            chkHasCar.trigger("change");
        }
        let chkIsInterested = document.querySelector(`input[name=onlineInterest][value=${preferences[0].isInterested}]`);
        if (chkIsInterested !== null) {
            chkIsInterested.checked = true;
            chkIsInterested.trigger("change");
        }
        document.querySelectorAll("[data-role=input-tutoring-outside]").forEach(input => {
            input.value = preferences[0].outsideTutoringWeekHrs;
            input.trigger("change");
        });
    }
};