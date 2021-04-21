let questionId = 0;

function AllAnswers(
    creationTarget = null,
    dataSource = null,
    questionId = 0,
    dataSourceParams = {},
    selectorType = "div",
    childType = Answer
) {
    this.dataSourceParams = dataSourceParams;
    this.questionId = questionId;
    ParentNode.call(this,
        creationTarget,
        dataSource,
        selectorType,
        [],
        childType,
        null,
        {},
        {},
        undefined,
        undefined,
        undefined,
        false,
        this.dataSourceParams
    );

}
AllAnswers.extends(ParentNode);

AllAnswers.construct();

AllAnswers.prototype.dataBound = function () {
    let data = this.dat;
    let main = this;
    data.content.forEach(function (answer, index) {
        let a = new Answer(answer.id, answer.description, main.questionId,
            answer.uID, answer.firstName + " " + answer.lastName, answer.userImg,
            answer.answerLikesNumber, undefined,
            answer.answerDislikesNumber, undefined,
            answer.answerCommentsNumber, undefined,
            answer.liked, answer.isTutor);
        main.add(a);
    })
}

AllAnswers.prototype.dataBind = function (onsuccess = function (data, text) { }, onerror = function () { }) {
    ParentNode.prototype.dataBind.call(this,
        onsuccess, onerror);
};

AllAnswers.prototype.create = function (parameter) {
    if (this.creationTarget !== null && this.creationTarget.length > 0) {
        if (this.dat != undefined && this.dat != null) {
            let display = this.getDisplay();
            let target = document.getElementById(this.creationTarget);
            if (target !== null && display !== null) {
                target.appendChild(display);
                // Adding Listeners
                $('.likeIcon').click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    let likeIcon = $(this)
                    let div = likeIcon.closest('div');
                    let AId = div.attr('answer-id');
                    $.ajax({
                        url: window.location.origin.concat('/TutorQuestion/Vote'),
                        type: 'post',
                        dataType: 'json',
                        data: { TQuestionAnswerId: AId, UID: accountManager.currentUser.userId, ObjEntityId: 1, UpDownVote: 1 },
                        success: function (data) {
                            let p = div.find('span');
                            let dislike = div.siblings('.dislike');
                            let dislikeIcon = dislike.find('i');

                            if (parseInt(data) > 0) {
                                likeIcon.addClass('liked')
                                if (dislikeIcon.hasClass('disliked')) {
                                    let pd = dislike.find('span');
                                    pd.text((parseInt(pd.text()) - 1));
                                }
                                p.text((parseInt(p.text()) + 1));
                            } else {
                                likeIcon.removeClass('liked');
                                p.text((parseInt(p.text()) - 1));

                            }
                            dislikeIcon.removeClass('disliked');


                        },
                        error: function () {
                            alert('error');
                        }
                    });
                });
                $('.dislikeIcon').click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    let dislikeIcon = $(this);
                    let div = dislikeIcon.closest('div');
                    let AId = div.attr('answer-id');
                    $.ajax({
                        url: window.location.origin.concat('/TutorQuestion/Vote'),
                        type: 'post',
                        dataType: 'json',
                        data: { TQuestionAnswerId: AId, UID: accountManager.currentUser.userId, ObjEntityId: 1, UpDownVote: 0 },
                        success: function (data) {
                            let p = div.find('span');
                            let like = div.siblings('.like');
                            let likeIcon = like.find('i');
                            if (parseInt(data) > 0) {
                                dislikeIcon.addClass('disliked')
                                if (likeIcon.hasClass('liked')) {
                                    let pl = like.find('span');
                                    pl.text((parseInt(pl.text()) - 1));
                                }
                                p.text((parseInt(p.text()) + 1));
                            } else {
                                dislikeIcon.removeClass('disliked');
                                p.text((parseInt(p.text()) - 1));

                            }
                            likeIcon.removeClass('liked');
                        },
                        error: function () {
                            alert('error');
                        }
                    });
                });
                $('.like').click(function () {
                    let div = $(this);
                    let AId = div.attr('answer-id');
                    $.ajax({
                        url: window.location.origin.concat('/TutorQuestion/GetLikersByQuestionAnswerId'),
                        type: 'post',
                        dataType: 'json',
                        data: { TutorQuestionAnswerId: AId },
                        success: function (data) {
                            let mainDiv = document.createElement('div');
                            if (data.content.length > 0) {
                                data.content.forEach(function (user) {
                                    mainDiv.appendChild(makeUserDiv(user.firstName + " " + user.lastName, user.userImg, user.objEntityId == 1));
                                });
                            }
                            else {
                                mainDiv.appendChild(document.createTextNode(globalTexts.noLikersYet));
                            }
                            Swal.fire({
                                html: mainDiv.outerHTML,
                                title: globalTexts.likers,
                                confirmButtonText: globalTexts.close,
                            });
                        },
                        error: function () {
                            alert('error: couldn\'t get likers');
                        }
                    });
                });
                $('.dislike').click(function () {
                    let div = $(this);
                    let AId = div.attr('answer-id');
                    $.ajax({
                        url: window.location.origin.concat('/TutorQuestion/GetDisLikersByQuestionAnswerId'),
                        type: 'post',
                        dataType: 'json',
                        data: { TutorQuestionAnswerId: AId },
                        success: function (data) {
                            let mainDiv = document.createElement('div');
                            if (data.content.length > 0) {
                                data.content.forEach(function (user) {
                                    mainDiv.appendChild(makeUserDiv(user.firstName + " " + user.lastName, user.userImg, user.objEntityId == 1));
                                });
                            }
                            else {
                                mainDiv.appendChild(document.createTextNode(globalTexts.noDislikersYet));
                            }
                            Swal.fire({
                                html: mainDiv.outerHTML,
                                title: globalTexts.dislikers,
                                confirmButtonText: globalTexts.close,
                            });
                        },
                        error: function () {
                            alert('error: couldn\'t get dislikers');
                        }
                    });
                });
                $('.open-answer-comment').click(function () {
                    let aid = $(this).attr('answer-id');
                    let cmntDiv = $('#MainDivAnswerComments-' + aid);
                    let comments = cmntDiv.find('#DivAnswerComments-' + aid);
                    if (comments.children().length < 1) {
                        $.ajax({
                            url: window.location.origin.concat('/TutorQuestion/GetCommentsByQuestionAnswerId'),
                            type: 'post',
                            dataType: 'json',
                            data: { TutorQuestionAnswerId: aid },
                            success: function (data) {
                                data.content.forEach(function (comment) {
                                    comments.append(makeComment(comment.firstName + " " + comment.lastName, comment.userImg, comment.description, comment.objEntityId == 1));
                                });

                            },
                            error: function () {
                                alert('error');
                            }
                        });
                    }

                    cmntDiv.toggleClass('hiddenDiv');

                });

                $('.addAnswerComment').click(function () {
                    let AId = $(this).attr('answer-id');
                    let cmntDiv = $('#MainDivAnswerComments-' + AId);
                    let txtId = $('#txtTutorQuestionAnswerComment-' + AId);
                    let comments = cmntDiv.find('#DivAnswerComments-' + AId);
                    let description = txtId.val();
                    $.ajax({
                        url: window.location.origin.concat('/TutorQuestion/SubmitTutorQuestionAnswerComment'),
                        type: 'post',
                        dataType: 'json',
                        data: { TQuestionAnswerId: AId, UID: accountManager.currentUser.userId, ObjEntityId: accountManager.currentUser.entityType, Description: description },
                        success: function (data) {
                            txtId.val(null);
                            $(data).each(function (index, comment) {
                                comments.append(makeComment(comment.firstName + " " + comment.lastName, comment.userImg, comment.description, comment.objEntityId == 1));
                            });
                            comments.animate({ scrollTop: comments[0].scrollHeight }, 1000);
                            let nbCmnts=cmntDiv.siblings('.row').find('.nb-cmnts');
                            console.log(nbCmnts);
                            nbCmnts.text(parseInt(nbCmnts.text())+1);
                        },
                        error: function () {
                            alert('error');
                        }
                    });
                });
                $('.loader-wrapper').hide();
            }
        }
    }
}

AllAnswers.prototype.getDisplay = function () {
    let divMiddle = document.createElement("div");
    // appending the children
    if (this.children.length > 0) {
        this.children.forEach(function (child) {
            let childDiv = child.getDisplay();
            divMiddle.appendChild(childDiv);
        });
    } else {
        divMiddle.appendChild(makeDataNotFound(globalTexts.notAnsweredYet, { "text-align": "center" }, 1));
    }
    return divMiddle;
}

function Answer(
    answerId = Math.random() * 20000,
    Description = "",
    questionId = 0,
    userId = 0,
    userName = "",
    userImg = "",
    nbOfLikes = 0,
    answerLikers = [],
    nbOfDislikes = 0,
    answerDislikers = [],
    nbOfComments = 0,
    answerComments = [],
    // 0 no action occurred, 1 liked, -1 disliked
    liked = 0,
    isTutor = false

) {
    this.questionId = questionId;
    this.answerId = answerId;
    this.answerDescription = Description;
    this.userId = userId;
    this.userName = userName;
    this.userImg = userImg;
    this.nbOfLikes = nbOfLikes;
    this.answerLikers = answerLikers;
    this.nbOfDislikes = nbOfDislikes;
    this.answerDislikers = answerDislikers;
    this.nbOfComments = nbOfComments;
    this.answerComments = answerComments;
    this.liked = liked;
    this.isTutor = isTutor;
}

Answer.extends(Node);

Answer.construct();

Answer.prototype.create = function () { }

Answer.prototype.dataBound = function () { }

Answer.prototype.dataBind = function (onsuccess = function (data, text) { }, onerror = function () { }) {
    Node.prototype.dataBind.call(this,
        onsuccess, onerror);
};

Answer.prototype.getDisplay = function () {
    let answer = this;

    let DivAnswer = document.createElement("div");
    DivAnswer.classList.add("card", "mb-4", "wow", "fadeIn", "full-width");
    DivAnswer.setAttribute('id', "DivAnswer");
    DivAnswer.setAttribute('answer-id', answer.answerId);
    DivAnswer.setAttribute('question-id', "qid" + answer.questionId);



    let userDiv = document.createElement('div');
    userDiv.classList.add("card-header", "font-weight-bold");
    userDiv.appendChild(makeUserDiv(answer.userName, answer.userImg, user.isTutor));

    let descDiv = document.createElement("div");
    descDiv.classList.add("card-body");
    descDiv.innerHTML = answer.answerDescription;

    // voting and comments
    let voteDiv = document.createElement("div");
    voteDiv.classList.add("card-footer", "font-weight-bold");

    let innerDiv = document.createElement("div");
    innerDiv.classList.add("row");



    // like Div

    let likeDiv = document.createElement("div");
    likeDiv.classList.add("pull-left", "HandCursor", "Vote", "mr-2", "like");

    likeDiv.setAttribute('answer-id', answer.answerId);

    let h5Like = document.createElement("h5");
    h5Like.classList.add("text-info");

    let likeSpan = document.createElement("i");
    likeSpan.classList.add("fa", "fa-thumbs-up", 'likeIcon');
    likeSpan.setAttribute('title', globalTexts.like);
    h5Like.appendChild(likeSpan);
    let nblikesText = document.createElement('span');
    nblikesText.innerHTML = answer.nbOfLikes;
    nblikesText.classList.add("ml-2", 'likers');
    h5Like.appendChild(nblikesText);
    likeDiv.appendChild(h5Like);

    // Dislike Div

    let dislikeDiv = document.createElement("div");
    dislikeDiv.classList.add("pull-left", "HandCursor", "Vote", "mr-2", "dislike");

    dislikeDiv.setAttribute('answer-id', answer.answerId);

    let h5Dislike = document.createElement("h5");
    h5Dislike.classList.add("text-info");

    let dislikeSpan = document.createElement("i");
    dislikeSpan.classList.add("fa", "fa-thumbs-down", 'dislikeIcon');
    dislikeSpan.setAttribute('title', globalTexts.dislike);
    h5Dislike.appendChild(dislikeSpan);
    let nbDislikesText = document.createElement('span');
    nbDislikesText.className = "ml-2";
    nbDislikesText.innerHTML = answer.nbOfDislikes;
    h5Dislike.appendChild(nbDislikesText);
    dislikeDiv.appendChild(h5Dislike);

    // Comments Div
    let commentDiv = document.createElement("div");
    commentDiv.classList.add("pull-left", "HandCursor", "showAnswerCommentDiv", "open-answer-comment");

    commentDiv.setAttribute('answer-id', answer.answerId);

    let h5Comment = document.createElement("h5");
    h5Comment.classList.add("text-info");

    let commentSpan = document.createElement("i");
    commentSpan.classList.add("fa", "fa-comment-medical");
    commentSpan.setAttribute('title', globalTexts.addComment);

    commentText = document.createElement('span');
    commentText.className = 'ml-2';
    commentText.innerHTML = globalTexts.addComment;

    nbCommentText = document.createElement('span');
    nbCommentText.classList.add('ml-2', 'nb-cmnts');
    nbCommentText.innerHTML = answer.nbOfComments;

    h5Comment.appendChild(commentSpan);
    h5Comment.appendChild(commentText);
    h5Comment.appendChild(nbCommentText);
    commentDiv.appendChild(h5Comment);

    // appending the divs to one
    innerDiv.appendChild(likeDiv);
    innerDiv.appendChild(dislikeDiv);
    innerDiv.appendChild(commentDiv);
    voteDiv.appendChild(innerDiv);

    //Comments Div

    let mainCmntDiv = document.createElement("div");
    mainCmntDiv.classList.add("hiddenDiv");
    mainCmntDiv.setAttribute('id', "MainDivAnswerComments-" + answer.answerId);

    let cmtDiv = document.createElement('div');
    cmtDiv.setAttribute('id', "DivAnswerComments-" + answer.answerId);
    cmtDiv.classList.add("row", "comment-box");

    // add comment section
    let addCmntDiv = document.createElement('div');
    addCmntDiv.classList.add("row");

    let cmntDivId = document.createElement("div");
    cmntDivId.setAttribute('id', "DivAddedTutorQuestionAnswerComments-" + answer.answerId);

    let cmtInputDiv = document.createElement("div");
    cmtInputDiv.classList.add('full-width', 'text-right');

    let input = document.createElement("input");
    input.type = "text";
    input.classList.add("form-control");
    input.setAttribute('id', "txtTutorQuestionAnswerComment-" + answer.answerId);
    input.placeholder = globalTexts.addYourCommentHere;

    let button = document.createElement("input");
    button.type = "button";
    button.classList.add("btn", "btn-info", "text-white", "addAnswerComment");
    button.setAttribute('answer-id', answer.answerId);
    button.value = globalTexts.addComment;

    let spanCmnt = document.createElement("span");
    spanCmnt.classList.add("fa", "fa-comment-medical", "ml-1");

    button.innerHTML = globalTexts.addComment;
    button.appendChild(spanCmnt);

    cmtInputDiv.appendChild(input);
    cmtInputDiv.appendChild(button);

    addCmntDiv.appendChild(cmntDivId);
    addCmntDiv.appendChild(cmtInputDiv);


    mainCmntDiv.appendChild(cmtDiv);
    mainCmntDiv.appendChild(addCmntDiv);

    // appending to the main div of the loop
    DivAnswer.appendChild(userDiv);
    DivAnswer.appendChild(descDiv);
    voteDiv.appendChild(mainCmntDiv);
    DivAnswer.appendChild(voteDiv);

    switch (answer.liked) {
        case 1:
            likeSpan.classList.add("liked");
            break;
        case -1:
            dislikeSpan.classList.add("disliked");
            break;

    }

    return DivAnswer;
};

function getQuestion(qDivId) {
    let qDiv = $('#' + qDivId);
    $.ajax({
        url: window.location.origin.concat('/TutorQuestion/GetQuestion'),
        type: 'post',
        dataType: 'json',
        data: { UID: accountManager.currentUser.userId, TQuestionId: questionId },
        success: function (data) {
            let qTitle = $('#Qtitle').children('h1');
            qDiv = qDiv.children('.card');
            let qHeader = qDiv.children('.card-header');
            let qBody = qDiv.children('.card-body');
            let qFooter = qDiv.children('.card-footer');
            let qFollows = qFooter.find('#DivFollow').children('h5');
            let qCmnts = qFooter.find('#AddCommentDiv').children('h5');
            let qYourTopics = $('#yourTopics');
            let qOtherTopics = $('#otherTopics');
            let question = data.content;
            let tags = JSON.parse(data.extras.otherTopics);
            if (question === undefined || question === null) {
                window.location = window.location.origin
            }
            qTitle.text(question.title);

            let userDiv = document.createElement('div');
            userDiv.classList.add('col-12');
            userDiv.appendChild(makeUserDiv(question.firstName + " " + question.lastName, question.userImg, true))


            let tagsDiv = document.createElement('div');
            tagsDiv.classList.add('col-12', "text-right");

            if (question.tags.length > 0) {
                question.tags.forEach(function (tag) {
                    tagsDiv.append(makeTag(tag.name));
                    qYourTopics.append(makeTag(tag.name));
                });
            } else {
                qYourTopics.append(makeDataNotFound(globalTexts.noTopicsFound, {}, 5));
            }

            qYourTopics.siblings('#yourTopicsTitle').text(globalTexts.yourTopics);

            qHeader.append(userDiv)
            qHeader.append(tagsDiv)


            if (tags.length > 0) {
                tags.forEach(function (tag) {
                    qOtherTopics.append(makeTag(tag.Name));
                });
            } else {
                qOtherTopics.append(makeDataNotFound(globalTexts.errorNotFound, { color: '#FF0000' }, 5));
            }

            qOtherTopics.siblings('#otherTopicsTitle').text(globalTexts.otherTopics);


            let divOut = document.createElement("div");
            divOut.classList.add("media", "d-block", "d-md-flex", "mt-3");

            let divIn = document.createElement("div");
            divIn.classList.add("media-body", "text-center", "text-md-left", "ml-md-3", "ml-0");

            let ques = document.createElement("h5");
            ques.classList.add("mt-0", "font-weight-bold");

            let quesTitle = document.createElement('h5');
            quesTitle.appendChild(document.createTextNode(question.title));
            ques.innerHTML = quesTitle.outerHTML + question.description;

            divIn.appendChild(ques);
            divOut.appendChild(divIn);

            qBody.append(divOut);

            qFooter.find('#addAnswerDiv').append(globalTexts.addAnswer);
            qFollows.append(document.createTextNode((question.isFollowing ? globalTexts.following : globalTexts.follow)));

            let cNumber = document.createElement("span");
            cNumber.classList.add("ml-2");
            cNumber.innerHTML = question.commentsNumber;

            qCmnts.append(document.createTextNode(globalTexts.addComment)).append(cNumber);

            let cmntInput = $('#txtTutorQuestionComment');
            cmntInput.attr('placeholder', globalTexts.addYourCommentHere);

            let addCmntBtn = $('#btnAddTutorQuestionComment');
            addCmntBtn.append(globalTexts.addComment);

            qFollows.on('click', function () {
                $.ajax({
                    url: window.location.origin.concat('/TutorQuestion/Follow'),
                    type: 'post',
                    dataType: 'json',
                    data: { TQuestionId: questionId, UID: accountManager.currentUser.userId, ObjEntityId: accountManager.currentUser.entityType },
                    success: function (data) {
                        if (parseInt(data) > 0) {
                            qFollows.empty().append(document.createTextNode(globalTexts.following));
                        } else {
                            qFollows.empty().append(document.createTextNode(globalTexts.follow));
                        }
                        getFollowers('followersDiv');
                    },
                    error: function () {
                        alert('error');
                    }
                });
            });

            qCmnts.click(function () {
                let cmntDiv = $('#DivComments');
                let comments = cmntDiv.find(".comment-box");
                if (comments.children().length < 1) {
                    $.ajax({
                        url: window.location.origin.concat('/TutorQuestion/GetCommentsByQuestionId'),
                        type: 'post',
                        dataType: 'json',
                        data: { TQuestionId: questionId },
                        success: function (data) {
                            data.content.forEach(function (comment) {
                                comments.append(makeComment(comment.firstName + " " + comment.lastName, comment.userImg, comment.description, comment.objEntityId == 1));
                            });
                        },
                        error: function () {
                            alert('error');
                        }
                    });
                }
                cmntDiv.toggleClass('hiddenDiv');
            });

            $('#btnAddTutorQuestionComment').click(function () {
                let cmntDiv = $('#DivComments');
                let comments = cmntDiv.find(".comment-box");
                let description = $('#txtTutorQuestionComment').val();
                $.ajax({
                    url: window.location.origin.concat('/TutorQuestion/SubmitTutorQuestionComment'),
                    type: 'post',
                    dataType: 'json',
                    data: { TQuestionId: questionId, UID: accountManager.currentUser.userId, ObjEntityId: accountManager.currentUser.entityType, Description: description },
                    success: function (data) {
                        $('#txtTutorQuestionComment').val("");
                        $(data).each(function (index, comment) {
                            comments.append(makeComment(comment.firstName + " " + comment.lastName, comment.userImg, comment.description, comment.objEntityId == 1));
                            cNumber.innerHTML = (parseInt(cNumber.innerHTML) + 1);
                        });
                        comments.animate({ scrollTop: comments[0].scrollHeight }, 1000);
                    },
                    error: function () {
                        alert('error');
                    }
                });
            });

            $('#btnAddAnswer').click(function () {
                let description = $('#summernote').val();
                $.ajax({
                    url: window.location.origin.concat('/TutorQuestion/SubmitTutorQuestionAnswer'),
                    type: 'post',
                    dataType: 'json',
                    data: { TQuestionId: questionId, description: description, UID: accountManager.currentUser.userId, ObjEntityId: accountManager.currentUser.entityType },
                    success: function () {
                        window.location.reload();
                    },
                    error: function () {
                        alert('error');
                    }
                });
            });

        },
        error: function () {
            alert('error');
        }
    });
}

function getFollowers(fDivId) {
    fDiv = $('#' + fDivId);
    fDivTitle = fDiv.siblings('.card-header');
    $.ajax({
        url: window.location.origin.concat('/TutorQuestion/GetFollowersByQuestionId'),
        type: 'post',
        dataType: 'json',
        data: { TutorQuestionId: questionId },
        success: function (data) {
            fDiv.empty();
            data.content.forEach(function (follower) {
                fDiv.append(makeUserDiv(follower.firstName + " " + follower.lastName, follower.userImg, follower.objEntityId == 1));
            });
            fDivTitle.empty().append('<h3>' + globalTexts.followers + ': ' + data.content.length + '</h3>');
        },
        error: function () {
            alert('error');
        }
    });
}

function AddTutorQuestionAnswer() {
    let pt = $('#pageTitle').text(globalTexts["addTutorQuestionAnswerPageTitle"]);
    let addAnswerDiv = $('#AddAnswerDiv');
    addAnswerDiv.find('label').text(globalTexts.addYourAnswer);
    addAnswerDiv.find('button').text(globalTexts.submitAnswer);
    let qid = window.location.pathname;
    qid = qid.split("/");
    let length = qid.length - 1;
    questionId = length > 0 ? qid[length] : 0;
    $('#summernote').attr('placeholder', globalTexts.typeYourAnswer).summernote({
        height: 300,                 // set editor height
        minHeight: null,             // set minimum height of editor
        maxHeight: null,             // set maximum height of editor
        focus: true,
        placeholder: globalTexts.typeYourAnswer
    });
    getQuestion('QuestionDiv');
    getFollowers('followersDiv');
    let allAns = new AllAnswers('AnswersDiv', window.location.origin + '/TutorQuestion/GetTutorQuestionAnswers', questionId, { UID: accountManager.currentUser.userId, TQuestionId: questionId });
    allAns.dataBind();
}
