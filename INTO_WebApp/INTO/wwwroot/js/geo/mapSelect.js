var cryMap = null;
$(document).ready(function () {
    if (waiting) {
        accountManager.start();
    }
    cryMap = new svgMap({
        targetElementID: 'svgMapPopulation',
        data: svgMapDataPopulation,
        flagType: 'emoji'
    });
    let map = document.getElementById("svgMapPopulation");
    map.addEventListener("click", function (e) {
        let ddlCountries = document.getElementById("txtCountry");
        ddlCountries.options.forEach(o => { if (o.getAttribute("data-code") === cId) { ddlCountries.selectedIndex = o.index; ddlCountries.dispatchEvent(new Event("change")); } });
    });
});