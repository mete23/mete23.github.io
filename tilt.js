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

                        // Display the acceleration values in the info page
                        document.getElementById('acceleration').innerText =
                            `Acceleration: x = ${acceleration.x.toFixed(2)}, y = ${acceleration.y.toFixed(2)}, z = ${acceleration.z.toFixed(2)}`;
                        rotateByGyro(acceleration);
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
            document.getElementById('acceleration').innerText =
                `Acceleration: x = ${acceleration.x.toFixed(2)}, y = ${acceleration.y.toFixed(2)}, z = ${acceleration.z.toFixed(2)}`;
            rotateByGyro(acceleration);
        });
    } else {
        console.log("DeviceMotionEvent not supported");
        document.getElementById('acceleration').innerText = 'Accelerometer not supported on this device.';
    }
}

/**
 * This function is used to rotate the Cross by
 * the angle of the device.
 * For this the acceleration values of he Accelerometer are used.
 */
function rotateByGyro(acceleration) {
    // Calculate the tilt angle using atan2
    //var angle = Math.atan2(acceleration.y, acceleration.x) * (180 / Math.PI);
    var angle = acceleration.x * 10;
    var div = document.querySelector('#rectangle');
    
    
    div.style.webkitTransform = 'rotate('+angle+'deg)'; 
    div.style.mozTransform    = 'rotate('+angle+'deg)'; 
    div.style.msTransform     = 'rotate('+angle+'deg)'; 
    div.style.oTransform      = 'rotate('+angle+'deg)'; 
    div.style.transform       = 'rotate('+angle+'deg)'; 

    // Add or remove the 'green' class based on the angle
    if (Math.abs(angle) < 5) {
        div.classList.add('green');
    } else {
        div.classList.remove('green');
    }
}

window.addEventListener("load", initGyro, false);