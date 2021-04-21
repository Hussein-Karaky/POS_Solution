/**
 * @param {any} targetId
 * @param {any} dataSource
 */
var spinner = null;
let qaTemplateView = undefined;
var UID = accountManager.currentUser.userId;

function QATemplateView(
    targetId = null,
    dataSource = null,
) {
    this.id = window.performance.now();
    this.targetId = targetId;
    this.dataSource = dataSource;
    this.data = [],
    this.QATempId = 0;
    this.QADescription = "";
    this.timeFrame = 0;
    this.totalToPass = 0;
}

createObject = function () {
    qaTemplateView = new QATemplateView("MaterialTest", window.location.href);
    qaTemplateView.dataBind();
}

QATemplateView.prototype.dataBind = function () {
    if (
        this.targetId === undefined ||
        this.targetId === null ||
        !(this.targetId instanceof String ||
            Object.getPrototypeOf(this.targetId) === String.prototype)
    ) {
        console.error("undefined targetID");
        return;
    }
    this.callAjax();
}

QATemplateView.prototype.callAjax = function () {
    let main = this;
    let reqUrl = new URL(main.dataSource);
    if (reqUrl === null) {
        console.error("invalid URL")
        return;
    }
    let params = "";
    let material = reqUrl.searchParams.get("material");
    $.ajax({
        url: window.location.origin + '/Test/Load/?material=' + material + "&lang=" + language,
        type: "GET",
        async: false,
        data: params,
        success: function (response) {
            // if response.extras is not object => so null or empty
            if (!(response.extras instanceof Object)) {
                console.error('Invalid Response');
                return;
            }
            // so it is object and has extras
            else if ((response.extras instanceof Object)) {

                main.QATempId = response.extras.QATempId ?? 0;
                main.QADescription = response.extras.Description ?? "";
                main.timeFrame = response.extras.TimeFrame ?? 0;
                main.totalToPass = response.extras.TotalToPass ?? 0;
            }
            else { console.error("error: Unknown response format"); return; }
        },
        error: function () { console.error("error: can't grab question details"); return; },
        fail: function () { console.error("failed: can't grab question details"); return; }
    });
}

QATemplateView.prototype.callAjaxQuestions = function () {
    let main = this;
    let reqUrl = new URL(main.dataSource);
    if (reqUrl === null) {
        console.error("invalid URL")
        return;
    }
    let params = "";
    let material = reqUrl.searchParams.get("material");
    $.ajax({
        url: window.location.origin + '/Test/LoadQuestions/?material=' + material + "&lang=" + language,
        type: "GET",
        async: false,
        data: params,
        success: function (response) {
            // if response.content is not array => so response is array (not generic)
            if (!(Array.isArray(response.content)) && Array.isArray(response)) {
                //missing extras => error
                console.error('Invalid Response');
                return;
            }
            // so it is generic: has content and extras
            else if (Array.isArray(response.content)) {
                main.data = response.content;
                main.create();
                getSpinnerSingleton().remove();
            }
            else { console.error("error: Unknown response format"); return; }
        },
        error: function () { console.error("error: can't grab the questions"); return; },
        fail: function () { console.error("failed: can't grab the questions"); return; }
    });
}

QATemplateView.prototype.create = function () {
    if (this.targetId !== null && this.targetId.length > 0) {
        if (this.data.length > 0) {
            let display = this.getDisplay();
            let target = document.getElementById(this.targetId);
            if (target !== null && display !== null) {
                target.appendChild(display);

                var stepperInstace = new MStepper(document.querySelector('.stepper', {
                    // options
                    firstActive: 0 // this is the default
                }));
                //if we have a ddl, init the select
                if ($('.ddlSelect').length > 0) {
                    new Select(".ddlSelect", {
                        filtered: 'auto',
                        filter_threshold: 8,
                        filter_placeholder: null
                    });
                }
                $('#btnEndTest').click(function (e) {
                    e.preventDefault();
                    Swal.fire({
                        title: 'Are you sure you want to send your answers?',
                        text: "You won't be able to revert this!",
                        type: 'warning',
                        showCancelButton: true,
                        cancelButtonText: `Don't Send`,
                        showConfirmButton: true,
                        confirmButtonText: `Send Answers`,
                    }).then((result) => {
                        if (result.value === true) {
                            //user pressed Send Answers
                            endTest();
                        } else {
                            //user pressed don't send
                            swal.close();
                        }
                    });
                    e.stopPropagation();
                });
            }
        }
    }
}

QATemplateView.prototype.getDisplay = function () {

    let ul = document.createElement("ul");
    ul.id = "horizontal-stepper";
    ul.classList.add("stepper", "horizontal", "padding-15");
    let firstElement = true;
    let lastButton = undefined;
    this.data.forEach(function (question, index) {
        let displayType = "";
        let StepClass = "";
        if (firstElement) { StepClass = "step"; displayType = ""; firstElement = false; }
        else { StepClass = "step"; displayType = "none"; }
        let stepLi = document.createElement("li");
        stepLi.classList.add("list-none",StepClass);
        let titleDiv = document.createElement("div");
        titleDiv.classList.add("step-title", "waves-effect");

        let contentDiv = document.createElement("div");
        contentDiv.classList.add("step-content");
        contentDiv.style = "@media (max-width:768px){display:'" + displayType + "'}";
        var text = document.createTextNode(question.description);
        let tdQuestionDiv = document.createElement("div");
        tdQuestionDiv.className="ques-div";
        tdQuestionDiv.appendChild(text);

        contentDiv.appendChild(tdQuestionDiv);

        stepLi.appendChild(titleDiv);
        stepLi.appendChild(contentDiv);
        ul.appendChild(stepLi);

        if (question.fieldTypeName.toLowerCase() === "list") {
            switch (question.displayName.toLowerCase()) {

                case "optionlist":
                    let optionDiv = document.createElement("div");
                    optionDiv.setAttribute('showType', "OptionList");
                    optionDiv.setAttribute('question-id', question.id);

                    let ulOptionList = document.createElement("ul");
                    ulOptionList.className="list-none";

                    question.answer.forEach(function (answer, index) {

                        let liOptionList = document.createElement("li");

                        let inputOptionList = document.createElement("input");
                        inputOptionList.setAttribute('name', "Question" + question.id);
                        inputOptionList.setAttribute('question-id', question.id);
                        inputOptionList.setAttribute('answer-id', answer.id);
                        inputOptionList.type = "radio";
                        inputOptionList.setAttribute('value', answer.id);
                        inputOptionList.className = "option-input btn-outline square-24";

                        let labelOptionList = document.createElement("label");
                        labelOptionList.setAttribute('for', "Question" + question.id)
                        labelOptionList.innerHTML = answer.answerDescription;


                        let trDiv = document.createElement("div");

                        trDiv.appendChild(inputOptionList);
                        trDiv.appendChild(labelOptionList);

                        liOptionList.appendChild(trDiv);
                        ulOptionList.appendChild(liOptionList);
                    });

                    optionDiv.appendChild(ulOptionList);
                    optionDiv.className="margin-1";
                    contentDiv.appendChild(optionDiv);
                    break;

                case "dropdownlist":
                    let ddlDiv = document.createElement("div");
                    ddlDiv.setAttribute('showType', "DDL");
                    ddlDiv.setAttribute('data-rel', "undefined");
                    ddlDiv.setAttribute('tabindex', "0");
                    ddlDiv.setAttribute('question-id', question.id);
                    ddlDiv.className="select"

                    let select = document.createElement("select");
                    select.classList.add("ddlSelect")

                    question.answer.forEach(function (answer, index) {
                        let option = document.createElement("option");
                        option.setAttribute('Question-id', question.id);
                        option.setAttribute('answer-id', answer.id);
                        option.innerHTML = answer.answerDescription;
                        select.appendChild(option);
                    })
                    ddlDiv.appendChild(select);
                    ddlDiv.className="margin-1";
                    contentDiv.appendChild(ddlDiv);
                    break;

                case "checkbox":
                    let checkDiv = document.createElement("div");
                    checkDiv.setAttribute('showType', "check");
                    checkDiv.setAttribute('question-id', question.id);

                    let ulcheck = document.createElement("ul");
                    ulcheck.className="list-none";


                    question.answer.forEach(function (answer, index) {
                        let licheck = document.createElement("li");

                        let inputCheck = document.createElement("input");
                        inputCheck.setAttribute('name', "Question" + question.id);
                        inputCheck.setAttribute('Question-id', question.id);
                        inputCheck.setAttribute('Answer-id', answer.id);
                        inputCheck.type = "checkbox";
                        inputCheck.setAttribute('value', "1");
                        inputCheck.className ="option-input btn-outline square-24";

                        let labelCheck = document.createElement("label");
                        labelCheck.setAttribute('for', "Question" + question.id);
                        labelCheck.innerHTML = answer.answerDescription;

                        let trDiv = document.createElement("div");

                        trDiv.appendChild(inputCheck);
                        trDiv.appendChild(labelCheck);

                        licheck.appendChild(trDiv);
                        ulcheck.appendChild(licheck);
                    })
                    checkDiv.appendChild(ulcheck);
                    checkDiv.className="font-16";

                    contentDiv.appendChild(checkDiv);

                    break;

                default:
                    break;
            }
        }
        else if (question.fieldTypeName.toLowerCase() === "text") {
            let textDiv = document.createElement("div");
            textDiv.setAttribute('showType', "text");
            textDiv.setAttribute('question-id', question.id);

            let textDiv2 = document.createElement("div");
            textDiv2.className = "row";

            let textDiv3 = document.createElement("div");
            textDiv3.className = "col-6";

            let textareaText = document.createElement("textarea");
            textareaText.className = "form-control";
            textareaText.rows = "5";
            textareaText.id = question.id;
            textareaText.placeholder = "Please write your answer here";
            textareaText.required = true;

            textDiv3.appendChild(textareaText);

            let textDiv4 = document.createElement("div");
            textDiv4.className = "col-6";

            let imgText = document.createElement('img');
            imgText.src = "~/images/Screen_Shot_2014-02-27_at_6.43.30_PM.png";
            imgText.className="dimension-150";

            textDiv4.appendChild(imgText);

            textDiv2.appendChild(textDiv3);
            textDiv2.appendChild(textDiv4);

            textDiv.appendChild(textDiv2);
            textDiv.className="font-16";
            contentDiv.appendChild(textDiv);
        }

        // continue button
        let buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add("step-actions", "step-action-extras");

        let contButton = document.createElement('button');
        contButton.classList.add("btn", "btn-info", "text-white", "next-step");
        contButton.innerHTML = "CONTINUE";
        lastButton = buttonsDiv;
        buttonsDiv.appendChild(contButton);
        contentDiv.appendChild(buttonsDiv);
    })
    lastButton.innerHTML = '<button id="btnEndTest" class="bold btn btn-info text-white">Submit</button>';
    return ul;
}

function testDescription() {
    let testLayout = $('#TestDescription');
    testLayout.empty();
    if (qaTemplateView.QADescription !== "") {
        testLayout.append(
            '<div class="description-test-bigDiv">' +
            '<div class="description-test-options">' +
            '<div class="description-test-options-in card btn-info text-white">' +
            '<span class="bold">' +
            'Description : ' +
            '</span>' +
            qaTemplateView.QADescription +
            '</div>' +
            '</div>' +
            '<div class="description-test-options">' +
            '<div class="description-test-options-in card btn-info text-white">' +
            '<span class="bold">' +
            'Duration : ' +
            '</span>' +
            qaTemplateView.timeFrame + ' mins' +
            '</div>' +
            '</div>' +
            '<div class="description-test-options">' +
            '<div class=" description-test-options-in card btn-info text-white">' +
            '<span class="bold">' +
            'Total To Pass : ' +
            '</span>' +
            qaTemplateView.totalToPass + " points" +
            '</div>' +
            '</div>' +
            '<div class="full-width">' +
            '<div class="start-button-div card text-white">' +
            '<button id="btnStartTest" class="start-test-button btn btn-outline-success text-white" >Start</button>' +
            '</div>' +
            '</div>'
        );
    }
    else {
        testLayout.append(
            '<div class="description-test-options">' +
                '<div class=" description-test-options-in card btn-info text-white">' +
                    '<span class="bold">' +
                        'No Questions Available For This Material' +
                    '</span>' +
                '</div>' +
            '</div>' 
        );
    }
          //  '<div class="start-button-div card btn-info text-white">' +
        //'<button id="btnStartTest" class="start-test-button btn btn-info text-white">Start</button>' +


}

function startTest() {
    let mainTest = $('#MaterialTest');
    $('#TestDescription').hide();
    mainTest.append(getSpinnerSingleton("", { 'width': '100%', 'display': 'inline-block', 'text-align': 'center' },
        { 'color': '#33b5e5', 'width': '5rem', 'height': '5rem' },
        { 'display': 'inline-block' }));
    qaTemplateView.callAjaxQuestions();
    mainTest.show();
    $.ajax({
        url: baseUrl + '/Test/StartTest',
        type: 'post',
        data: { QATempId: qaTemplateView.QATempId, UID: UID },
        success: function () {
            //let timingTable = $('#timingTable tbody');
            let timingTable = $('#timingTable');
            timingTable.empty();
            let testTime = qaTemplateView.timeFrame;
            let startTime = moment();
            let endTime = moment(startTime).add(testTime, "minutes");
            const timeLimit=$(
                '<div id="TimeLimit" >' +
                        '<div class="time-Limit">' +
                        '<div class="bg-danger countdown" role="alert">' +
                        '<b class=\"text-white\">Be careful the test time is about to end </b>' +
                        '</div>' +
                        '</div>' +
                        '</div>');
            
   
            timingTable.append(
                '<div class="timing-out">' +
                    '<div class="timing-in">' +
                        '<span class="timing-text">'+
                            'Start Time: ' +
                        '</span>' +
                        '<span class="timing-time-text">'+
                            startTime.format("HH:mm") +
                        '</span>'+
                    '</div>' +
                '</div>' +

                '<div class="inline-div-space"></div>'+

                '<div class="timing-out">' +
                    '<div class="timing-in">' +
                         '<span class="timing-text">'+
                            'End Time: ' +
                         '</span>'+
                        '<span class="timing-time-text">'+
                            endTime.format("HH:mm") +
                        '</span>'+
                    '</div>' +
                '</div>' +

                '<div class="inline-div-space"></div>'+

                '<div class="timing-out">' +
                    '<div class="timing-in">' +
                        '<span class="timing-text">' +
                            'Test Time: ' +
                        '</span>'+
                        '<span class="timing-time-text">'+
                            testTime + " mins" +
                        '</span>'+
                    '</div>' +
                '</div>' +

                '<div class="inline-div-space"></div>'+

                '<div class="timing-out">' +
                    '<div class="timing-in">' +
                         '<span class="timing-text">'+
                            'Remaining Time: ' +
                        '</span>'+
                        '<span id="countdown" class="timing-time-text">'+
                            (testTime > 10 ? testTime : '0' + testTime)+':00'+
                        '</span>'+
                    '</div>' +
                '</div>');

            $('#divSubmit').show();
            $('#hrline').show();
            $('#timeDiv').show();
            $('#btnStartTest').hide();
            $('#TestDescription').hide();

            var interval = setInterval(function () {

                let totalTime = endTime.diff(startTime, "seconds");
                let seconds = totalTime - moment().diff(startTime, "seconds");
                let minutes = parseInt(seconds / 60);
                seconds = seconds - minutes * 60;
                formatedSeconds = (seconds < 10) ? '0' + seconds : seconds;
                formatedMinutes = (minutes < 10) ? '0' + minutes : minutes;
                const timeSpan=$('#countdown');
                timeSpan.html(formatedMinutes + ':' + formatedSeconds);
                if (minutes < 1 && timingTable.children('#TimeLimit').length === 0) {
                    timingTable.append(timeLimit);
                    timeSpan.css('color','red');
                }
                if ((seconds <= 0 && minutes <= 0)) {
                    clearInterval(interval);
                    endTest();
                    Swal.fire('Time Ended','The Test Time Has Ended, Those Are Your Results.','info');
                }
            }, 1000);

        },
        error: function () {
            alert('error');
        }
    });
}

function endTest() {
    let userAnswer = [];
    let id = 0;
    $('div[showType]').each(function (index) {
        const answerDiv = $(this);
        let newItem = undefined;
        switch (answerDiv.attr('showType')) {
            case 'DDL':
                newItem = {
                    ID: id,
                    QID: answerDiv.attr('question-id'),
                    value: '',
                    List: answerDiv.find('select option:selected').attr('answer-id').trim(),
                    Notes: ''
                }
                id = id + 1;
                break;
            case 'OptionList':
                var checkedRadio = null;
                checkedRadio = answerDiv.find('input[type=radio]:checked').val();
                if (checkedRadio === undefined) {
                    newItem = {
                        ID: id,
                        QID: answerDiv.attr('question-id'),
                        value: '',
                        List: '0',
                        Notes: ''
                    }
                }
                else {
                    newItem = {
                        ID: id,
                        QID: answerDiv.attr('question-id'),
                        value: '',
                        List: checkedRadio,
                        Notes: ''
                    }
                }
                id = id + 1;
                break;
            case 'check':
                var userCheckboxAnswers = [];
                $.each(answerDiv.find('input[type=checkbox]:checked'), function () {
                    userCheckboxAnswers.push($(this).attr('answer-id'))
                });
                if (userCheckboxAnswers === undefined || userCheckboxAnswers === []) {
                    newItem = {
                        ID: id,
                        QID: answerDiv.attr('question-id'),
                        value: '',
                        List: '0',
                        Notes: ''
                    }
                }
                else {
                    newItem = {
                        ID: id,
                        QID: answerDiv.attr('question-id'),
                        value: '',
                        List: userCheckboxAnswers.join(", "),
                        Notes: ''
                    }
                }
                id = id + 1;
                break;
            case 'text':
                let text = answerDiv.find("textarea");
                let value = text.val().trim();
                newItem = {
                    ID: id,
                    QID: answerDiv.attr('question-id'),
                    value: value,
                    List: '0',
                    Notes: ''
                }
                id = id + 1;
                break;
            default:
        }
        if (newItem !== undefined) {
            userAnswer.push(newItem);
        }
    });
    $.ajax({
        url: baseUrl + '/Test/EndTest',
        type: 'post',
        dataType: 'json',
        data: { Sub: JSON.stringify(userAnswer), QATempId: qaTemplateView.QATempId, UID: UID },
        success: function (response) {
            $('#DivTest').hide();
            $('#divSubmit').hide();
            $('#hrline').hide();
            $('#timeDiv').hide();
            let tblResults = $('#ResultTable tbody');
            showUserResults(tblResults, response);
            $('#DivResult').show();
        },
        error: function () {
            alert('error');
        }
    });
}

function showUserResults(tblname, userResult) {
    $('#btnStartTest').hide();
    $('#MaterialTest').hide();
    $('#timingTable').hide();

    let testTotal = 0;
    let total = 0;
    let counter = 1;
    let passed = 'Failure';
    tblname.empty();
    $(userResult).each(function (index, res) {
        total = total + res.points;
        testTotal = testTotal + res.questionPoints;
        let iconClass = 'success';

        if (res.result == 0) { iconClass = 'failure' }

        let trResult = document.createElement("tr");
        trResult.className = "text-center";

        let tdResult1 = document.createElement("td");
        tdResult1.innerHTML = counter;
        tdResult1.className="font-14";

        let tdResult2 = document.createElement("td");
        tdResult2.className = iconClass;
        let icon= document.createElement('span')
        icon.className="badge square-24";
        tdResult2.appendChild(icon);

        let tdResult3 = document.createElement("td");
        tdResult3.className="font-14";
        tdResult3.innerHTML = res.points + ' /' + res.questionPoints;

        trResult.appendChild(tdResult1);
        trResult.appendChild(tdResult2);
        trResult.appendChild(tdResult3);

        tblname.append($(trResult));

        ++counter;
    });
    if (total >= qaTemplateView.totalToPass) { passed = 'Passed' }
    let trFinalRes = document.createElement("tr");
    trFinalRes.className = "text-center";

    let tdFinalRes = document.createElement("td");
    tdFinalRes.className="showResultsStyle";
    tdFinalRes.innerHTML = passed;

    let tdFinalRes2 = document.createElement("td");
    tdFinalRes2.className="showResultsStyle";
    tdFinalRes2.innerHTML = "Total";


    let tdFinalRes3 = document.createElement("td");
    tdFinalRes3.className="showResultsStyle";
    tdFinalRes3.innerHTML = total + "/" + testTotal;

    trFinalRes.appendChild(tdFinalRes);
    trFinalRes.appendChild(tdFinalRes2);
    trFinalRes.appendChild(tdFinalRes3);

    tblname.append($(trFinalRes));
}

getSpinnerSingleton = function (text = "", css = {}, spinnerCSS = {}, spinnerParentCSS = {}) {
    if (spinner === null) {
        spinner = getSpinner(text, css, spinnerCSS, spinnerParentCSS)
    }
    return spinner;
}

/**
 * 
 * @param {any} text : used as a text next to the spinner (ex: loading)
 * @param {any} css : css applied to the main div, thus applied on the spinner and the text 
 * @param {any} parent : the spinner will automatically append the generated spinner to the parent, and return the id of the spinner in this case,
 *                       if not present, the function will return the whole object
 */
getSpinner = function (text = "", css = {}, spinnerCSS = {}, spinnerParentCSS = {}, parent = null) {
    let span = ""
    if (text === undefined || text === "") {
        span = $('<span class="sr-only">Loading...</span>')
    }
    const id = Math.round(Math.random() * 20000);
    let spinner = $('<div id="' + id + '" style="display: table-row;"></div>').css(css);
    let spnrDiv = $('<div style="display: table-cell; vertical-align:middle"></div>').css(spinnerParentCSS)
    let spnr = $("<div>").addClass('spinner-border').attr('role', 'status').css(spinnerCSS);
    if (span === "") {
        spinner = spinner.append($('<div style="display: table-cell; vertical-align:middle" class="pl-2">' + text + '</div>'));
    }
    spinner.append(spnrDiv);
    spnrDiv.append(spnr);
    spnrDiv.append(span);
    if (parent !== null) {
        $(parent).append(spinner)
    } else {
        return spinner;
    }
    return id;
}
