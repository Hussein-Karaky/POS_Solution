var stepsWiz = null;
var validAnswer = false;
var messages = [
    "Are you on rush? it's seems you didn't concentrate well on the text!",
    "If you're not comfortable with the text's language, you can switch to another one up here!",
    "Come on! the content provided hereby is not any kind of complex!",
    "But, are you serious?!",
    "Hurry up, some interesting career path is just waiting for you dear!",
    "If you prefer you can postpone this for later, but some French say 'Qui va à la chasse perd sa place'!"
                ];
$(function () {
    stepsWiz = $("#form-total").steps({
        headerTag: "h2",
        bodyTag: "section",
        transitionEffect: "fade",
        enableAllSteps: false,
        stepsOrientation: "vertical",
        autoFocus: true,
        transitionEffectSpeed: 300,
        titleTemplate: '<div class="title">#title#</div>',
        labels: {
            previous: 'Back Step',
            next: 'Next',
            finish: 'Submit',
            current: ''
        },
        onStepChanging: function (event, currentIndex, newIndex) {
            validAnswer = validAnswer || (validate(event, currentIndex, newIndex));
            if (!validAnswer) {
                if ($('section.current [data-role="input-answer"]:checked').length === 0) {
                    swalInit.fire({
                        text: 'Please select an option',
                        type: 'warning',
                        toast: true,
                        position: 'top-right'
                    });
                    return false;
                }
                return handleAnswer();
            }
                return true;
        },
        onStepChanged: function (event, currentIndex, priorIndex) {
            validAnswer = false;
        },
        onFinishing: function (event, currentIndex) {
            validAnswer = validAnswer || (validate(event, currentIndex));
            if (!validAnswer) {
                if ($('section.current [data-role="input-answer"]:checked').length === 0) {
                    return false;
                }
                return handleAnswer();
            }
            return true;
        },
        onFinished: function (event, currentIndex) {
            new AjaxCaller(function (data, text) {
                new AjaxCaller(function (data, text) {
                    if (data !== null && String.isString(data.uiName) && data.uiName.length > 0) {
                        window.location.href = window.location.origin.concat("/tutor/").concat(data.uiName);
                    }
                }, function (request, status, error) {
                    console.error(request.responseText);
                }).postWithPromise(nextTutorStep());
            }, function (request, status, error) {
                console.error(request.responseText);
            }).postWithPromise(completeTutorStep());
        }
    });
});

validate = function (event, currentIndex, newIndex) {
    let ctrl = $('section.current');
    if (ctrl.find('[data-role="input-answer"]').length > 0) {
        return ctrl.find('[data-role="input-answer"]:checked').length !== 0 && ctrl.find('[data-role="input-answer"]:checked').val() === "true";
    }
    return true;
};

handleAnswer = function () {
    if (!validAnswer) {
        swalInit.fire({
            text: messages[randomIndex()],
            type: 'warning',
            toast: true,
            position: 'top-right'
        });

        validAnswer = true;
        stepsWiz.steps("previous");
    }
    return false;
};