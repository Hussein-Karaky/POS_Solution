//import { canvas } from "../../css/mdb/src/js/vendor/free/chart";

var width = 1600, height = 900, streaming = true;
var video = null, camCanvas = null, btnCamCapt = null;
function startup() {
    video = document.getElementById('video');
    camCanvas = document.getElementById('canvas');
    //photo = document.getElementById('photo');
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
            alert("An error occurred: " + err);
        });

    video.addEventListener('canplay', function (ev) {
        if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);

            if (isNaN(height)) {
                height = width / (4 / 3);
            }

            video.setAttribute('width', width);
            video.setAttribute('height', height);
            camCanvas.setAttribute('width', width);
            camCanvas.setAttribute('height', height);
            streaming = true;
        }
    }, false);

    btnCamCapt.addEventListener('click', function (ev) {
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

function clearphoto() {
    if (camCanvas !== null) {
        var context = camCanvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, camCanvas.width, camCanvas.height);

        var data = camCanvas.toDataURL('image/png');
        //photo.setAttribute('src', data);
    }
}

function takepicture() {
    var context = camCanvas.getContext('2d');
    width = $("#video").width();
    height = $("#video").height();
    if (width && height) {
        camCanvas.width = width;
        camCanvas.height = height;
        if (vanilla !== null) {
            vanilla.setZoom(0);
            context.drawImage(video, 0, 0, width, height);

            var data = camCanvas.toDataURL('image/png');
            vanilla.bind({ url: data, orientation: 1 }).then(function () {
                vanilla.refresh();
                $('a[href="#tab-crop"]').tab("show");
            });
        }
    } else {
        clearphoto();
    }
}

$(document).ready(function () {
    console.log("Starting camera...");
    startup();
});