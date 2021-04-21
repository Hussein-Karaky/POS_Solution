
function TutorQuestion() {  
    $('.hoverborder').click(function () {        
        let x = $(this).attr('question-id');
        let tid = $(this).attr('tutor-id');
        let url = '/TutorQuestion/AddTutorQuestionAnswer/' + x;        
        window.location=window.location.origin.concat(url);
    });
    console.log($('#selectQuestiontype'));
    $('#selectQuestiontype').on('change', function () {
        console.log(this);
        let select = $(this);
        console.log(select.val());
        if (select.val() === "1") {
            $('#QuestionAddedDiv').show();
            $('#QuestionAnsweredDiv').hide();
            $('#QuestionFollowedDiv').hide();
        }
        else if (select.val() === "2") {
            $('#QuestionAddedDiv').hide();
            $('#QuestionAnsweredDiv').show();
            $('#QuestionFollowedDiv').hide();
        }
        else if (select.val() === "3") {
            $('#QuestionAddedDiv').hide();
            $('#QuestionAnsweredDiv').hide();
            $('#QuestionFollowedDiv').show();
        }
    }).trigger('change');

    $('.TopicToGetQuestion').click(function () {
        let x = $(this).html();
        // pageNumber = 1, pageSize = 5, TagName= x
        let url = '/TutorQuestion/AllQuestionsByTag/' + x;                
        window.location=window.location.origin.concat(url);
    });

    $('#btnAddAnswerGoPage').click(function () {                        
        window.location=window.location.origin.concat("/TutorQuestion/AddTutorQuestion");
    });
}

