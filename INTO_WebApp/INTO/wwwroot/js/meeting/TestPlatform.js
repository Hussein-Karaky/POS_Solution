
$(document).ready(function () {
    $(".next").click(function () {
        current_fs = $("div.bhoechie-tab>div.bhoechie-tab-content").attr("data-name");
        next_fs = $("div.bhoechie-tab>div.bhoechie-tab-content").next();
        nextDataName = $(next_fs).attr("data-name");
        var internet = document.getElementById("txtInternet");
        var microphone = document.getElementById("txtMicrophone");
        internet.style.display = "none";
        microphone.style.display = "block";
        $('#txtInternetLink').removeClass('active');
        $('#txtMicrophoneLink').addClass('active');
    });
    $(".next2").click(function () {
        current_fs = $("div.bhoechie-tab>div.bhoechie-tab-content").attr("data-name");
        next_fs = $("div.bhoechie-tab>div.bhoechie-tab-content").next();
        nextDataName = $(next_fs).attr("data-name");
        var microphone = document.getElementById("txtMicrophone");
        var sound = document.getElementById("txtSound");
        microphone.style.display = "none";
        sound.style.display = "block";
        $('#txtMicrophoneLink').removeClass('active');
        $('#txtSoundLink').addClass('active');
    });
    $(".next3").click(function () {
        current_fs = $("div.bhoechie-tab>div.bhoechie-tab-content").attr("data-name");
        next_fs = $("div.bhoechie-tab>div.bhoechie-tab-content").next();
        nextDataName = $(next_fs).attr("data-name");
        var sound = document.getElementById("txtSound");
        var camera = document.getElementById("txtCamera");
        sound.style.display = "none";
        camera.style.display = "block";
        $('#txtSoundLink').removeClass('active');
        $('#txtCameraLink').addClass('active');
    });
    $("div.bhoechie-tab-menu>div.list-group>a").click(function (e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
        $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
    });
    //FOR WEBCAM
    startup();
});
//JUST AN EXAMPLE, PLEASE USE YOUR OWN PICTURE!
var imageAddr = "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20200714180638/CIP_Launch-banner.png"
var downloadSize = 4995374; //bytes
function ShowProgressMessage(msg) {
    if (console) {
        if (typeof msg == "string") {
            console.log(msg);
        } else {
            for (var i = 0; i < msg.length; i++) {
                console.log(msg[i]);
            }
            }
    }

    var oProgress = document.getElementById("progress");
    if (oProgress) {
        var actualHTML = (typeof msg == "string") ? msg : msg.join("<br />");
        oProgress.innerHTML = actualHTML;
    }
}

function InitiateSpeedDetection() {
    ShowProgressMessage("Loading the image, please wait...");
    window.setTimeout(MeasureConnectionSpeed, 1);
};

if (window.addEventListener) {
    window.addEventListener('load', InitiateSpeedDetection, false);
} else if (window.attachEvent) {
    window.attachEvent('onload', InitiateSpeedDetection);
}

function MeasureConnectionSpeed() {
    var startTime, endTime;
    var download = new Image();
    download.onload = function () {
        endTime = (new Date()).getTime();
        showResults();
    }

    download.onerror = function (err, msg) {
        ShowProgressMessage("Invalid image, or error downloading");
    }

    startTime = (new Date()).getTime();
    var cacheBuster = "?nnn=" + startTime;
    download.src = imageAddr + cacheBuster;

    function showResults() {
        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = downloadSize * 8;
        var speedBps = (bitsLoaded / duration).toFixed(2);
        var speedKbps = (speedBps / 1024).toFixed(2);
        var speedMbps = (speedKbps / 1024).toFixed(2);
        ShowProgressMessage([
            "Your connection speed is:",
            speedBps + " bps",
            speedKbps + " kbps",
            speedMbps + " Mbps"
        ]);
    }
}

// Courtesy www/0AV.com, LGPL license or as set by forked host, Travis Holliday, https://codepen.io/travisholliday/pen/gyaJk
function startr() {
    console.log("starting...");
    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
    if (navigator.getUserMedia) {
        navigator.getUserMedia({
            audio: true
        },
            function (stream) {
                audioContext = new AudioContext();
                analyser = audioContext.createAnalyser();
                microphone = audioContext.createMediaStreamSource(stream);
                javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

                analyser.smoothingTimeConstant = 0.8;
                analyser.fftSize = 1024;

                microphone.connect(analyser);
                analyser.connect(javascriptNode);
                javascriptNode.connect(audioContext.destination);

                canvasContext = $("#canvas")[0].getContext("2d");

                javascriptNode.onaudioprocess = function () {
                    var array = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(array);
                    var values = 0;

                    var length = array.length;
                    for (var i = 0; i < length; i++) {
                        values += (array[i]);
                    }

                    var average = values / length;

                    //          console.log(Math.round(average - 40));

                    canvasContext.clearRect(0, 0, 150, 300);
                    canvasContext.fillStyle = '#12b4a6';
                    canvasContext.fillRect(0, 300 - average, 150, 300);
                    canvasContext.fillStyle = '#12b4a6';
                    canvasContext.font = "48px impact";
                    canvasContext.fillText(Math.round(average - 40), -2, 300);
                    // console.log (average);
                } // end fn stream
            },
            function (err) {
                console.log("The following error occured: " + err.name)
            });
    } else {
        console.log("getUserMedia not supported");
    }
}


///beep sound
function playSound() {
    var sound = document.getElementById("audio");
    sound.play();
}

//webcam
function startup() {
    console.log('enter');
    debugger;
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    btnCamCapt = document.getElementById('btnCamCapt');

    // access video stream from webcam
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    })
        // on success, stream it in video tag
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function (err) {
            console.log("An error occurred: " + err);
        });

    video.addEventListener('canplay', function (ev) {
        if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);

            if (isNaN(height)) {
                height = width / (4 / 3);
            }

            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            streaming = true;
        }
    }, false);

    startbutton.addEventListener('click', function (ev) {
        $('#shutter').addClass('on');
        $('audio')[0].play();
        setTimeout(function () {
            $('#shutter').removeClass('on');
        }, 30 * 2 + 45);
        takepicture();
        ev.preventDefault();
    }, false);

    clearphoto();
}
