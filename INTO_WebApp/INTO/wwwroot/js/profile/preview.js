var selectedTutor = null;
$(document).ready(function () {
    let str = window.localStorage.getItem("TutorResult");
    if (str !== null) {
        selectedTutor = JSON.parse(str);
    }
    let caller = new AjaxCaller(function (response, text) {
        if (response !== null && response.length > 0) {
            let avatar = document.querySelector("[data-role=avatar]");
            if (avatar !== null) {
                let img = avatar.querySelector("img");
                img.src = response;
                avatar.classList.remove("wait-loading");
            }
        }
    }, function (request, status, error) {
        console.error(request.responseText);
    });
    let req = userPicReq(selectedTutor.SearchContent.UserId);
    caller.postWithPromise(req);

    let name = document.querySelector("[data-role=tutor-name]");
    if (name !== null) {
        name.innerHTML = selectedTutor.SearchContent.FirstName.concat(' ', selectedTutor.SearchContent.LastName);
    }

    let title = document.querySelector("[data-role=tutor-title]");
    if (title !== null) {
        title.innerHTML = selectedTutor.SearchContent.Title;
    }

    let freeResp = document.querySelector("[data-role=tutor-free-response]");
    if (freeResp !== null) {
        freeResp.innerHTML = selectedTutor.SearchContent.FreeResponse;
    }
});