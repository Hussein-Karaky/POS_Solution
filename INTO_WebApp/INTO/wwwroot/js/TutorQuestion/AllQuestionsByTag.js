$(document).ready(AllQuestionsByTag);
function AllQuestionsByTag() {  
    $('.hoverborder').click(function () {
        let x = $(this).attr('question-id');
        let tid = $(this).attr('tutor-id');
        let url = '/TutorQuestion/AddTutorQuestionAnswer/' + x;        
        window.location=window.location.origin.concat(url);
    });
    $('.TopicToGetQuestion').click(function () {
        let x = $(this).html();
        // pageNumber = 1, pageSize = 5, TagName= x
        let url = '/TutorQuestion/AllQuestionsByTag/' + x;                
        window.location=window.location.origin.concat(url);
    });
}
