$(document).ready(function () {
    accountManager.time.timezoneOffset = accountManager.time.date.getTimezoneOffset();
    if ($('[data-role=date-time]').length > 0) {
        $('[data-role=date-time]').bootstrapMaterialDatePicker({
            format: 'YYYY-MM-DD HH:mm',
            nowButton: true
        });
    }
    if ($('[data-role=date]').length > 0) {
        $('[data-role=date]').bootstrapMaterialDatePicker({
            time: false,
            nowButton: true
        });
    }
    if ($('[data-role=time]').length > 0) {
        $('[data-role=time]').bootstrapMaterialDatePicker({
            date: false,
            format: 'HH:mm'
        });
    }
});