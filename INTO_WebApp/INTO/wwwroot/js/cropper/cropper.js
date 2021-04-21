var vanillaResult = document.querySelector('.vanilla-result'),
    vanillaSave = document.querySelector('.vanilla-save'),
    vanillaRotate = document.querySelector('.vanilla-rotate');
var oldSrc = "data:";
var md = false;
var previewing = false;
var vanilla = null;
dzClicked = function () { };
function setupCropper() {
    vanilla = new Croppie(document.getElementById('cropper-cont'), {
        viewport: {
            width: 200,
            height: 200
        },
        boundary: {
            width: 300,
            height: 300
        },
        enableOrientation: true
    });
    if (accountManager !== null && accountManager.currentUser !== null) {
        accountManager.fetchPicture(function () {
            vanilla.bind({ url: accountManager.profilePicture, orientation: 1 });
        });
    } else {
        vanilla.bind({
            url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
            orientation: 1
        });
    }
    vanillaResult.addEventListener('click', function () {
        vanilla.result('canvas').then(resultVanilla);
    });
    vanillaSave.addEventListener('click', function () {
        vanilla.result('canvas').then(saveVanilla);
    });
    // vanillaRotate.addEventListener('click', function() {
    // vanilla.rotate(parseInt($(this).data('deg')));
    // });
    $(".vanilla-rotate").click(function () {
        vanilla.rotate(parseInt($(this).data('deg')));
    });

    // canvas related vars
    var canvas = document.getElementsByClassName("cr-image")[0];
    var ctx = canvas.getContext("2d");
    var hiddenFileInput = document.getElementById("fileInput");
    // dropZone event handlers
    var dropZone = document.getElementById("cropper-cont");
    var dzWrapper = document.getElementsByClassName("cropper-wrapper-container")[0];
    var previewBack = document.getElementsByClassName("preview-back")[0];

    dropZone.addEventListener("dragenter", handleDragEnter, false);
    dropZone.addEventListener("dragover", handleDragOver, false);
    dropZone.addEventListener("drop", handleDrop, false);
    dzClicked = function (e) {
        if (globalDragState !== true) {
            e.stopPropagation(); e.preventDefault();
            $('<input type="file">').on('change', function (fie) {
                if (fie.srcElement !== undefined && fie.srcElement !== null && fie.srcElement.files !== undefined && fie.srcElement.files !== null && fie.srcElement.files.length > 0) {
                    handleFiles(fie.srcElement.files);
                } else if (this.files !== undefined && this.files !== null && this.files.length > 0) {
                    handleFiles(this.files);
                }
            }).click();
        } else {
            globalDragState = false;
        }
    }

    dzWrapper.addEventListener("click", dzClicked, false);

    document.addEventListener("mousedown", function (e) { md = true; });
    document.addEventListener("mousemove", function (e) {
        if (md === true) {
            dzWrapper.removeEventListener("click", dzClicked); md = false;
        }
    });
    document.addEventListener("mouseup", function (e) {
        dzWrapper.addEventListener("click", dzClicked); md = false;
    });
    $("#modalCropper").on("hidden.bs.modal", function (e) {
        if (previewing === true) {
            backFromPreview();
        }
    })
    $("#modalCropper").on("shown.bs.modal", function (e) {
        //vanilla.initZoom();
        vanilla.refresh();
    });
    $('a[href="#tab-crop"]').on('shown.bs.tab', function (e) {
        //e.target // newly activated tab
        //e.relatedTarget // previous active tab
        vanilla.refresh();
    })
    previewBack.addEventListener("click", backFromPreview, false);
    hiddenFileInput.addEventListener("change", function (e) {
        handleFiles(e.srcElement.files);
    }, false);
    //
    function handleDragEnter(e) { e.stopPropagation(); e.preventDefault(); }
    //
    function handleDragOver(e) { e.stopPropagation(); e.preventDefault(); }
    //
    function handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        //
        var url = e.dataTransfer.getData('text/plain');
        // for img elements, url is the img src so 
        // create an Image Object & draw to canvas
        if (url) {
            var img = new Image();
            img.onload = function () { ctx.drawImage(this, 0, 0); }
            img.src = url;
            // for img file(s), read the file & draw to canvas
        } else {
            handleFiles(e.dataTransfer.files);
        }
    }
    //

    Croppie.prototype.aquire = function (img) {
        return function (e) {
            img.onload = function () {
                //ctx.drawImage(aImg, 0, 0);
                vanilla.bind({ url: img.src, orientation: 1 });
            }
            // e.target.result is a dataURL for the image
            img.src = e.target.result;
        };
    }

    // read & create an image from the image file
    function handleFiles(files) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) { continue; }
            var img = document.createElement("img");
            img.classList.add("obj");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (vanilla.aquire)(img);
            reader.readAsDataURL(file);
        } // end for
    } // end handleFiles
}
function resultVanilla(result) {
    previewing = true;
    oldSrc = $("#btnProfilePicture").find("img").attr("src");
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let img = $("#btnProfilePicture").find("img");
    $(img).fadeOut(400, function () { $(this).attr("src", result); $(this).fadeIn(); });
    
    $(".testimonial-card .avatar").addClass("modal-include");
    $(".testimonial-card .avatar").addClass("emphasize-left");
    $("#modalCropper").find(".modal-content").addClass("minimize-right");
    $(".preview-back").fadeIn();
}

function backFromPreview() {
    previewing = false;
    $(".preview-back").fadeOut();
    let img = $("#btnProfilePicture").find("img");
    $(img).fadeOut(500, function () { $(this).attr("src", oldSrc); $(this).fadeIn(); });
    $(".testimonial-card .avatar").removeClass("modal-include");
    $(".testimonial-card .avatar").removeClass("emphasize-left");
    $("#modalCropper").find(".modal-content").removeClass("minimize-right");
}
function saveVanilla(result) {
    if (result !== null && result !== undefined) {
        accountManager.savePicture(result, "modalCropper");
    }
}
$(document).ready(function () {
    if (vanilla === null) {
        setupCropper();
    }
});

