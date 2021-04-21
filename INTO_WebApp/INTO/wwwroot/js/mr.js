$("#onlinePriceRange").slider({
    range: true,
    min: 0,
    max: 100,
    step: 5,
    slide: function (event, ui) {
        $(this).parent().parent().find("[data-role='range-min']").html(ui.values[0]);
        if (searchFilter !== null && searchFilter !== undefined) {
            searchFilter.MinOnlineHourRate = ui.values[0];
        }
        suffix = '';
        if (ui.values[1] === $(this).parent().parent().find("[data-role='range-max']").data('max')) {
            suffix = ' +';
        }
        $(this).parent().parent().find("[data-role='range-max']").html(ui.values[1] + suffix);
        if (searchFilter !== null && searchFilter !== undefined) {
            searchFilter.MaxOnlineHourRate = ui.values[1];
        }
    }
}).bind({
    slidestart: function (event, ui) { },
    slidechange: function (event, ui) {
        $(this).parent().parent().find("[data-role='range-min']").html(ui.values[0]);
        if (searchFilter !== null && searchFilter !== undefined) {
            searchFilter.MinOnlineHourRate = ui.values[0];
        }
        suffix = '';
        if (ui.values[1] === $(this).parent().parent().find("[data-role='range-max']").data('max')) {
            suffix = ' +';
        }
        $(this).parent().parent().find("[data-role='range-max']").html(ui.values[1] + suffix);
        if (searchFilter !== null && searchFilter !== undefined) {
            searchFilter.MaxOnlineHourRate = ui.values[1];
        }
 },
    slidestop   : function (event, ui) {},
});

$("#inPersonPriceRange").slider({
    range: true,
    min: 0,
    max: 100,
    step: 5,
    slide: function (event, ui) {
        $(this).parent().parent().find("[data-role='range-min']").html(ui.values[0]);
        if (searchFilter !== null && searchFilter !== undefined) {
            searchFilter.MinInPersonHourRate = ui.values[0];
        }
        suffix = '';
        if (ui.values[1] === $(this).parent().parent().find("[data-role='range-max']").data('max')) {
            suffix = ' +';
        }
        $(this).parent().parent().find("[data-role='range-max']").html(ui.values[1] + suffix);
        if (searchFilter !== null && searchFilter !== undefined) {
            searchFilter.MaxInPersonHourRate = ui.values[1];
        }
    }
}).bind({
    slidestart: function (event, ui) { },
    slidechange: function (event, ui) {
        $(this).parent().parent().find("[data-role='range-min']").html(ui.values[0]);
        if (searchFilter !== null && searchFilter !== undefined) {
            searchFilter.MinOnlineHourRate = ui.values[0];
        }
        suffix = '';
        if (ui.values[1] === $(this).parent().parent().find("[data-role='range-max']").data('max')) {
            suffix = ' +';
        }
        $(this).parent().parent().find("[data-role='range-max']").html(ui.values[1] + suffix);
        if (searchFilter !== null && searchFilter !== undefined) {
            searchFilter.MaxOnlineHourRate = ui.values[1];
        }
    },
    slidestop: function (event, ui) { },
});

$("#tutorAgeRange").slider({
    range: true,
    min: 20,
    max: 80,
    step: 1,
    slide: function (event, ui) {
        $(this).parent().parent().find("[data-role='range-min']").html(ui.values[0]);
        if (searchFilter !== null && searchFilter !== undefined) {
            searchFilter.MinTutorAge = ui.values[0];
        }
        suffix = '';
        if (ui.values[1] === $(this).parent().parent().find("[data-role='range-max']").data('max')) {
            suffix = ' +';
        }
        $(this).parent().parent().find("[data-role='range-max']").html(ui.values[1] + suffix);
        if (searchFilter !== null && searchFilter !== undefined) {
            searchFilter.MaxTutorAge = ui.values[1];
        }
    }
}).bind({
    slidestart: function (event, ui) { },
    slidechange: function (event, ui) {
        $(this).parent().parent().find("[data-role='range-min']").html(ui.values[0]);
        if (searchFilter !== null && searchFilter !== undefined) {
            searchFilter.MinOnlineHourRate = ui.values[0];
        }
        suffix = '';
        if (ui.values[1] === $(this).parent().parent().find("[data-role='range-max']").data('max')) {
            suffix = ' +';
        }
        $(this).parent().parent().find("[data-role='range-max']").html(ui.values[1] + suffix);
        if (searchFilter !== null && searchFilter !== undefined) {
            searchFilter.MaxOnlineHourRate = ui.values[1];
        }
    },
    slidestop: function (event, ui) { },
});