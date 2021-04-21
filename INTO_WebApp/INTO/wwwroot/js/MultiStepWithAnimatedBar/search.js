const prog_timer = ms => new Promise(res => setTimeout(res, ms))
var searchProgress = 0;
var loaderCircle = document.getElementById("loader-circle");

function SearchFilter(country = null, rdService = null, rdAcademicLevel = null, curriculum = null, classes = null,
    subjects = null, language = null, availability = null, rdStartingTime = null) {
    this.subject = subjects;//TODO: To rename to material
    this.tutoringService = rdService;
    //this.location = { altitude: 0, longitude: 0 };
    this.country = country;
    this.academicLevel = rdAcademicLevel;
    this.curriculum = curriculum;
    this.educationClass = classes;
    this.language = language;
    this.availability = availability;
    this.startingTime = rdStartingTime;
    this.minOnlineHourRate = null;
    this.maxOnlineHourRate = null;
    this.minInPersonHourRate = null;
    this.maxInPersonHourRate = null;
    this.minTutorAge = null;
    this.maxTutorAge = null;
    this.searchColumn = '';
    this.searchValue = '';
    this.pageNumber = 1;
    this.pageSize = 8;
    this.sortingColumn = 'Potential';
    this.sortingDirection = false;//DESC
};
SearchFilter.construct();
SearchFilter.prototype.setSubject = function (subject) {
    this.subject = subject;
};
var searchFilter = new SearchFilter();
var percent = 0;

setSearchFilter = function (strSf) {
    if (strSf !== null && strSf !== undefined) {
        searchFilter = JSON.parse(strSf);
    }
    if (searchFilter !== null) {
        let rangeCtls = document.querySelectorAll('[data-role="filter-range"]');
        rangeCtls.forEach(ctrl => {
            let slider = $(ctrl).slider('values', [window[ctrl.getAttribute("data-target")][ctrl.getAttribute("data-offset-bottom")], window[ctrl.getAttribute("data-target")][ctrl.getAttribute("data-offset-top")]]).change();
         });
    }
    updateResults();
};

dashedToCamel = function (str) {
    if (str === null || str === undefined || str.length === 0) {
        return "";
    }
    if (str.indexOf("-") !== -1) {
        let parts = str.split("-");
        if (parts.length === 1) {
            return parts[0];
        } else {
            let p0 = parts[0][0].toLocaleLowerCase() + parts[0].substring(1);;
            parts.shift();
            parts.forEach(function (p, index) { parts[index] = p[0].toLocaleUpperCase() + p.substring(1) });

            return p0.concat(parts.join(""));
        }
    }
    return str[0].toLocaleLowerCase() + str.substring(1);
};

function toQueryString(obj) {
    let qs = Object.keys(obj)
        .map(key => `${key}=${obj[key] instanceof Array ? JSON.stringify(obj[key]) : obj[key]}`)
        .join('&');
    return qs;
}

function LookupDetailsClass(id, lookupId, keyword, datatype, context, dateCreate, selectorType) {
    //Node.call(this, selectorType);
    this.id = id;
    this.lookupId = lookupId;
    this.keyword = keyword;
    this.datatype = datatype;
    this.context = context;
    this.dateCreate = dateCreate;
}


function validate1(val) {
    v1 = document.getElementById("txtCountry");
    flag1 = true;

    if (val >= 1 || val === 0) {
        if (v1.value === "") {
            v1.style.borderColor = "red";
            flag1 = false;
        }
        else {
            v1.style.borderColor = "green";
            flag1 = true;
        }
    }
    flag = flag1;
    return flag;
}

$(document).ready(function () {
    loaderCircle = document.getElementById("loader-circle");
    document.querySelectorAll("select").forEach(s => {
        new Select(s, {
            filtered: 'auto',
            filter_threshold: 8,
            filter_placeholder: 'Select a subject'
        });
    });

    let ddlSortingColumn = document.getElementById("ddlSortingColumn");
    if (ddlSortingColumn !== undefined && ddlSortingColumn !== null) {
        ddlSortingColumn.addEventListener("change", function (e) {
            searchFilter.SortingColumn = $(ddlSortingColumn).val();
        });
    }
    let ddlSortingDirection = document.getElementById("ddlSortingDirection");
    if (ddlSortingDirection !== undefined && ddlSortingDirection !== null) {
        ddlSortingDirection.addEventListener("change", function (e) {
            searchFilter.SortingDirection = $(ddlSortingDirection).val();
        });
    }

    $(function () {
        $(".result").slice(0, 2).show();
        $("[data-role='load-more']").on('click', function (e) {
            e.preventDefault();
            $(".result:hidden").slice(0, 2).slideDown();
            if ($(".result:hidden").length === 0) {
                $("[data-role='load-more']").fadeOut('slow');
            }
        });
    });

    var current_fs, next_fs, previous_fs;

    var steps = 10;//$(".card-body").length;
    var current = 1;
    setProgressBar(current);

    var availabilityGrid = new BriefAvailabilityUI("choice-user-availability", "briefAvailUI");
    availabilityGrid.dataBind();

    $(".next").click(function () {

        str0 = "next0";
        str1 = "next1";
        str2 = "next2";
        str3 = "next3";
        str4 = "next4";
        str5 = "next5";
        str6 = "next6";
        str7 = "next7";
        str8 = "next8";

        if (!str0.localeCompare($(this).attr('id')) && validate1(0) === true) {
            val0 = true;
            let map = document.getElementById("svgMapPopulation");
            map.style.display = "none";
        }
        else {
            val0 = false;
        }

        if ((!str0.localeCompare($(this).attr('id')) && val0 === true) || (!str1.localeCompare($(this).attr('id'))) || (!str2.localeCompare($(this).attr('id'))) || (!str3.localeCompare($(this).attr('id')))
            || (!str4.localeCompare($(this).attr('id'))) || (!str5.localeCompare($(this).attr('id'))) || (!str6.localeCompare($(this).attr('id'))) || (!str7.localeCompare($(this).attr('id')))
            || (!str8.localeCompare($(this).attr('id')))) {

            current_fs = $(this).parent().parent();
            next_fs = $(this).parent().parent().next();

            $(current_fs).removeClass("show");
            $(next_fs).addClass("show");

            let dataName = $(current_fs).attr("data-name");
            let rdService = null;
            let rdAcademicLevel = null;
            let curriculum = 0;
            let educationClass = null;
            let subjects = null;
            let language = 0;
            let availabilityChecked = null;
            let rdStartingTime = null;

            switch (dataName) {
                case "country":
                    var country = document.getElementById("txtCountry");
                    searchFilter.country = country.options[country.selectedIndex].value;
                    break;
                case "service":
                    try {
                        rdService = document.querySelector('input[name="tutorServiceRadio"]:checked').value;
                        searchFilter.tutoringService = rdService;
                    }
                    catch (_) { console.log("ser", searchFilter.tutoringService); }
                    break;
                case "academic-level":
                    try {
                        rdAcademicLevel = document.querySelector('input[name="userLevelRadio"]:checked').value;
                        searchFilter.academicLevel = rdAcademicLevel;
                    }
                    catch (_) { console.log("acad", searchFilter.academicLevel); }
                    break;
                case "curriculum":
                    try {
                        curriculum = document.getElementById("txtCurriculum");
                        searchFilter.curriculum = curriculum.options[curriculum.selectedIndex].value;
                    }
                    catch (_) { console.log("curriculum", searchFilter.curriculum); }

                    break;
                case "education-class":
                    try {
                        educationClass = document.getElementById("txtClasses");
                        searchFilter.educationClass = educationClass.options[educationClass.selectedIndex].value;
                        if (searchFilter.educationClass === "") {
                            $(next_fs).addClass("hide");
                            $(next_fs).removeClass("show");
                            $('div[data-name="language"]').addClass("show");
                            steps--;
                        }
                    }
                    catch (_) { console.log("educationClass", searchFilter.educationClass); }

                    break;
                case "subjects":
                    try {
                        subjects = document.getElementById("ddlSubjects");
                        searchFilter.subject = subjects.options[subjects.selectedIndex].value;
                    }
                    catch (_) {
                        console.log("subject", searchFilter.subject);
                    }
                    break;
                case "language":
                    if (searchFilter.educationClass === "") {
                        $('div[data-name="subjects"]').addClass("hide");
                    }
                    try {
                        language = document.getElementById("txtLanguages");
                        searchFilter.language = language.options[language.selectedIndex].value;
                    }
                    catch (_) {
                        console.log("language", searchFilter.language);
                    }
                    break;
                case "availability":
                    try {
                        availabilityChecked = availabilityGrid.dataChecked();
                        searchFilter.availability = availabilityChecked;
                    }
                    catch (_) {
                        console.log("avail", searchFilter.availability);
                    }
                    break;
                case "startingTime":
                    try {
                        rdStartingTime = document.querySelector('input[name="startingTimeRadio"]:checked').value;
                        searchFilter.startingTime = rdStartingTime;
                    }
                    catch (_) { console.log("startingTime", searchFilter.startingTime); }
                    break;
                default:
                    console.log("country");
            }

            current_fs.animate({}, {
                step: function () {

                    current_fs.css({
                        'display': 'none',
                        'position': 'relative'
                    });

                    next_fs.css({
                        'display': 'block'
                    });
                }
            });
            setProgressBar(++current);
            var c = document.getElementById('cnt').textContent;
            //document.getElementById('cnt').innerHTML = percent;
        }

    });

    $(".prev").click(function () {

        current_fs = $(this).parent().parent();
        previous_fs = $(this).parent().parent().prev();

        $(current_fs).removeClass("show");
        $(previous_fs).addClass("show");


        let dataName = $(current_fs).attr("data-name");
        let educationClass = null;
        let subjects = null;
        let language = 0;

        switch (dataName) {
            case "education-class":
                try {
                    educationClass = document.getElementById("txtClasses");
                    searchFilter.educationClass = educationClass.options[educationClass.selectedIndex].value;
                    console.log('class', searchFilter.educationClass);
                    if (searchFilter.educationClass === "") {
                        $(next_fs).addClass("hide");
                        $(next_fs).removeClass("show");
                        $('div[data-name="language"]').addClass("show");
                    }
                }
                catch (_) { console.log("educationClass", searchFilter.educationClass); }

                break;
            case "subjects":
                try {
                    subjects = document.getElementById("ddlSubjects");
                    searchFilter.subject = subjects.options[subjects.selectedIndex].value;
                    console.log('subjct', subjects.options[subjects.selectedIndex].value);
                }
                catch (_) {
                    console.log("subject", searchFilter.subject);
                }
                break;
            case "language":
                if (searchFilter.educationClass === "") {
                    $('div[data-name="subjects"]').removeClass("show");
                    $('div[data-name="education-class"]').addClass("show");
                }
                try {
                    language = document.getElementById("txtLanguages");
                    searchFilter.language = language.options[language.selectedIndex].value;
                }
                catch (_) {
                    console.log("language", searchFilter.language);
                }
                break;
            case "service":
                let map = document.getElementById("svgMapPopulation");
                map.style.display = "block";
                break;
        }
        current_fs.animate({}, {
            step: function () {

                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });

                previous_fs.css({
                    'display': 'block'
                });
            }
        });
        setProgressBar(--current);
        var c = document.getElementById('cnt').textContent;
        document.getElementById('cnt').textContent = Number(c) - 5;

    });

    function setProgressBar(curStep) {
        percent = parseFloat(100 / steps) * curStep;
        //percent = percent.toFixed();
        progress(percent);
    }

    async function progress(newProgress) {
        if (loaderCircle !== null) {
            let r = parseFloat(loaderCircle.getAttribute("r"));
            let per = 2 * Math.PI * r;
            let percentDisplays = document.querySelectorAll("[data-role=progress-value]");
            if (newProgress > searchProgress) {
                for (i = searchProgress; i <= newProgress; i++) {
                    let d = i * per / 100;
                    loaderCircle.style.strokeDasharray = "".concat(d, ", ", (per - d));
                    percentDisplays.forEach(pv => pv.innerHTML = "".concat(i, "%"));
                    await prog_timer(30);
                }
            } else {
                for (i = searchProgress; i >= newProgress; i--) {
                    let d = i * per / 100;
                    loaderCircle.style.strokeDasharray = "".concat(d, ", ", (per - d));
                    percentDisplays.forEach(pv => pv.innerHTML = "".concat(i, "%"));
                    await prog_timer(30);
                }
            }
            searchProgress = newProgress;
            let progText = "".concat(searchProgress, "%");
            $(".progress-bar").css("width", progText);
            if (searchProgress === 100) {
                let qs = toQueryString(searchFilter);
                window.location.href = window.location.origin.concat("/Tutor/search?").concat(qs);
            }
        }
    }

    $('.radio-group .radio').click(function () {
        $('.radio').removeClass('selected');
        $(this).addClass('selected');
    });

    // set filtersearch component to our result page
    $("[data-role='search-filter-submit']").click(function () {
        //let qs = toQueryString(searchFilter);
        //window.location.href = window.location.origin.concat("/Tutor/search?").concat(qs);
    });

    $("[data-role='select-subject']").on('change', function () {
        let parent = $(this).closest("[data-role='search-tutor-input']");
        let subject = parent.find("[data-role='select-subject']").val();
        searchFilter["Subject"] = subject;
        let qs = toQueryString(searchFilter);
        window.location.href = window.location.origin.concat("/Tutor/search?").concat(qs);

    });
    $("[data-role='search-tutoring-service']").on('change', function () {
        let parent = $(this).closest("[data-role='search-tutor-input']");
        let tutorService = parent.find("[data-role='search-tutoring-service']").val();
        searchFilter["TutoringService"] = tutorService;
        let qs = toQueryString(searchFilter);
        window.location.href = window.location.origin.concat("/Tutor/search?").concat(qs);
    });
    $("[data-role='select-academic-level']").on('change', function () {
        let parent = $(this).closest("[data-role='search-tutor-input']");
        let academicLevel = parent.find("[data-role='select-academic-level']").val();
        searchFilter["AcademicLevel"] = academicLevel;
        let qs = toQueryString(searchFilter);
        window.location.href = window.location.origin.concat("/Tutor/search?").concat(qs);
    });
    // if user press search button
    $("[data-role='search-tutor-submit']").click(function (e) {
        e.preventDefault();
        let parent = $(this).closest("[data-role='search-tutor-input']");
        let subject = parent.find("[data-role='search-subject']").val();
        let service = parent.find("[data-role='search-service']").val();
        let academicLevel = parent.find("[data-role='select-academic-level']").val();
        let gender = parent.find("[data-role='select-gender']").val();
        searchFilter["AcademicLevel"] = academicLevel;
        searchFilter["TutoringService"] = service;
        searchFilter["Subject"] = subject;
        if (searchFilter.SearchValue === "") {
            searchFilter.SearchValue = null;
        }
        if (searchFilter.TutoringService === undefined) {
            searchFilter.TutoringService = null;
        }
        let qs = toQueryString(searchFilter);
        let url = window.location.origin.concat("/Tutor/search?").concat(qs);
        window.location.href = url;//window.location.origin.concat("/Tutor/search?").concat(qs);
    });
    $('[data-role="choice-class"]').change(function (e) {
        let dataRole = $(this).attr("data-role");
        searchFilter[dashedToCamel(dataRole)] = $(this).val();
        let LookupDetailsClassId = $("[data-role='choice-class']").val();
        let lookupDetailsClass = new LookupDetailsClass(LookupDetailsClassId);
        $.ajax({
            url: '/Tutor/GetSubjectsClass',
            dataType: "json",
            type: "POST",
            cache: false,
            data: { classId: LookupDetailsClassId },

            success: function (data) {
                var select = document.getElementById("ddlSubjects");
                if (select === undefined || select === null) {
                    select = document.createElement("select");
                    select.name = "subjects";
                    select.id = "ddlSubjects";
                    $('#choice-user-subject').empty();
                    $('#choice-user-subject').append(select);
                }
                select.innerHTML = "";
                if (data === undefined || data.length === 0) {
                    $("#ddlSubjects").css("display", "none");
                    let option = document.createElement("option");
                    option.value = 0;
                    option.text = "Choose your material";
                    select.append(option);
                } else {
                    $("#ddlSubjects").css("display", "none");
                    let option = document.createElement("option");
                    option.value = 0;
                    option.text = "Choose your material";
                    select.append(option);

                    for (const val of data) {
                        let option = document.createElement("option");
                        option.value = val.sysId;
                        option.text = val.name;
                        select.append(option);
                    }
                    new Select('#ddlSubjects', {
                        filtered: 'auto',
                        filter_threshold: 8,
                        filter_placeholder: 'Select a material'
                    });
                }
            },
            error: function (xhr) {
                console.log('error');
            }
        });

    });

});