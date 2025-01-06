function init() {
    console.log("Tilt.js loaded");
    window.addEventListener("deviceorientation", handleOrientation, true);


    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', (event) => {
            const acceleration = event.accelerationIncludingGravity;
            document.getElementById('acceleration').innerText =
                `Acceleration: x = ${acceleration.x.toFixed(2)}, y = ${acceleration.y.toFixed(2)}, z = ${acceleration.z.toFixed(2)}`;
        });
    } else {
        document.getElementById('acceleration').innerText = 'Accelerometer not supported on this device.';
    }

    function handleOrientation(orientation) {
        console.log(orientation);
        console.log(orientation.alpha);
        document.getElementById("orientation").innerHTML = "orientation.alpha; " + orientation.alpha + "<br>orientation.beta: " + orientation.beta + "<br>orientation.gamma: " + orientation.gamma;
    }
}

window.addEventListener("load", init, false);