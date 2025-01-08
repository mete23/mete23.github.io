function initGyro() {
    console.log("Tilt.js loaded");

    if (typeof(window.DeviceMotionEvent) !== "undefined" && typeof(window.DeviceMotionEvent.requestPermission) === "function") {
        // Request permission for iOS 13+ devices
        DeviceMotionEvent.requestPermission()
            .then(response => {
                if (response === 'granted') {
                    window.addEventListener('devicemotion', (event) => {
                        const acceleration = event.accelerationIncludingGravity;
                        document.getElementById('acceleration').innerText =
                            `Acceleration: x = ${acceleration.x.toFixed(2)}, y = ${acceleration.y.toFixed(2)}, z = ${acceleration.z.toFixed(2)}`;
                    });
                } else {
                    document.getElementById('acceleration').innerText = 'Permission denied for accelerometer.';
                }
            })
            .catch(console.error);
    } else if (typeof(window.DeviceMotionEvent) !== "undefined") {
        // For devices that do not require permission
        window.addEventListener('devicemotion', (event) => {
            const acceleration = event.accelerationIncludingGravity;
            document.getElementById('acceleration').innerText =
                `Acceleration: x = ${acceleration.x.toFixed(2)}, y = ${acceleration.y.toFixed(2)}, z = ${acceleration.z.toFixed(2)}`;
        });
    } else {
        document.getElementById('acceleration').innerText = 'Accelerometer not supported on this device.';
    }
}

window.addEventListener("load", initGyro, false);