function init() {
    console.log("Tilt.js loaded");
    window.addEventListener("deviceorientation", handleOrientation, true);


    function handleOrientation(orientation) {
        console.log(orientation);
        console.log(orientation.alpha);
        document.getElementById("orientation").innerHTML = "orientation.alpha; " + orientation.alpha + "<br>orientation.beta: " + orientation.beta + "<br>orientation.gamma: " + orientation.gamma;
    }
}

window.addEventListener("load", init, false);