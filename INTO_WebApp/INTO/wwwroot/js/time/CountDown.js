
CountDown = function (clockElId, deadline, options, done) {
    this.deadline = deadline;
    this.done = done;
    this.initializeClock(clockElId, deadline);
    if (options !== null && options !== undefined && options.volume !== undefined && options.volume >= 0) {
        sound.volume = options.volume;
    }
}
CountDown.construct();

CountDown.prototype.getTimeRemaining = function (endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
        total,
        days,
        hours,
        minutes,
        seconds
    };
};

CountDown.prototype.beep = function () {
    sound.play();
};

CountDown.prototype.initializeClock = function (id, endtime) {
    const clock = document.getElementById(id);
    const daysSpan = clock.querySelector('.days');
    const hoursSpan = clock.querySelector('.hours');
    const minutesSpan = clock.querySelector('.minutes');
    const secondsSpan = clock.querySelector('.seconds');
    let main = this;
    updateClock = function () {
        main.beep();
        const t = main.getTimeRemaining(endtime);

        daysSpan.innerHTML = t.days;
        hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
        minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
        secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

        if (t.total <= 0) {
            clearInterval(timeinterval);
            warn("Time's up!");
            if (Function.isFunction(main.done)) {
                main.done();
            }
        }
    }

    updateClock();
    const timeinterval = setInterval(updateClock, 1000);
};

//const deadline = new Date(Date.parse(new Date()) + 5 * 1000);//14 * 24 * 60 * 60 * 1000);
//initializeClock('clockdiv', deadline);