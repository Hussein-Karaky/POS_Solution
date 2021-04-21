$(document).ready(function () {
    //$('.stepper').mdbStepper();
    let caller = new AjaxCaller(function (data, text) {
        //console.log(data);

        data.forEach(d => {
            let pill = pillTemplate(d);
            document.querySelector(".pill-container nav ul").appendChild(pill);
        });
        $("[data-rel='" + pageName + "']").addClass("active");
    }, function (request, status, error) {
        console.error(request.responseText);
    });
    caller.postWithPromise(buildTutorStepsRequest());
});
window.addEventListener("beforeunload", function () {
    new AjaxCaller(function (data, text) {
        console.log("Visited" + data);
    }, function (request, status, error) {
        console.error(request.responseText);
    }).postWithPromise(visitTutorStep());
});

pillTemplate = function (d) {
    let main = document.createElement("li");
    //["fit", "col-2"].forEach(cls => main.classList.add(cls));
    let a = document.createElement("a");
    a.href = window.location.origin.concat("/").concat("tutor").concat("/").concat(d.uiName);
    ["badge-pill", "nav-link", "no-shadow", "show", "pt-4"].forEach(cls => a.classList.add(cls));
    if (d.visited === true) {
        if (d.completed) {
            a.classList.add("success");
        } else {
            a.classList.add("missing");
        }
    }
    a.setAttribute("data-rel", d.uiName);
    let spn = document.createElement("span");
    ["badge", "square-24"].forEach(cls => spn.classList.add(cls));
    spn.appendChild(document.createElement("span"));
    let b = document.createElement("b");
    let label = document.createElement("span");
    ["text", "block", "mt-1"].forEach(cls => label.classList.add(cls));
    label.innerHTML = d.stepDescription;

    b.appendChild(window[d.uiName]().getDisplay());
    b.appendChild(label);
    a.appendChild(spn);
    a.appendChild(b);
    main.appendChild(a);
    return main;
};

pillTemplateOld = function (d) {
    let main = document.createElement("span");
    ["fit", "col-2"].forEach(cls => main.classList.add(cls));
    let a = document.createElement("a");
    a.href = window.location.origin.concat("/").concat("tutor").concat("/").concat(d.uiName);
    ["badge-pill", "nav-link", "no-shadow", "show", "pt-4"].forEach(cls => a.classList.add(cls));
    if (d.completed) {
        a.classList.add("success");
    }
    a.setAttribute("data-rel", d.uiName);
    let spn = document.createElement("span");
    ["badge", "square-24"].forEach(cls => spn.classList.add(cls));
    spn.appendChild(document.createElement("span"));
    let b = document.createElement("b");
    let label = document.createElement("span");
    ["text", "block", "mt-1"].forEach(cls => label.classList.add(cls));
    label.innerHTML = d.stepDescription;

    b.appendChild(window[d.uiName]().getDisplay());
    b.appendChild(label);
    a.appendChild(spn);
    a.appendChild(b);
    main.appendChild(a);
    return main;
};

Pending = function () {
    let path = new SVGPath(null, null, null, null, null, "M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 12v-6h-2v8h7v-2h-5z");
    let svg = new SVG(null, null, "currentColor", null, null, "0 0 24 24", 24, 24);
    svg.add(path);
    return svg;
};

Preferences = function () {
    let path = new SVGPath(null, null, null, null, null, "M6 18h-2v5h-2v-5h-2v-3h6v3zm-2-17h-2v12h2v-12zm11 7h-6v3h2v12h2v-12h2v-3zm-2-7h-2v5h2v-5zm11 14h-6v3h2v5h2v-5h2v-3zm-2-14h-2v12h2v-12z");
    let svg = new SVG(null, null, "currentColor", null, null, "0 0 24 24", 24, 24);
    svg.add(path);
    return svg;
};

Subjects = function () {
    let path = new SVGPath(null, null, null, null, null, "M5.495 2h16.505v-2h-17c-1.656 0-3 1.343-3 3v18c0 1.657 1.344 3 3 3h17v-20h-16.505c-1.376 0-1.376-2 0-2zm.505 4h7v7l2-2 2 2v-7h3v16h-14v-16z");
    let svg = new SVG(null, null, "currentColor", null, null, "0 0 24 24", 24, 24);
    svg.add(path);
    return svg;
};

HowINTOWorks = function () {
    let path = new SVGPath(null, null, null, null, null, "M17 10.645v-2.29c-1.17-.417-1.907-.533-2.28-1.431-.373-.9.07-1.512.6-2.625l-1.618-1.619c-1.105.525-1.723.974-2.626.6-.9-.373-1.017-1.116-1.431-2.28h-2.29c-.412 1.158-.53 1.907-1.431 2.28h-.001c-.9.374-1.51-.07-2.625-.6l-1.617 1.619c.527 1.11.973 1.724.6 2.625-.375.901-1.123 1.019-2.281 1.431v2.289c1.155.412 1.907.531 2.28 1.431.376.908-.081 1.534-.6 2.625l1.618 1.619c1.107-.525 1.724-.974 2.625-.6h.001c.9.373 1.018 1.118 1.431 2.28h2.289c.412-1.158.53-1.905 1.437-2.282h.001c.894-.372 1.501.071 2.619.602l1.618-1.619c-.525-1.107-.974-1.723-.601-2.625.374-.899 1.126-1.019 2.282-1.43zm-8.5 1.689c-1.564 0-2.833-1.269-2.833-2.834s1.269-2.834 2.833-2.834 2.833 1.269 2.833 2.834-1.269 2.834-2.833 2.834zm15.5 4.205v-1.077c-.55-.196-.897-.251-1.073-.673-.176-.424.033-.711.282-1.236l-.762-.762c-.52.248-.811.458-1.235.283-.424-.175-.479-.525-.674-1.073h-1.076c-.194.545-.25.897-.674 1.073-.424.176-.711-.033-1.235-.283l-.762.762c.248.523.458.812.282 1.236-.176.424-.528.479-1.073.673v1.077c.544.193.897.25 1.073.673.177.427-.038.722-.282 1.236l.762.762c.521-.248.812-.458 1.235-.283.424.175.479.526.674 1.073h1.076c.194-.545.25-.897.676-1.074h.001c.421-.175.706.034 1.232.284l.762-.762c-.247-.521-.458-.812-.282-1.235s.529-.481 1.073-.674zm-4 .794c-.736 0-1.333-.597-1.333-1.333s.597-1.333 1.333-1.333 1.333.597 1.333 1.333-.597 1.333-1.333 1.333zm-4 3.071v-.808c-.412-.147-.673-.188-.805-.505s.024-.533.212-.927l-.572-.571c-.389.186-.607.344-.926.212s-.359-.394-.506-.805h-.807c-.146.409-.188.673-.506.805-.317.132-.533-.024-.926-.212l-.572.571c.187.393.344.609.212.927-.132.318-.396.359-.805.505v.808c.408.145.673.188.805.505.133.32-.028.542-.212.927l.572.571c.39-.186.608-.344.926-.212.318.132.359.395.506.805h.807c.146-.409.188-.673.507-.805h.001c.315-.131.529.025.924.213l.572-.571c-.186-.391-.344-.609-.212-.927s.397-.361.805-.506zm-3 .596c-.552 0-1-.447-1-1s.448-1 1-1 1 .447 1 1-.448 1-1 1z");
    let svg = new SVG(null, null, "currentColor", null, null, "0 0 24 24", 24, 24);
    svg.add(path);
    return svg;
};

BasicInformation = function () {
    let path = new SVGPath(null, null, null, null, null, "M13 16h-2v-6h2v6zm-1-10.25c.69 0 1.25.56 1.25 1.25s-.56 1.25-1.25 1.25-1.25-.56-1.25-1.25.56-1.25 1.25-1.25zm0-2.75c5.514 0 10 3.592 10 8.007 0 4.917-5.145 7.961-9.91 7.961-1.937 0-3.383-.397-4.394-.644-1 .613-1.595 1.037-4.272 1.82.535-1.373.723-2.748.602-4.265-.838-1-2.025-2.4-2.025-4.872-.001-4.415 4.485-8.007 9.999-8.007zm0-2c-6.338 0-12 4.226-12 10.007 0 2.05.738 4.063 2.047 5.625.055 1.83-1.023 4.456-1.993 6.368 2.602-.47 6.301-1.508 7.978-2.536 1.418.345 2.775.503 4.059.503 7.084 0 11.91-4.837 11.91-9.961-.001-5.811-5.702-10.006-12.001-10.006z");
    let svg = new SVG(null, null, "currentColor", null, null, "0 0 24 24", 24, 24);
    svg.add(path);
    return svg;
};

PersonilizeProfile = function () {
    let path = new SVGPath(null, null, null, null, null, "M15.996 24h-12.605s.734-3.931.633-5.686c-.041-.724-.161-1.474-.54-2.104-.645-1-2.636-3.72-2.475-7.43.224-5.209 4.693-8.779 10.126-8.779 5.098 0 8.507 3.001 9.858 7.483.328 1.079.311 1.541-.151 2.607l-.006.013 1.751 2.142c.26.381.413.791.413 1.239 0 .547-.233 1.045-.61 1.399-.368.345-.767.452-1.248.642 0 0-.576 2.592-.873 3.291-.7 1.643-1.97 1.659-2.97 1.849-.394.083-.49.133-.681.681-.208.591-.363 1.435-.622 2.653zm-4.842-22c-4.285.048-7.74 2.548-8.121 6.488-.192 1.991.463 3.986 1.516 5.705.611 1 1.305 1.592 1.464 3.875.091 1.313-.05 2.636-.241 3.932h8.604c.141-.645.35-1.485.687-2.057.449-.766 1.097-1.099 1.926-1.254.838-.148 1.238-.059 1.489-.785.212-.579.612-2.221.831-3.902 1.203-.335.612-.161 1.671-.559-.206-.234-1.918-2.314-2.045-2.6-.336-.759-.046-1.19.225-1.913.086-.251.06-.357-.009-.613-1.049-3.949-3.891-6.317-7.997-6.317zm.063 14h-.447c-.117 0-.231-.039-.308-.109l-.594-.391h2.25l-.594.391c-.076.069-.189.109-.307.109zm.922-1h-2.279c-.138 0-.25-.111-.25-.25 0-.138.112-.25.25-.25h2.279c.138 0 .25.112.25.25s-.111.25-.25.25zm-1.322-.986h-1.414c-.013-2.57-1.403-2.878-1.403-4.647 0-1.695 1.327-2.852 3-2.852h.02c1.663.009 2.98 1.163 2.98 2.852 0 1.769-1.391 2.077-1.404 4.647h-1.414c0-2.735 1.318-3.614 1.318-4.651 0-.856-.694-1.333-1.5-1.348h-.019c-.798.022-1.481.499-1.481 1.348 0 1.037 1.317 1.916 1.317 4.651zm4.053-3.628l1.349.612-.414.911-1.298-.589c.151-.3.276-.607.363-.934zm-7.739 0c.086.332.208.63.359.935l-1.296.588-.413-.911 1.35-.612zm9.369-.886h-1.501c.01-.335-.021-.672-.093-1h1.594v1zm-9.499 0h-1.501v-1h1.593c-.071.327-.101.663-.092.998v.002zm7.02-2.714l1.243-.881.579.815-1.252.889c-.147-.291-.336-.566-.57-.823zm-6.043 0c-.23.251-.418.525-.569.822l-1.251-.888.578-.815 1.242.881zm4.435-1.046l.663-1.345.896.442-.663 1.345c-.278-.183-.581-.332-.896-.442zm-2.826-.001c-.316.11-.618.258-.897.442l-.663-1.344.897-.442.663 1.344zm1.913-.208c-.334-.039-.654-.041-1-.002v-1.529h1v1.531z");
    let svg = new SVG(null, null, "currentColor", null, null, "0 0 24 24", 24, 24);
    svg.add(path);
    return svg;
};

AgreementsAndTerms = function () {
    let path = new SVGPath(null, null, null, null, null, "M0 22h12v2h-12v-2zm11-1h-10c0-1.105.895-2 2-2h6c1.105 0 2 .895 2 2zm6.369-12.839l-2.246 2.197s6.291 5.541 8.172 7.144c.475.405.705.929.705 1.446 0 1.015-.888 1.886-1.95 1.819-.52-.032-.981-.303-1.321-.697-1.619-1.875-7.07-8.249-7.07-8.249l-2.245 2.196-5.857-5.856 5.957-5.857 5.855 5.857zm-12.299.926c-.195-.193-.458-.302-.733-.302-.274 0-.537.109-.732.302-.193.195-.303.458-.303.733 0 .274.11.537.303.732l5.513 5.511c.194.195.457.304.732.304.275 0 .538-.109.732-.304.194-.193.303-.457.303-.732 0-.274-.109-.537-.303-.731l-5.512-5.513zm8.784-8.784c-.195-.194-.458-.303-.732-.303-.576 0-1.035.467-1.035 1.035 0 .275.108.539.303.732l5.513 5.513c.194.193.456.303.731.303.572 0 1.036-.464 1.036-1.035 0-.275-.109-.539-.304-.732l-5.512-5.513z");
    let svg = new SVG(null, null, "currentColor", null, null, "0 0 24 24", 24, 24, "evenodd");
    svg.add(path);
    return svg;
};

EmailConfirmation = function () {
    let path = new SVGPath(null, null, null, null, null, "M13.473 7.196c-.425-.439-.401-1.127.035-1.552l4.461-4.326c.218-.211.498-.318.775-.318.282 0 .563.11.776.331l-6.047 5.865zm-7.334 11.021c-.092.089-.139.208-.139.327 0 .25.204.456.456.456.114 0 .229-.042.317-.128l.749-.729-.633-.654-.75.728zm6.33-8.425l-2.564 2.485c-1.378 1.336-2.081 2.63-2.73 4.437l1.132 1.169c1.825-.593 3.14-1.255 4.518-2.591l2.563-2.486-2.919-3.014zm7.477-7.659l-6.604 6.405 3.326 3.434 6.604-6.403c.485-.469.728-1.093.728-1.718 0-2.088-2.53-3.196-4.054-1.718zm-1.946 11.333v7.534h-16v-12h8.013l2.058-2h-12.071v16h20v-11.473l-2 1.939z");
    let svg = new SVG(null, null, "currentColor", null, null, "0 0 24 24", 24, 24);
    svg.add(path);
    return svg;
};
