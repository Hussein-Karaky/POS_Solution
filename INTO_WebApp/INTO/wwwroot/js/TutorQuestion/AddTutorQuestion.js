let tutorid = accountManager.currentUser.id;

function AddTutorQuestion(datalist, input) {

    let pt = $("#pageTitle").text(globalTexts.addTutorQuestionPageTitle);

    let cardT = $("#cardTitle").text(globalTexts.addAQuestion);

    let questionTitleTxt = $('#txtTitle');
    questionTitleTxt.attr('placeholder', globalTexts.whatsYourQuestion);
    questionTitleTxt.siblings('label').text(globalTexts.questionTitle + ' (' + globalTexts.required + ')');

    let description = $('#summernote');
    description.attr('placeholder', globalTexts.addDetailsTutorQuestion);
    description.siblings('label').text(globalTexts.questionDescription + ' (' + globalTexts.optional + ')');

    let topics = $('#topics');
    topics.attr('placeholder', globalTexts.addAtLeastOneTopic);
    topics.siblings('label').text(globalTexts.addTopics + ' (' + globalTexts.required + ')')

    let btnAddQuestion = $('#btnAddQuestion').text(globalTexts.submitQuestion);

    let notice = $('#notice').text(globalTexts.makeSureTutorQuestion);

    description.summernote({
        height: 300,                 // set editor height
        minHeight: null,             // set minimum height of editor
        maxHeight: null,             // set maximum height of editor
        focus: true,
        placeholder: globalTexts.addDetailsTutorQuestion
    });
    btnAddQuestion.click(function () {
        let title = questionTitleTxt.val();
        let descriptionQ = description.summernote('code');
        let tags = topics.flexdatalist('value');
        let utags = [];
        $(tags).each(function (index, sm) {
            let newItem = { ID: 0, Name: sm, TQuestionId: 1 }
            utags.push(newItem);
        });
        let data = { title: title, description: descriptionQ, tutorId: tutorid, tagNames: JSON.stringify(utags) };
        $.ajax({
            url: window.location.origin.concat('/TutorQuestion/SubmitTutorQuestion'),
            type: 'post',
            dataType: 'json',
            data: data,
            success: function () {
                window.location = window.location.origin.concat("/TutorQuestion/TutorQuestion");
            },
            error: function () {
                alert('error');
            }
        });
    });

    $.ajax({
        url: window.location.origin + '/TutorQuestion/GetAllTags',
        type: "POST",
        data: {},
        success: function (response) {
            console.log(response)
            let datalistElement = document.getElementById(datalist);
            if (datalistElement.tagName.toLowerCase() === "datalist") {
                response.content.forEach(function (option) {
                    let opt = document.createElement("option");
                    opt.setAttribute('value', option);
                    opt.setAttribute('id-', "opt" + option);
                    opt.innerHTML = option;
                    datalistElement.appendChild(opt);
                });

            } else {
                console.error('Target Datalist is not of type "DATALIST"');
            }
            $('.flexdatalist').flexdatalist({
                minLength: 1
            });
            $('input.flexdatalist').on('show:flexdatalist.results', function (event, itens) {
                $('#' + input + '-flexdatalist').css('width', '');//fixes input width
            });
            $('.loader-wrapper').hide();

        },
    });

}