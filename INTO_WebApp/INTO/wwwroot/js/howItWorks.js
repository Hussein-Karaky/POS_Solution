$(document).ready(function () {
    //$('.stepper').mdbStepper();
    $("#example-vertical").steps({
        headerTag: "h3",
        bodyTag: "section",
        transitionEffect: "slideLeft",
        stepsOrientation: "vertical"
    });
    $('input[data-role="input-answer"]').on("change", function () {
        if ($(this).val() === 'true') {
            $(this).parent().parent().find('[data-role="input-answer-code"]').val("true");
        } else {
            $(this).parent().parent().find('[data-role="input-answer-code"]').val("");
        }
    });
});

validateStep = function () {
    $('[data-role="input-answer-code"]').each(function () {
        if ($(this).val() !== "true") {
            return false;
        }
    });
    return true;
};

