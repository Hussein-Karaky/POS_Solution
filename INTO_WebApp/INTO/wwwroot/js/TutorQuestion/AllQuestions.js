var imgSrcBoard = "/images/board0.png";
var allQuest = [];
let globalPageName = "";


function Question(
    questionID = Math.random() * 20000,
    title = "",
    description = "",
    tags = [],
    nbOfFollowers = 0,
    nbOfAnswers = 0,
    followed = false,
    tutorId = 0,
    firstName = "",
    lastName = "",
    userImg = "",
    closed = "",
    closedVisible = "",
) {
    this.questionID = questionID;
    this.title = title;
    this.description = description;
    this.tags = tags;
    this.nbOfFollowers = nbOfFollowers;
    this.nbOfAnswers = nbOfAnswers;
    this.followed = followed;
    this.tutorId = tutorId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.userImg = userImg;
    this.closed = closed;
    this.closedVisible = closedVisible;
}
Question.extends(Node);
Question.construct();
Question.prototype.create = function () { }
Question.prototype.getDisplay = function () {
    const child = this;
    let divChild = document.createElement("div");
    divChild.classList.add("card", "mb-4", "wow", "fadeIn", "hoverborder");
    divChild.setAttribute('question-id', child.questionID);
    divChild.setAttribute('tutor-id', child.tutorId);

    // Question Tags
    let cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header", "font-weight-bold");

    let headerRow = document.createElement('div');
    headerRow.classList.add("row");

    let userDiv = document.createElement('div');
    userDiv.classList.add('col-12');
    userDiv.appendChild(makeUserDiv(child.firstName + " " + child.lastName, child.userImg, true))


    let tagsDiv = document.createElement('div');
    tagsDiv.classList.add('col-12', "text-right");

    this.tags.forEach(function (tag, index) {
        let span = makeTag(tag.name);
        tagsDiv.appendChild(span);

        if (child.parent.yourTopics.indexOf(tag.name) === -1) {
            child.parent.yourTopics.push(tag.name)
        }
    });

    headerRow.appendChild(userDiv);
    headerRow.appendChild(tagsDiv);
    cardHeader.appendChild(headerRow);

    divChild.appendChild(cardHeader);

    // Question Description
    let divDesc = document.createElement("div");
    divDesc.classList.add("card-body");

    let divOut = document.createElement("div");
    divOut.classList.add("media", "d-block", "d-md-flex", "mt-3");

    let divIn = document.createElement("div");
    divIn.classList.add("media-body", "text-center", "text-md-left", "ml-md-3", "ml-0");

    let ques = document.createElement("h5");
    ques.classList.add("mt-0", "font-weight-bold");
    ques.innerHTML = this.description;

    divIn.appendChild(ques);
    divOut.appendChild(divIn);
    divDesc.appendChild(divOut);

    divChild.appendChild(divDesc);

    //Question Followes and  Answers
    let cardFooter = document.createElement("div");
    cardFooter.classList.add("card-footer", "font-weight-bold");

    let footerRow = document.createElement('div');
    footerRow.classList.add("row");

    let h5Follows = document.createElement("h5");
    h5Follows.classList.add("text-info", "col-auto", "flex-vertical-center");

    let followsIcon = document.createElement("i");
    //followsIcon.classList.add("fa", "fa-wifi");

    let nbFollows = document.createElement("span");
    nbFollows.classList.add("ml-2");
    nbFollows.innerHTML = globalTexts.followers + " " + this.nbOfFollowers

    h5Follows.appendChild(followsIcon);
    h5Follows.appendChild(nbFollows);

    let h5Answers = document.createElement("h5");
    h5Answers.classList.add("text-info", "col-auto", "flex-vertical-center");

    let AnsIcon = document.createElement("i");
    AnsIcon.classList.add("fa", "fa-check-circle");

    let nbAnswers = document.createElement("span");
    nbAnswers.classList.add("ml-2");
    nbAnswers.innerHTML = globalTexts.answers + " " + this.nbOfAnswers

    h5Answers.appendChild(AnsIcon);
    h5Answers.appendChild(nbAnswers);

    footerRow.appendChild(h5Follows);
    footerRow.appendChild(h5Answers);

    if (this.tutorId === accountManager.currentUser.id && (!this.closed || this.closedVisible)) {
        let closeDiv = document.createElement("div");
        closeDiv.classList.add("col-auto", "flex-vertical-center");

        let closeQuestion = document.createElement('button');
        closeQuestion.setAttribute("question-id", this.questionID);
        closeQuestion.setAttribute("closed-visible", this.closedVisible);
        closeQuestion.classList.add("btn", "btn-info", "text-white");
        if (!this.closed) {
            closeQuestion.innerHTML = globalTexts.closeQuestion;
            closeQuestion.classList.add("close-question");
        } else if (this.closedVisible) {
            closeQuestion.innerHTML = globalTexts.closed;
        }
        closeDiv.appendChild(closeQuestion);
        footerRow.appendChild(closeDiv);
    }

    cardFooter.appendChild(footerRow);

    divChild.appendChild(cardFooter);

    return divChild;
};

function allQuestionsNode(
    creationTarget = null,
    dataSource = null,
    dataSourceParams = {},
    pageNumber = 1,
    pageSize = 5,
    selectorType = "div",
    children = [],
    childType = Question,
    capacity = null,
    data = [],
    css = [],
    singleton = false,
    asRoot = false,
    yourTopics = [],
    otherTopics = []
) {
    this.pageNumber = pageNumber ?? 1;
    this.pageSize = pageSize ?? 5;
    this.dataSourceParams = {
        ...(dataSourceParams ?? {}),
        ...{ pageNumber: this.pageNumber, pageSize: this.pageSize }
    }
    this.yourTopics = yourTopics;
    this.otherTopics = otherTopics;
    this.remainingPages = undefined;
    ParentNode.call(this,
        creationTarget,
        dataSource,
        selectorType,
        children,
        childType,
        capacity,
        data,
        css,
        undefined,
        undefined,
        singleton,
        asRoot,
        this.dataSourceParams
    );

}
allQuestionsNode.extends(ParentNode);
allQuestionsNode.construct();

allQuestionsNode.prototype.dataBound = function () {
    let data = this.dat;
    let main = this;
    if (data.content.length > 0) {
        data.content.forEach(function (question, index) {
            let q = new Question(question.id, question.title, question.description, question.tags, question.followsNumber, question.answersNumber,
                question.isFollowing, question.tutorId, question.firstName, question.lastName, question.userImg, !question.status, question.closedVisible);
            main.add(q);
        })
    }
    main.remainingPages = parseInt(data.extras.remainingPages);
    main.otherTopics = JSON.parse(data.extras.otherTopics);
}

allQuestionsNode.prototype.dataBind = function (onsuccess = function (data, text) { }, onerror = function () { }) {
    ParentNode.prototype.dataBind.call(this,
        onsuccess, onerror);
};

allQuestionsNode.prototype.create = function (parameter) {
    if (this.creationTarget !== null && this.creationTarget.length > 0) {
        if (this.dat != undefined && this.dat != null) {
            let display = this.getDisplay();
            let target = document.getElementById(this.creationTarget);
            if (target !== null && display !== null) {
                target.appendChild(display);
                $('.hoverborder').click(function () {
                    let x = $(this).attr('question-id');
                    let tid = $(this).attr('tutor-id');
                    let url = '/TutorQuestion/AddTutorQuestionAnswer/' + x;
                    window.location = window.location.origin.concat(url);
                });
                $('.close-question').on('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    let btn = $(this);
                    let qid = btn.attr('question-id');
                    let closedVisisble = btn.attr('closed-visible');
                    let tid = accountManager.currentUser.id;
                    let url = '/TutorQuestion/CloseQuestion';
                    let data = { TQuestionId: qid, tutorID: tid };
                    Swal.fire({
                        icon: 'question',
                        title: globalTexts.areYouSure,
                        text: globalTexts.areYouSureClose,
                        showCancelButton: true,
                        confirmButtonText: globalTexts.yes,
                        cancelButtonText: globalTexts.cancel,
                    }).then((result) => {
                        if (result.value) {
                            showSwalLoading(globalTexts.closingQuestion);
                            $.ajax({
                                url: url,
                                type: "POST",
                                data: data,
                                success: function (response) {
                                    if (parseInt(response) === 1) {
                                        if (closedVisisble) {
                                            btn.removeClass("close-question");
                                            btn.text(globalTexts.closed).off('click');
                                        } else {
                                            btn.closest('.card').remove();
                                        }
                                        $('button[question-id=' + qid + '][closed-visible=false]').closest('.card').remove();
                                        $('button[question-id=' + qid + '][closed-visible=true]').removeClass("close-question").text(globalTexts.closed).off('click');
                                        Swal.fire({
                                            title: globalTexts.closed,
                                            icon: "info",
                                            timer: 2000,
                                            showConfirmButton: false
                                        });
                                    }
                                    else {
                                        alert('failed to close question');
                                    }
                                },
                                error: function (response) {
                                    alert('error: failed to close question');
                                }
                            });
                        }
                    });

                });

            }
        }
    }
};

allQuestionsNode.prototype.getDisplay = function () {
    let div = document.createElement("div");
    div.setAttribute('id', "wrapperPage" + this.pageNumber);
    div.classList.add("row");

    let divLeft = document.createElement("div");
    divLeft.classList.add("col-md-7", "col-lg-7", "offset-md-1", "offset-lg-1", "col-sm-12");
    // appending the children
    if (this.children.length > 0) {
        this.children.forEach(function (child) {
            let childDiv = child.getDisplay();
            divLeft.appendChild(childDiv);
        });
    } else {
        divLeft.appendChild(makeDataNotFound(globalTexts.dataIsNotFound, { "text-align": "center", color: "red" }, 1));
    }
    // appending the topics
    let DivTopics = document.createElement("div");
    DivTopics.classList.add("col-md-3", "col-lg-3", "col-sm-12");

    let subDiv = document.createElement("div");

    let subDiv1 = document.createElement("div");
    subDiv1.classList.add("card", "mb-4", "wow", "fadeIn");

    let subDiv2 = document.createElement("div");
    subDiv2.classList.add("card-body");


    // your topics
    let h5 = document.createElement("h5");
    h5.classList.add("card-title");
    h5.innerHTML = globalTexts.yourTopics;
    subDiv2.appendChild(h5);

    let par = document.createElement("p");
    par.classList.add("card-text");

    if (this.yourTopics.length > 0) {
        this.yourTopics.forEach(function (topic) {
            let spanTopic = makeTag(topic);
            par.appendChild(spanTopic);
        });
    } else {
        par.appendChild(makeDataNotFound(globalTexts.noTopicsFound, {}, 5));
    }
    subDiv2.appendChild(par);

    // other topics
    let h51 = document.createElement("h5");
    h51.classList.add("card-title");
    h51.innerHTML = globalTexts.otherTopics;
    subDiv2.appendChild(h51);

    let par1 = document.createElement("p");
    par1.classList.add("card-text");

    if (this.otherTopics.length > 0) {
        this.otherTopics.forEach(function (topic) {
            let spanTopic1 = makeTag(topic.Name)

            par1.appendChild(spanTopic1);
        });
    } else {
        par1.appendChild(makeDataNotFound(globalTexts.errorNotFound, { color: '#FF0000' }, 5));
    }
    subDiv2.appendChild(par1);

    subDiv1.appendChild(subDiv2);
    subDiv.appendChild(subDiv1);


    //appending the picture

    let divPic = document.createElement("div");
    let divPic2 = document.createElement("div");
    divPic2.classList.add("card", "mb-4", "wow", "fadeIn");

    let img = document.createElement("img");
    img.classList.add("featurette-image", "img-fluid", "mx-auto", "square-31");
    img.setAttribute('data-src', "holder.js/500x500/auto");
    img.setAttribute('alt', "500x500");
    img.setAttribute('src', imgSrcBoard);
    img.setAttribute('data-holder-rendered', "true");

    divPic2.appendChild(img);
    divPic.appendChild(divPic2);

    // apending the 2 main component : topics and img
    DivTopics.appendChild(subDiv);
    DivTopics.appendChild(divPic2);

    // appending the left and right together
    div.appendChild(divLeft);
    div.appendChild(DivTopics);

    return div;
}

function AllQuestions(creationTarget, paginationTarget, url, data = {}, pageName = "") {
    data = { ...data, ...{ UID: accountManager.currentUser.userId } }
    let loading = $('#loading-' + paginationTarget);
    loading.empty().append(getSpinner(globalTexts.loading, false, { color: '#33b5e5', width: '6rem', height: '6rem' }, { color: '#33b5e5', 'font-weight': 'bold', 'font-size': '2rem' }));
    
    let contentDiv = $('#' + creationTarget)
    let myIndex = allQuest.length;
    globalPageName = pageName;
    $('#pageTitle').text(globalTexts[globalPageName]);
    allQuest.push(new allQuestionsNode(creationTarget, url, data, globalPageNumber, globalPageSize))
    allQuest[myIndex].dataBind(
        // on success of first call of dataBind
        function () {
            const pages = (allQuest[myIndex].pageNumber + allQuest[myIndex].remainingPages);
            // initializing of bootpag library 
            $('#' + paginationTarget).bootpag({
                total: pages,
                page: allQuest[myIndex].pageNumber,
                maxVisible: globalMaxVisiblePaging
            }).on("page", function (event, num) {
                contentDiv.children().hide();
                loading.show();
                allQuest[myIndex].pageNumber = num;
                const page = contentDiv.find('#wrapperPage' + num);
                if (page.length <= 0) {
                    allQuest[myIndex] = new allQuestionsNode(creationTarget, url, data, allQuest[myIndex].pageNumber, globalPageSize);
                    allQuest[myIndex].dataBind(function () {
                        loading.hide();
                        $('.add-question-div').show();
                    }, function () { });
                } else {
                    page.show();
                    loading.hide();
                    $('.add-question-div').show();
                }
                
            });
            $('.add-question-div').show();
            loading.hide();
        }, function () { });
}

var onChange = function (element) {

    if (!(element instanceof jQuery)) {
        if ((typeof element).toLowerCase() === "string") {
            element = $('#' + element);
        }
        else if (element.tagName != undefined && element.tagName != null && element.tagName.toLowerCase() === "select") {
            element = $(element);
        }
        else {
            console.error('Unkown element format')
        }
    }

    new Select(".ddlSelect", {
        filtered: 'auto',
        filter_threshold: 8,
        filter_placeholder: null
    });
    element.on('change', function () {
        
        let addQ=$('.add-question-div').hide();
        let select = $(this);

        if (select.val() === "1") {
            let added = $('#addedQDiv');
            $('#addedDiv').removeClass('hiddenDiv');
            $('#answeredDiv').addClass('hiddenDiv');
            $('#followedDiv').addClass('hiddenDiv');
            if (added.children().length <= 1) {
                AllQuestions('addedQDiv', 'page-selection-added', window.location.origin + '/TutorQuestion/GetTutorQuestions', { tutorId: accountManager.currentUser.id, selectType: 1 }, "tutorQuestionsPageTitle");
            } else {
                $('.add-question-div').show();
            }
        }
        else if (select.val() === "2") {
            let answered = $('#answeredQDiv');
            $('#addedDiv').addClass('hiddenDiv');
            $('#answeredDiv').removeClass('hiddenDiv');
            $('#followedDiv').addClass('hiddenDiv');
            if (answered.children().length <= 1) {
                AllQuestions('answeredQDiv', 'page-selection-answered', window.location.origin + '/TutorQuestion/GetTutorQuestions', { selectType: 2 }, "tutorQuestionsPageTitle");
            } else {
                $('.add-question-div').show();
            }
        }
        else if (select.val() === "3") {
            let followed = $('#followedQDiv');
            $('#addedDiv').addClass('hiddenDiv');
            $('#answeredDiv').addClass('hiddenDiv');
            $('#followedDiv').removeClass('hiddenDiv');
            if (followed.children().length <= 1) {
                AllQuestions('followedQDiv', 'page-selection-followed', window.location.origin + '/TutorQuestion/GetTutorQuestions', { selectType: 3 }, "tutorQuestionsPageTitle");
            } else {
                $('.add-question-div').show();
            }
        }
    }).trigger('change');

    let label = element.parents('div').find('label');
    label.text(globalTexts.chooseACategory);

    $('.AddQuestion').prepend(globalTexts.addAQuestion);
    $('.post-question').prepend(globalTexts.postQuestion);
    $('.reach-more').prepend(globalTexts.reachMore);
    $('.loader-wrapper').hide();

}

function GetDDL(DDLTarget, url, data = {}, createDDL = true, afterCreation = function () { }) {
    $.ajax({
        url: url,
        type: "POST",
        data: data,
        success: function (response) {
            let selectElement = undefined;
            let ddlTarget = document.getElementById(DDLTarget);
            if (createDDL) {
                selectElement = document.createElement('select');
                selectElement.setAttribute('id', DDLTarget + "Select");
                selectElement.classList.add("select-outline");
                selectElement.classList.add("ddlSelect");
                ddlTarget.appendChild(selectElement);
            } else {
                selectElement = ddlTarget;
                selectElement.classList.add("select-outline");
            }
            if (selectElement.tagName.toLowerCase() === "select") {
                response.content.forEach(function (option) {
                    
                    let opt = document.createElement("option");
                    opt.setAttribute('value', option.dataType);
                    opt.setAttribute('id', "opt" + option.dataType);
                    opt.innerHTML = option.lookupDetailsDescription;
                    selectElement.appendChild(opt);
                });
                //after creation of element initialize
                if (isFunction(afterCreation)) {
                    afterCreation(selectElement);
                }
            } else {
                console.error('Target DropDownList is not of type "SELECT"');
            }
        },
    });
}