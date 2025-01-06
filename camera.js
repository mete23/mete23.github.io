const photo_width = 300; //for scaling the photo
var photo_height = 0; //will be computed
var streaming = false;

let canvas = null;
let capturedPhoto = null;
let video = null;

let downloadLink = null;

function webcam(btn) {
    if (btn == 'pause') {
        video.pause();
    } else {
        video.play();
    }
}

function init() {

    video = document.querySelector('#webcam');
    var captureButton = document.querySelector('#capture_button')
    canvas = document.querySelector('#photo_canvas')
    capturedPhoto = document.querySelector('#captured_photo')
    downloadLink = document.querySelector('#download_link');


    //starting the video stream:
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(function (stream) {
                video.srcObject = stream;
            })
            .catch(function (e) {
                console.log(e);
            });
    }

    //adding
    video.addEventListener(
        "canplay",
        (event) => {
            if (!streaming) {
                photo_height = (video.videoHeight / video.videoWidth) * photo_width;

                //make assumption if height cannot be read
                // if (isNan(photo_height)) {
                //     height = width / (4/3);
                // }

                video.setAttribute("width", photo_width);
                video.setAttribute("height", photo_height)
                canvas.setAttribute("height", photo_height)
                canvas.setAttribute("width", photo_width)
                streaming = true
            }
        }, false,
    );
    
    function clearCanvas() {
        const context = canvas.getContext("2d");
        context.fillStyle = "#AAA"
        context.fillRect(0, 0, canvas.width, canvas.height);
    
        const data = canvas.toDataURL("image/png");
    
    }

    function takePicture() {
        const context = canvas.getContext("2d");
        if (photo_width && photo_height) {
            canvas.width = photo_width;
            canvas.height = photo_height;
            context.drawImage(video, 0, 0, photo_width, photo_height);

            const data = canvas.toDataURL("image/png");
            capturedPhoto.setAttribute("src", data);
            console.log(data);
            downloadLink.setAttribute("href", data);
            downloadLink.setAttribute("download", "captured_photo.png");    
            // console.log(capturedPhoto);
        } else {
            clearCanvas();
        }
    }

    //adding function to capture button:
    captureButton.addEventListener(
        "click",
        (event) => {
            takePicture();
            event.preventDefault();
        },
        false,
    );

    clearCanvas();
}
window.addEventListener("load", init, false)