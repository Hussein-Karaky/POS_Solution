// INSERT JS HERE


// SOCIAL PANEL JS
/*
const floating_btn = document.querySelector('.floating-btn');
const close_btn = document.querySelector('.close-btn');
const social_panel_container = document.querySelector('.social-panel-container');

floating_btn.addEventListener('click', () => {
    social_panel_container.classList.toggle('visible')
});

close_btn.addEventListener('click', () => {
    social_panel_container.classList.remove('visible')
});
*/

updateResults = function () {
    let resultCont = document.getElementById("resultCont");
    searchResult.SearchResults.forEach(r => {
        let card = buildCard(r);
        resultCont.appendChild(card);
    });
};

buildCard = function (record) {
    let main = document.createElement("div");
    ["row", "tutors-container"].forEach(cls => main.classList.add(cls));
    main.attr("data-id", record.SearchContent.Id);
    let inner = document.createElement("div");
    inner.addClasses(["tutor", "shadow-2"]);
    let head = document.createElement("div");
    head.addClasses(["tutor-preview", "view", "view-cascade", "gradient-card-header", "blue-gradient", "col-3", "p-0"]);
    head.style.minWidth = "142px";
    let minCard = MiniCard(record);
    let name = document.createElement("h5");
    name.addClasses(["pl-3"]);
    name.innerHTML = record.SearchContent.FirstName.concat('.', record.SearchContent.LastName.charAt(0));
    let rating = new StarRating(record.SearchContent.UserId, 1, record.SearchContent.Rating);
    head.appendChild(minCard);
    head.appendChild(name);
    head.appendChild(rating.getDisplay());
    let materials = searchResult.SearchResults[0].SearchContent.Materials.where("SysId", searchFilter.Subject);
    let body = TutorInfo(record, materials);
    let tail = Preview(record, materials);
    inner.appendChild(head);
    inner.appendChild(body);
    inner.appendChild(tail);
    main.appendChild(inner);
    return main;
};

function MiniCard(record) {
    let minCard = document.createElement("div");
    minCard.addClasses(["card-mini", "mt-2", "ml-3"]);
    let avatar = document.createElement("div");
    avatar.addClasses(["card_mini_avatar"]);
    let img = document.createElement("img");
    img.addClasses(["square-64", "btn-rounded", "btn-outline"]);
    img.attr("src", record.SearchContent.MiniPic);
    avatar.appendChild(img);
    if (record.SearchContent.Online) {
        let online = document.createElement("div");
        online.addClasses(["badge-online"]);
        avatar.appendChild(online);
    }
    minCard.appendChild(avatar);
    return minCard;
};

function TutorInfo(record, materials) {
    let main = document.createElement("div");
    main.addClasses(["tutor-info", "col-6"]);
    if (materials.length > 0) {
        let other = searchResult.SearchResults[0].SearchContent.Materials.except("SysId", searchFilter.Subject);
        let h4 = document.createElement("h4");
        let selected = document.createElement("a");
        selected.addClasses(["badge", "badge-primary", "waves-effect", "waves-dark"]);
        selected.innerHTML = materials[0].Name;
        h4.appendChild(selected);
        if (other.length > 0) {
            let otherLink = document.createElement("a");
            otherLink.addClasses(["btn-sm"]);
            let others = document.createElement("span");
            others.addClasses(["badge", "badge-pill", "badge-secondary", "waves-effect", "waves-dark", "mb-1"]);
            others.innerHTML = '+'.concat(other.length, " others");
            otherLink.appendChild(others);
            h4.appendChild(otherLink);
        }
        main.appendChild(h4);
    }
    let title = document.createElement("h6");
    title.innerHTML = record.SearchContent.Title;
    main.appendChild(title);
    let freeRsp = document.createElement("p");
    freeRsp.innerHTML = record.SearchContent.FreeResponse;
    main.appendChild(freeRsp);
    let liked = false;
    if (accountManager !== null && accountManager.currentUser !== null) {
        let obj = accountManager.currentUser.ratings.where("objId", record.SearchContent.UserId);
        liked = (obj.length > 0 && obj[0].liked);
    }
    let footer = document.createElement("footer");
    footer.addClasses(["card-footer"]);
    footer.style.opacity = 1.0;
    footer.style.height = "32px";
    footer.style.paddingTop = "0px";
    footer.appendChild(CardFooterButton(record, SvgLike(liked),
        function () {
            if (accountManager === null || accountManager.currentUser === null) {
                showSignIn("{\"RedirectAction\": \"Index\", \"RedirectController\": \"Home\"}");
                return;
            }
            likeObj(record.SearchContent.UserId, 1, this.getAttribute("data-value") !== "true", function (response, text) {
                let obj = response.data.where("objId", record.SearchContent.UserId);
                if (obj.length > 0) {
                    $(`.badge[data-role=like][data-id=${record.SearchContent.UserId}]`).html(obj[0].objLikes);
                    $(`a[data-role=like][data-id=${record.SearchContent.UserId}] svg`).attr("fill", obj[0].liked ? "currentColor" : "#abcdef");
                    $(`a[data-role=like][data-id=${record.SearchContent.UserId}]`).attr("data-value", obj[0].liked);
                } else {
                    $(`a[data-role=like][data-id=${record.SearchContent.UserId}] svg`).attr("fill", "#abcdef");
                }
            }, function (request, status, error) {
                err("Like not submitted", 5000);
            });
        }, record.SearchContent.Likes, "like", liked));
    footer.appendChild(CardFooterButton(record, SVGAddFriend(false), function () {
        if (accountManager === null || accountManager.currentUser === null) {
            showSignIn("{\"RedirectAction\": \"Index\", \"RedirectController\": \"Home\"}");
            return;
        }

        requestFriend(record.SearchContent.UserId, this.getAttribute("data-value"), function (response, text) {
            if (response) {
                greet("Friend request sent!");
            }
        }, function (request, status, error) {
            err("Like not submitted", 5000);
        });
    }, 0, "friend", undefined, false));
    footer.appendChild(CardFooterButton(record, SVGShare(false), function () {
        if (accountManager === null || accountManager.currentUser === null) {
            showSignIn("{\"redirectAction\": \"Index\", \"redirectController\": \"Home\"}");
            return;
        }
    }, record.SearchContent.Shares, "share"));
    main.appendChild(footer);

    return main;
};

function Preview(record, materials) {
    let main = document.createElement("div");
    main.addClasses(["col-3"]);
    if (materials !== null && Array.isArray(materials) && materials.length > 0) {
        let prices = [];
        materials[0].Pricing.forEach(p => {
            prices.push(p.Price);
        });
        let priceWrap = document.createElement("div");
        let price = document.createElement("span");
        price.addClasses(["btn", "btn-info", "waves-effect", "waves-light", "text-white"]);
        price.innerHTML = '$'.concat(Math.min(...prices), "/hour");
        priceWrap.appendChild(price);
        main.appendChild(priceWrap);
    }
    let hoursWrap = document.createElement("div");
    let hours = document.createElement("span");
    hours.addClasses(["badge", "badge-pill", "badge-light"]);
    hours.innerHTML = "".concat(record.SearchContent.TaughtHours, " Tutoring Hours");
    hoursWrap.appendChild(hours);
    let reviewsWrap = document.createElement("div");
    let reviews = document.createElement("span");
    reviews.addClasses(["badge", "badge-pill", "badge-default"]);
    reviews.innerHTML = "".concat(record.SearchContent.Reviews, " Reviews");
    reviewsWrap.appendChild(reviews);
    let footer = document.createElement("footer");
    footer.addClasses(["pt-4"]);
    footer.style.opacity = 1.0;

    let icon = document.createElement("i");
    icon.addClasses(["fas", "fa-graduation-cap"]);
    let btnReview = document.createElement("a");
    btnReview.addClasses(["btn", "btn-info", "my-0", "text-white", "btn-floating", "btn-action", "ml-auto", "mdb-color", "waves-effect", "waves-dark"]);
    let href = window.location.origin.concat("/Tutor/TutorPreview/", record.SearchContent.Id, '/', language);
    btnReview.addEventListener("click", function (e) {
        window.localStorage.setItem("TutorResult", JSON.stringify(record));
        window.location.href = href;
    });
    btnReview.setAttribute("role", "button");
    btnReview.appendChild(icon);
    footer.appendChild(btnReview);
    main.appendChild(hoursWrap);
    main.appendChild(reviewsWrap);
    main.appendChild(footer);
    return main;
};
function CardFooterButton(record, svg, fn, value, dataRole = "", dataValue = false, withBadge = true) {
    let main = document.createElement("span");
    if (withBadge === true) {
        let badge = document.createElement("span");
        badge.addClasses(["badge", "badge-pill", "badge-info", "waves-effect", "waves-dark", "mb-1"]);
        badge.innerHTML = value;
        badge.setAttribute("data-id", record.SearchContent.UserId);
        badge.setAttribute("data-role", dataRole);
        main.appendChild(badge);
    }
    let link = document.createElement("a");
    link.addClasses(["btn-sm", "btn-rounded", "waves-effect", "waves-dark", "nav-account", "square-32", "blue-text"]);
    link.style.paddingRight = "2px";
    link.style.paddingLeft = "2px";
    link.appendChild(svg);
    link.setAttribute("data-value", dataValue);
    link.setAttribute("data-id", record.SearchContent.UserId);
    link.setAttribute("data-role", dataRole);
    if (fn !== null) {
        link.addEventListener("click", fn);
    }
    main.appendChild(link);
    return main;
};

SvgLike = function (dataValue) {
    let color = dataValue ? "currentColor" : "#abcdef";
    let rect = new SVGRectangle(undefined, undefined, undefined, undefined, 0, 24, 24);
    let g1 = new SVGNodeGroup(null, null, null);
    g1.add(rect);
    let path = new SVGPath(null, null, null, null, null, "M13.12,2.06L7.58,7.6C7.21,7.97,7,8.48,7,9.01V19c0,1.1,0.9,2,2,2h9c0.8,0,1.52-0.48,1.84-1.21l3.26-7.61 C23.94,10.2,22.49,8,20.34,8h-5.65l0.95-4.58c0.1-0.5-0.05-1.01-0.41-1.37C14.64,1.47,13.7,1.47,13.12,2.06z M3,21 c1.1,0,2-0.9,2-2v-8c0-1.1-0.9-2-2-2s-2,0.9-2,2v8C1,20.1,1.9,21,3,21z");
    let g2 = new SVGNodeGroup(null, null, null);
    g2.add(path);
    let g3 = new SVGNodeGroup(null, null, null);
    g3.add(g2);
    let svg = new SVG(null, null, color, null, null, "0 0 24 24", 24, 24, null, ["square-24"], null, "new 0 0 24 24");
    svg.add(g1);
    svg.add(g3);
    return svg.getDisplay();
};

SVGAddFriend = function (record) {
    let rect = new SVGRectangle(undefined, undefined, undefined, undefined, undefined, 24, 24);
    let g1 = new SVGNodeGroup(null, null, null);
    g1.add(rect);
    let path = new SVGPath(null, null, null, null, null, "M15.39,14.56C13.71,13.7,11.53,13,9,13c-2.53,0-4.71,0.7-6.39,1.56C1.61,15.07,1,16.1,1,17.22V20h16v-2.78 C17,16.1,16.39,15.07,15.39,14.56z M9,12c2.21,0,4-1.79,4-4c0-2.21-1.79-4-4-4S5,5.79,5,8C5,10.21,6.79,12,9,12z M20,9V7 c0-0.55-0.45-1-1-1h0c-0.55,0-1,0.45-1,1v2h-2c-0.55,0-1,0.45-1,1v0c0,0.55,0.45,1,1,1h2v2c0,0.55,0.45,1,1,1h0c0.55,0,1-0.45,1-1 v-2h2c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1H20z");
    let g2 = new SVGNodeGroup(null, null, null);
    g2.add(path);
    let svg = new SVG(null, null, "currentColor", null, null, "0 0 24 24", 24, 24, null, ["square-24"], null, "new 0 0 24 24");
    svg.add(g1);
    svg.add(g2);
    return svg.getDisplay();
};

SVGShare = function (record) {
    let rect = new SVGRectangle(undefined, undefined, undefined, undefined, undefined, 24, 24);
    let rect2 = new SVGRectangle(undefined, undefined, undefined, undefined, undefined, 24, 24);
    let g1 = new SVGNodeGroup(null, null, null);
    g1.add(rect);
    g1.add(rect2);
    let path = new SVGPath(null, null, null, null, null, "M18,16c-0.79,0-1.5,0.31-2.03,0.81L8.91,12.7C8.96,12.47,9,12.24,9,12s-0.04-0.47-0.09-0.7l7.05-4.11 C16.49,7.69,17.21,8,18,8c1.66,0,3-1.34,3-3s-1.34-3-3-3s-3,1.34-3,3c0,0.24,0.04,0.48,0.09,0.7L8.04,9.81C7.5,9.31,6.79,9,6,9 c-1.66,0-3,1.34-3,3s1.34,3,3,3c0.79,0,1.5-0.31,2.04-0.81l7.05,4.12C15.04,18.53,15,18.76,15,19c0,1.66,1.34,3,3,3s3-1.34,3-3 S19.66,16,18,16z");
    let g2 = new SVGNodeGroup(null, null, null);
    g2.add(path);
    let g3 = new SVGNodeGroup(null, null, null);
    g3.add(g2);
    let svg = new SVG(null, null, "currentColor", null, null, "0 0 24 24", 24, 24, null, ["square-24", "mr-1"], null, "new 0 0 24 24");
    svg.add(g1);
    svg.add(g3);
    return svg.getDisplay();
};
