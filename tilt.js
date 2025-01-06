function initGyro() {
    console.log("Tilt.js loaded");

    if (window.DeviceMotionEvent) {
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