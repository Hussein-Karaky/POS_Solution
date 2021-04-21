var event = null;

$(document).ready(function () {
    sound.volume = 0.15;
    loadRoomInfo(roomInfoReq(roomId));
});

loadRoomInfo = function (roomInfoReq) {
    let caller = new AjaxCaller(function (response, text) {
        if (response.data !== undefined && response.data !== null && response.data.length > 0) {
            event = response.data[0];
            let roomTitle = document.getElementById("room_title");
            let spnStarted = document.getElementById("spnStarted");
            let dueDate = new Date(Date.parse(event.dueDate));
            let endDate = moment(dueDate).add(event.duration, 'm').toDate();
            let running = event.running;
            let dateStarted = null;
            let dateEnded = Date.parse(event.dateEnded);
            if (running) {
                dateStarted = new Date(Date.parse(event.dateStarted));
                let badge = document.createElement("div");
                ["badge-online"].forEach(cls => badge.classList.add(cls));
                roomTitle.appendChild(badge);
                ["btn-outline-warning", "btn-outline-danger"].forEach(cls => roomTitle.classList.remove(cls));
                ["btn-outline-success"].forEach(cls => roomTitle.classList.add(cls));
                spnStarted.style.display = "inline-block";
            } else if (typeof (dateEnded) !== "number") {
                //room ended
                past(roomTitle);
            } else {
                //didn't start yet
                ["btn-outline-success", "btn-outline-danger"].forEach(cls => roomTitle.classList.remove(cls));
                ["btn-outline-warning"].forEach(cls => roomTitle.classList.add(cls));
                spnStarted.style.display = "none";
            }
            let sameMonth = moment().isSame(dueDate, 'month');
            let isAfter = moment(dueDate).isAfter(new Date());
            let href = window.location.origin.concat(`/collaboration/room/${event.id}/${(new Date()).getTimezoneOffset()}/${language}`);
            if (sameMonth && isAfter) {
                const deadline = new Date(Date.parse(new Date()) + 5 * 1000);
                let cd = new CountDown('clockdiv', dueDate, function () {
                    window.location.href = href;
                });
            } else if (moment(new Date()).isAfter(dueDate) && moment(endDate).isAfter(new Date())) {
                let clockdiv = document.getElementById("clockdiv");
                clockdiv.classList.add("inexist");
                let btnJoin = document.getElementById("btnJoin");
                btnJoin.href = href;
                btnJoin.classList.remove("inexist");
            } else {
                past(roomTitle);
            }
            roomTitle.val(event.title);
            document.querySelector("[data-role=room-duedate]").val(new Date(Date.parse(event.dueDate)).toString());
            if (event.material !== null) {
                document.querySelector("[data-role=room-subject]").val(event.material.subject.name);
                document.querySelector("[data-role=room-material]").val(event.material.name);
            } else {
                document.querySelector("[data-role=room-subject]").val("Interview");
            }
            document.querySelector("[data-role=room-duration]").val(event.duration);
            document.querySelector("[data-role=room-users-nb]").val(event.participants.length);

            let usersDiv = document.getElementById("roomUsers");
            let usersGrid = document.createElement("table");
            usersGrid.setAttribute("cellpadding", 5);
            let thead = document.createElement("thead");
            let visCols = {
                miniPic: function (data) {
                    let img = document.createElement("img");
                    ["square-40", "btn-rounded", "btn-outline"].forEach(cls => img.classList.add(cls));
                    img.src = data["miniPic"];
                    //let img = MiniAvatar(accountManager.currentUser);
                    let avatar = document.createElement("div");
                    ["card_mini_avatar"].forEach(cls => avatar.classList.add(cls));
                    avatar.appendChild(img);
                    if (data.online) {
                        let badge = document.createElement("div");
                        ["badge-online"].forEach(cls => badge.classList.add(cls));
                        avatar.appendChild(badge);
                    }
                    let main = document.createElement("div");
                    ["card-mini"].forEach(cls => main.classList.add(cls));
                    main.appendChild(avatar);
                    return main;
                },
                name: function (data) {
                    let spn = document.createElement("span");
                    spn.innerHTML = data["name"];
                    return spn;
                },
                role: function (data) {
                    let spn = document.createElement("span");
                    spn.innerHTML = "(".concat(data["role"]["display"], ")");
                    return spn;
                }
            };
            let cols = Object.keys(visCols);
            let tbody = document.createElement("tbody");
            event.participants.forEach(user => {
                let tr = document.createElement("tr");
                cols.forEach(col => {
                    if (visCols[col] !== undefined) {
                        let td = document.createElement("td");
                        let cell = visCols[col](user);
                        td.appendChild(cell);
                        tr.appendChild(td);
                    }
                });
                let htd = document.createElement("td");
                if (user.userId === event.host.userId) {
                    let spn = document.createElement("span");
                    spn.innerHTML = " • ";
                    spn.classList.add("display-4");
                    spn.classList.add("blue-text");
                    htd.appendChild(spn);
                }
                tr.appendChild(htd);
                tbody.appendChild(tr);
            });
            usersGrid.appendChild(tbody);
            usersDiv.appendChild(usersGrid);
        }
        console.log(response);
    }, function (request, status, error) {
        console.error(request.responseText);
    });
    caller.postWithPromise(roomInfoReq);
};

function past(roomTitle) {
    ["btn-outline-warning", "btn-outline-success"].forEach(cls => roomTitle.classList.remove(cls));
    ["btn-outline-danger"].forEach(cls => roomTitle.classList.add(cls));
    spnStarted.style.display = "none";
    let clockdiv = document.getElementById("clockdiv");
    clockdiv.classList.add("inexist");
    let btnJoin = document.getElementById("btnJoin");
    btnJoin.href = "";
    btnJoin.classList.add("inexist");
    const e = document.getElementById("room_title").querySelector(":last-child");
    if (e !== null) {
        e.parentElement.removeChild(e);
    }
}
MiniAvatar = function (user) {
    let whiteCircle = new SVGCircle("white", "", 0, 40, 40, 40);
    let blackCircle = new SVGCircle("black", "", 0, 68, 68, 8);
    let mask = new SVGNode(null, null, "mask", null, null, null, null);
    mask.id = "circle_mask";
    mask.add(whiteCircle);
    mask.add(blackCircle);
    let image = new SVGImage(user.miniPic, "0", "0", "100%", "100%", "xMidYMid slice", ["square-80-p"]);
    let group = new SVGNodeGroup("none", "", 0, "url(#circle_mask)");
    let imgCircle = new SVGCircle("none", "", 0, 40, 40, 40, ["border"]);
    group.add(image);
    group.add(imgCircle);
    let svg = new SVG(null, null, null, null, null, null, 120, 120, null, ["square-120"], "none");
    svg.add(mask);
    svg.add(group);
    let avatar = document.createElement("div");
    ["card_mini_avatar"].forEach(cls => avatar.classList.add(cls));
    avatar.appendChild(svg.getDisplay());
    //let main = document.createElement("div");
    //["card-mini"].forEach(cls => main.classList.add(cls));
    //main.appendChild(avatar);
    return avatar;//main;//svg.getDisplay();
};
