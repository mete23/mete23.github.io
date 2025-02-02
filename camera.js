// Set a default width for the photo
const photo_width = 1080;

// Will be computed later according to the webcam resolution
let photo_height = 0;


let streaming = false;

let canvas = null;
let capturedPhoto = null;
let video = null;
let downloadButton = null;

// Store the original image data
let originalImageData = null;

// Store the last image data
let lastImageData = null;



function init() {
    video = document.querySelector('#webcam');
    const captureButton = document.querySelector('#capture_button');
    const grayscaleButton = document.querySelector('#grayscale_button');
    const sepiaButton = document.querySelector('#sepia_button');
    const invertButton = document.querySelector('#invert_button');
    const brightnessButton = document.querySelector('#brightness_button');
    const darknessButton = document.querySelector('#darkness_button');
    const contrastButton = document.querySelector('#contrast_button');
    const saturationButton = document.querySelector('#saturation_button');
    const blurButton = document.querySelector('#blur_button');
    const sharpenButton = document.querySelector('#sharpen_button');
    const hueRotateButton = document.querySelector('#hue_rotate_button');
    const resetButton = document.querySelector('#reset_button');
    const undoButton = document.querySelector('#undo_button');
    const editingTabButton = document.querySelector('#pills-editing-tab');
    downloadButton = document.querySelector('#download_button');
    canvas = document.querySelector('#photo_canvas');
    capturedPhoto = document.querySelector('#captured_photo');

    /**
     * Start the video stream and display it in the video element.
     * The source of the video element is the webcam stream.
     */
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function (e) {
                console.log(e);
            });
    }
    

    /**
     * Adds Event Listener to the video element to check if the video is ready to play.
     * If the video is ready to play, the video element is resized to
     * the width of the webcam stream.
     */
    video.addEventListener('canplay', (event) => {
        if (!streaming) {
            photo_height = (video.videoHeight / video.videoWidth) * photo_width;

            // Make assumption if height cannot be read
            if (isNaN(photo_height)) {
                photo_height = photo_width / (4 / 3);
            }

            video.setAttribute('width', photo_width);
            video.setAttribute('height', photo_height);
            canvas.setAttribute('width', photo_width);
            canvas.setAttribute('height', photo_height);
            streaming = true;
        }
    }, false);

    // Event listener for capture button click
    captureButton.addEventListener('click', (event) => {
        takePicture();
        event.preventDefault();
    }, false);

    // Event listeners for filter buttons
    grayscaleButton.addEventListener('click', (event) => {
        applyFilter(applyGrayscale);
        event.preventDefault();
    }, false);

    sepiaButton.addEventListener('click', (event) => {
        applyFilter(applySepia);
        event.preventDefault();
    }, false);

    invertButton.addEventListener('click', (event) => {
        applyFilter(applyInvert);
        event.preventDefault();
    }, false);

    brightnessButton.addEventListener('click', (event) => {
        applyFilter(applyBrightness);
        event.preventDefault();
    }, false);

    darknessButton.addEventListener('click', (event) => {
        applyFilter(applyDarkness);
        event.preventDefault();
    }, false);

    contrastButton.addEventListener('click', (event) => {
        applyFilter(applyContrast);
        event.preventDefault();
    }, false);

    saturationButton.addEventListener('click', (event) => {
        applyFilter(applySaturation);
        event.preventDefault();
    }, false);

    blurButton.addEventListener('click', (event) => {
        applyFilter(applyBlur);
        event.preventDefault();
    }, false);

    sharpenButton.addEventListener('click', (event) => {
        applyFilter(applySharpen);
        event.preventDefault();
    }, false);

    hueRotateButton.addEventListener('click', (event) => {
        applyFilter(applyHueRotate);
        event.preventDefault();
    }, false);
    
    resetButton.addEventListener('click', (event) => {
        resetImage();
        event.preventDefault();
    }, false);
    
    undoButton.addEventListener('click', (event) => {
        undoLastEffect();
        event.preventDefault();
    }, false);

    // Event listener for download button click
    downloadButton.addEventListener('click', (event) => {
        downloadImage();
        event.preventDefault();
    }, false);

    clearCanvas();
}

/**
 * This function clears the Canvas where the Image is stored.
 * It works by filling the Canvas with a grey color.
 */
function clearCanvas() {
    const context = canvas.getContext('2d');
    context.fillStyle = '#AAA';
    context.fillRect(0, 0, canvas.width, canvas.height);
}


/**
 * This function can be used to take a picture with the webcam.
 * It works by taking a Frame of the video stream.
 */
function takePicture() {
    const context = canvas.getContext('2d');
    if (photo_width && photo_height) {
        canvas.width = photo_width;
        canvas.height = photo_height;
        context.drawImage(video, 0, 0, photo_width, photo_height);

        const data = canvas.toDataURL('image/png');
        capturedPhoto.setAttribute('src', data);

        // Store the original image data
        originalImageData = context.getImageData(0, 0, canvas.width, canvas.height);
        lastImageData = context.getImageData(0, 0, canvas.width, canvas.height);

        // Simulate a click on the "Editing" tab button
        document.querySelector('#pills-editing-tab').click();
    } else {
        clearCanvas();
    }
}

/**
 * This function can be used to download the taken image.
 * It works by creating a link element and clicking on it.
 */
function downloadImage() {
    const data = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = data;
    link.download = 'captured_photo.png';
    link.click();
}

// Function to apply a filter and store the last image data
function applyFilter(filterFunction) {
    const context = canvas.getContext('2d');
    lastImageData = context.getImageData(0, 0, canvas.width, canvas.height);
    filterFunction();
}


/**
 * This function resets the image to the original image.
 */
function resetImage() {
    const context = canvas.getContext('2d');
    if (originalImageData) {
        context.putImageData(originalImageData, 0, 0);
        updateCapturedPhoto();
    }
}

/**
 * This function undoes the last effect applied to the image.
 * It works by putting the last image data back to the canvas.
 * But be aware that this function only works for one undo step.
 */
function undoLastEffect() {
    const context = canvas.getContext('2d');
    if (lastImageData) {
        context.putImageData(lastImageData, 0, 0);
        updateCapturedPhoto();
    }
}

// Function to apply grayscale filter to the captured photo
function applyGrayscale() {
    const context = canvas.getContext('2d');
    context.drawImage(capturedPhoto, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // Red
        data[i + 1] = avg; // Green
        data[i + 2] = avg; // Blue
    }

    context.putImageData(imageData, 0, 0);
    updateCapturedPhoto();
}

// Function to apply sepia filter to the captured photo
function applySepia() {
    const context = canvas.getContext('2d');
    context.drawImage(capturedPhoto, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        data[i] = red * 0.393 + green * 0.769 + blue * 0.189; // Red
        data[i + 1] = red * 0.349 + green * 0.686 + blue * 0.168; // Green
        data[i + 2] = red * 0.272 + green * 0.534 + blue * 0.131; // Blue
    }

    context.putImageData(imageData, 0, 0);
    updateCapturedPhoto();
}

// Function to apply invert filter to the captured photo
function applyInvert() {
    const context = canvas.getContext('2d');
    context.drawImage(capturedPhoto, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]; // Red
        data[i + 1] = 255 - data[i + 1]; // Green
        data[i + 2] = 255 - data[i + 2]; // Blue
    }

    context.putImageData(imageData, 0, 0);
    updateCapturedPhoto();
}

// Function to apply brightness filter to the captured photo
function applyBrightness() {
    const context = canvas.getContext('2d');
    context.drawImage(capturedPhoto, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] + 40; // Red
        data[i + 1] = data[i + 1] + 40; // Green
        data[i + 2] = data[i + 2] + 40; // Blue
    }

    context.putImageData(imageData, 0, 0);
    updateCapturedPhoto();
}

// Function to apply darkness filter to the captured photo
function applyDarkness() {
    const context = canvas.getContext('2d');
    context.drawImage(capturedPhoto, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] - 40; // Red
        data[i + 1] = data[i + 1] - 40; // Green
        data[i + 2] = data[i + 2] - 40; // Blue
    }

    context.putImageData(imageData, 0, 0);
    updateCapturedPhoto();
}

// Function to apply contrast filter to the captured photo
function applyContrast() {
    const context = canvas.getContext('2d');
    context.drawImage(capturedPhoto, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const factor = (259 * (128 + 255)) / (255 * (259 - 128));

    for (let i = 0; i < data.length; i += 4) {
        data[i] = factor * (data[i] - 128) + 128; // Red
        data[i + 1] = factor * (data[i + 1] - 128) + 128; // Green
        data[i + 2] = factor * (data[i + 2] - 128) + 128; // Blue
    }

    context.putImageData(imageData, 0, 0);
    updateCapturedPhoto();
}

// Function to apply saturation filter to the captured photo
function applySaturation() {
    const context = canvas.getContext('2d');
    context.drawImage(capturedPhoto, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const saturation = 2; // Increase saturation by 2x

    for (let i = 0; i < data.length; i += 4) {
        const gray = 0.2989 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = -gray * (1 - saturation) + data[i] * saturation; // Red
        data[i + 1] = -gray * (1 - saturation) + data[i + 1] * saturation; // Green
        data[i + 2] = -gray * (1 - saturation) + data[i + 2] * saturation; // Blue
    }

    context.putImageData(imageData, 0, 0);
    updateCapturedPhoto();
}

/**
 * Function to apply blur filter to the captured photo
 * Be aware that the blur filter does not work on all
 * mobile devices
 */
function applyBlur() {
    const context = canvas.getContext('2d');
    context.filter = 'blur(5px)';
    context.drawImage(capturedPhoto, 0, 0, canvas.width, canvas.height);
    context.filter = 'none';
    updateCapturedPhoto();
}


/**
 * Function to apply sharpen filter to the captured photo.
 * Be aware that this filter does not work on
 * all mobile devices.
 */
function applySharpen() {
    const context = canvas.getContext('2d');
    context.drawImage(capturedPhoto, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const kernel = [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ];

    const w = canvas.width;
    const h = canvas.height;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w;
    tempCanvas.height = h;
    const tempContext = tempCanvas.getContext('2d');
    tempContext.drawImage(capturedPhoto, 0, 0, w, h);
    const tempImageData = tempContext.getImageData(0, 0, w, h);
    const tempData = tempImageData.data;

    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            let r = 0, g = 0, b = 0;
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const weight = kernel[(ky + 1) * 3 + (kx + 1)];
                    const pixelIndex = ((y + ky) * w + (x + kx)) * 4;
                    r += tempData[pixelIndex] * weight;
                    g += tempData[pixelIndex + 1] * weight;
                    b += tempData[pixelIndex + 2] * weight;
                }
            }
            const index = (y * w + x) * 4;
            data[index] = r;
            data[index + 1] = g;
            data[index + 2] = b;
        }
    }

    context.putImageData(imageData, 0, 0);
    updateCapturedPhoto();
}

/**
 * Function to apply hue rotation filter to the captured photo.
 * Be aware that this function may not work on IOS and only on some
 * Android devices.
 */
function applyHueRotate() {
    const context = canvas.getContext('2d');
    context.filter = 'hue-rotate(90deg)';
    context.drawImage(capturedPhoto, 0, 0, canvas.width, canvas.height);
    context.filter = 'none';
    updateCapturedPhoto();
}

// Function to update the captured photo with the canvas data
function updateCapturedPhoto() {
    const data = canvas.toDataURL('image/png');
    capturedPhoto.setAttribute('src', data);
}

// Initialize the webcam and elements when the window loads
window.addEventListener('load', init, false);