$(document).ready(function () {
    //setTimeout(function () { attachInMenu(); }, 1000);
    animateLogo();
    animateCap();
    $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
        if (accountManager !== null && accountManager.sched !== null) {
            let days = accountManager.sched.children;
            for (i = 0; i < days.length; i++) {
                days[i].onChildAdded();
            }
        }
    });
});

function animateLogo(){
anime.timeline({ loop: false })
        .add({
            targets: '.ml5 .logo-line',
            opacity: [0.5, 1],
            scaleX: [0, 1],
            easing: "easeInOutExpo",
            duration: 700
        }).add({
            targets: '.ml5 .logo-line',
            duration: 600,
            easing: "easeOutExpo",
            translateY: (el, i) => (-0.625 + 0.625 * 2 * i) + "em"
        }).add({
            targets: '.ml5 .ampersand',
            opacity: [0, 1],
            scaleY: [0.5, 1],
            easing: "easeOutExpo",
            duration: 600,
            offset: '-=600'
        }).add({
            targets: '.ml5 .letters-left',
            opacity: [0, 1],
            translateX: ["0.5em", 0],
            easing: "easeOutExpo",
            duration: 600,
            offset: '-=300'
        }).add({
            targets: '.ml5 .letters-right',
            opacity: [0, 1],
            translateX: ["-0.5em", 0],
            easing: "easeOutExpo",
            duration: 600,
            offset: '-=600'
        }).add({
            targets: '.ml5',
            opacity: 1.0,
            duration: 1000,
            easing: "easeOutExpo",
            delay: 1000
        });
}

function animateCap() {
    let letters = Array.from(document.querySelectorAll(".letters"));
    letters.forEach(a => {
        a.innerHTML =
            a.textContent.split(' ').map(word => {
                if (word[0] != '&') {
                    return `<span class="sp">${word[0]}</span>${word.substring(1)}`;
                } else {
                    return word;
                }
            })
                .join(' ');
    });

    let btn = document.querySelector('.icon');
    let span = document.querySelectorAll('.letters span');
    let border = document.querySelector('.borderBottom');

    let flag = true;

    btn.addEventListener("click", function () {
        flag = !flag;

        if (flag == false) {
            border.classList.remove("borderBottomAnimOut");
            border.classList.add("borderBottomAnimIn");

            letters.forEach(a => {
                a.classList.remove('lettersOff');
            });
            letters.forEach(a => {
                a.classList.add('lettersOn');
            });

            span.forEach(function (x, index) {  // Foreach with delay
                setTimeout(function () {
                    x.classList.remove("fallDown");
                }, 100 * index);
            });

            span.forEach(function (x, index) {
                setTimeout(function () {
                    x.classList.add("fallUp");
                }, 100 * index);
            });

        } else {
            border.classList.remove("borderBottomAnimIn");
            border.classList.add("borderBottomAnimOut");

            letters.forEach(a => { a.classList.remove('lettersOn'); });
            letters.forEach(a => { a.classList.add('lettersOff'); });

            span.forEach(x => { x.classList.remove('fallUp'); });
            span.forEach(function (x, index) {  // Foreach with delay
                setTimeout(function () {
                    x.classList.add("fallDown");
                }, 50 * index);
            });

        }

    });
}

function wipeOutMenu() {
    $("#mainMenu").animate({ left: "100%", borderBottomLeftRadius: "100%", boxShadow: "0 2px 200px 20px rgba(0,0,0,0.8)" }, "medium", function() {
        $(this).css("visibility", "hidden");
    });
}

function attachInMenu() {
    $("#mainMenu").css("visibility", "visible");
    $("#mainMenu").animate({ left: "0%", borderBottomLeftRadius: "0%", boxShadow: "0 2px 12px 0 rgba(0,0,0,0.8)" }, "medium");
}
