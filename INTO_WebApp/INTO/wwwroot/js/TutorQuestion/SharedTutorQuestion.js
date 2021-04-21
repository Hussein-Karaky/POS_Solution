const globalMaxVisiblePaging = 10;
const globalPageSize = 5;
let globalPageNumber = 1;

let globalTexts = {
    followers: "Followers",
    answers: "Answers",
    yourTopics: "Your Topics",
    otherTopics: "Other Topics",
    following: "Following",
    follow: "Follow",
    addAnswer: "Add Answer",
    addComment: "Add Comment",
    submitAnswer: "Submit Answer",
    like: "Like",
    dislike: "Dislike",
    addAQuestion: "Add A Question",
    chooseACategory: "Please Choose a Category",
    closeQuestion: "Close Question",
    closed: "Closed",
    allQuestionsPageTitle: "All Questions",
    allQuestionsByTagPageTitle: "All Questions By Tag",
    tutorQuestionsPageTitle: "Tutor Questions",
    addTutorQuestionPageTitle: "Add Tutor Question",
    addTutorQuestionAnswerPageTitle: "Add Tutor Question Answer",
    required: "Required",
    optional: "Optional",
    questionTitle: "Question Title",
    whatsYourQuestion: "What's Your Question",
    questionDescription: "Question Description",
    addTopics: "Add Topics",
    addAtLeastOneTopic: "Add At Least One Topic",
    submitQuestion: "Submit Question",
    makeSureTutorQuestion: "Make sure you didn't provide an answer to your question before submitting. You will be able to add an answer as the next step.",
    addDetailsTutorQuestion: "Add details to your question but DO NOT provide the answer here...",
    addYourAnswer: "Add Your Answer",
    typeYourAnswer: "Type Your Answer Here...",
    loading: "Loading",
    noTopicsFound: "No Topics Were Found.",
    dataIsNotFound: "Data Is Not Found.",
    errorNotFound: "Error Data Not Found.",
    notAnsweredYet: "Not Answered Yet..",
    addYourCommentHere: "Add Your Comment Here...",
    reachMore : "Reach more students by adding questions that they are searching for.",
    postQuestion: "Once you post a question, you’ll be able to showcase your expertise by answering it.",
    areYouSure: "Are You Sure?",
    yes: "Yes",
    cancel: "Cancel",
    close: "Close",
    noLikersYet: "No Likers Yet.",
    noDislikersYet: "No Dislikers Yet.",
    likers: "Likers",
    dislikers: "Dislikers",
    areYouSureClose: "Are you sure you want to close this question",
    closingQuestion:"Closing Question, Please Be Patient.",
}


function getGlobalTexts(url, lookupId, afterFunction = function () { }) {

    $.ajax({
        url: url,
        type: "POST",
        data: { lang: language, LookupId: lookupId },
        success: function (response) {
            response.content.forEach(function (lookup) {
                globalTexts[lookup.keyword] = lookup.lookupDetailsDescription;
            });
            //after creation of element initialize
            if (isFunction(afterFunction)) {
                afterFunction();
            }

        },
    });

}

function isFunction(obj) {
    return obj !== null && obj !== undefined && (obj instanceof Function || Object.getPrototypeOf(obj) === Function.prototype);
}

function makeTag(tagName) {
    let span = document.createElement("a");
    span.classList.add("badge", "badge-info", "pull-right", "mr-2");
    span.setAttribute('tag-id', "tag-" + tagName);
    span.innerHTML = tagName;
    span.href = '/TutorQuestion/AllQuestionsByTag/' + tagName;
    return (span);
}

function makeUserDiv(userName, img, isTutor = false) {
    let div = document.createElement('div');
    div.classList.add("row", "usr-main-div", "mt-3");

    let imgDiv = document.createElement('div');
    imgDiv.classList.add('container-topleft')
    let imgObj = document.createElement('img');
    imgObj.classList.add("usr-img-holder", "btn-sm", "btn-outline-info", "nav-account");
    imgObj.setAttribute("src", (img.startsWith('data:image/png;base64,') ? img : 'data:image/png;base64,' + img));

    let name = document.createElement('div');
    name.classList.add("usr-name-div");
    name.innerHTML = userName;

    imgDiv.appendChild(imgObj);
    if (isTutor) {
        let hat = document.createElement('i');
        hat.classList.add("fa", "fa-graduation-cap", "topleft");
        imgDiv.appendChild(hat);
    }
    div.appendChild(imgDiv);
    div.appendChild(name);
    return (div);
}

function makeComment(userName, img, text, isTutor = false) {
    let card = document.createElement("div");
    card.classList.add("card", "col-11", "mb-3", "mt-2", "row", "bg-transparent", "no-shadow", "offset-half");

    let userImgDiv = document.createElement("div");
    userImgDiv.classList.add("row", "no-gutters");

    let imgHolder = document.createElement("div");
    imgHolder.classList.add("col-auto", "text-md-right", "pr-2");

    let imgDiv = document.createElement('div');
    imgDiv.classList.add('container-topleft')

    let imgObj = document.createElement('img');
    imgObj.classList.add("usr-img-holder", "btn-sm", "btn-outline-info", "nav-account");
    imgObj.setAttribute("src", (img.startsWith('data:image/png;base64,') ? img : 'data:image/png;base64,' + img));

    let cmntDiv = document.createElement("div");
    cmntDiv.classList.add("col-md-8");

    let cmnt = document.createElement("div");
    cmnt.classList.add("card-body", "comment-text-box");

    let userNameDiv = document.createElement("h5");
    userNameDiv.classList.add("card-title", "font-1-25");
    userNameDiv.innerHTML = userName;

    let cmntText = document.createElement("p");
    cmntText.classList.add("card-text", "font-black");
    cmntText.innerHTML = text;

    cmnt.appendChild(userNameDiv);
    cmnt.appendChild(cmntText);

    cmntDiv.appendChild(cmnt);

    imgDiv.appendChild(imgObj);
    if (isTutor) {
        let hat = document.createElement('i');
        hat.classList.add("fa", "fa-graduation-cap", "topleft");
        imgDiv.appendChild(hat);
    }

    imgHolder.appendChild(imgDiv);

    userImgDiv.appendChild(imgHolder);
    userImgDiv.appendChild(cmntDiv);

    card.appendChild(userImgDiv);

    return card;
}

function makeDataNotFound(text, css = {}, hx = 2) {
    let h2 = document.createElement('h' + hx);
    h2.innerHTML = text;
    $(h2).css(css);
    return h2;
}

function getSpinner(text = "", jquery = false, spinnerCSS = {}, textCSS = {}) {
    let span = document.createElement('span');
    let spinnerText = null;
    if (text === undefined || text === "") {
        span = document.createElement('span');
        span.classList.add('sr-only');
        span.innerHTML = 'Loading...';
    }

    let spinnerHolder = document.createElement('div');
    spinnerHolder.classList.add('flex-vertical-center', 'flex-horizontal-center')

    let spinner = document.createElement('div');
    spinner.classList.add('spinner', 'spinner-border');
    spinner.setAttribute('role', 'status')

    spinnerHolder.appendChild(spinner);

    if (span.innerHTML !== "") {
        spinner.appendChild(span);
    } else {
        spinnerText = document.createElement('div');
        spinnerText.classList.add('pl-2', 'spinner-text');
        spinnerText.appendChild(document.createTextNode(text));
        spinnerHolder.appendChild(spinnerText)
    }
    $(spinner).css(spinnerCSS);
    $(spinnerText).css(textCSS);
    if (jquery) {
        return $(spinnerHolder);
    }

    return spinnerHolder;
}


function showSwalLoading(txt = "Loading Data") {
    Swal.fire({
        title: txt,
        html:getSpinner(),
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading()
        }
    })
};