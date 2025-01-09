function initGyro() {
    console.log("Tilt.js loaded");



    if (typeof(window.DeviceMotionEvent) !== "undefined" && typeof(window.DeviceMotionEvent.requestPermission) === "function") {
        console.log("DeviceMotionEvent.requestPermission is available");
        // Request permission for iOS 13+ devices
        DeviceMotionEvent.requestPermission()
            .then(response => {
                console.log("Permission response:", response);
                if (response === 'granted') {
                    console.log("Permission granted");
                    window.addEventListener('devicemotion', (event) => {
                        const acceleration = event.accelerationIncludingGravity;
                        console.log("Device motion event detected");
                        document.getElementById('acceleration').innerText =
                            `Acceleration: x = ${acceleration.x.toFixed(2)}, y = ${acceleration.y.toFixed(2)}, z = ${acceleration.z.toFixed(2)}`;
                        rotateByGyro(acceleration.x);
                        console.log("Acceleration data processed");
                    });
                } else {
                    console.log("Permission denied");
                    document.getElementById('acceleration').innerText = 'Permission denied for accelerometer.';
                }
            })
            .catch(error => {
                console.error("Permission request error:", error);
            });
    } else if (typeof(window.DeviceMotionEvent) !== "undefined") {
        console.log("DeviceMotionEvent is available without permission request");
        // For devices that do not require permission
        window.addEventListener('devicemotion', (event) => {
            const acceleration = event.accelerationIncludingGravity;
            console.log("Device motion event detected");
            document.getElementById('acceleration').innerText =
                `Acceleration: x = ${acceleration.x.toFixed(2)}, y = ${acceleration.y.toFixed(2)}, z = ${acceleration.z.toFixed(2)}`;
            rotateByGyro(acceleration.x);
        });
    } else {
        console.log("DeviceMotionEvent not supported");
        document.getElementById('acceleration').innerText = 'Accelerometer not supported on this device.';
    }
}

function rotateByGyro(value) {
    console.log("rotateByGyro called with value:", value);
    var deg = 90 * (value / 10);
    var div = document.querySelector('#webcam');

    div.style.webkitTransform = 'rotate('+deg+'deg)'; 
    div.style.mozTransform    = 'rotate('+deg+'deg)'; 
    div.style.msTransform     = 'rotate('+deg+'deg)'; 
    div.style.oTransform      = 'rotate('+deg+'deg)'; 
    div.style.transform       = 'rotate('+deg+'deg)'; 
}

window.addEventListener("load", initGyro, false);