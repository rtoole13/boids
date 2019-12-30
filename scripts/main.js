"use strict";

//defaults
var CANVASHEIGHT = 760,
    CANVASWIDTH = 1024,
    maxSpeed = 25,
    maxAccel = 100,
    boidCount = 45,
    boidWidth = 10,
    boidHeight = 10,

//controls
    playbackPaused = false,

//main objects
    canvas,
    canvasContext,
    currentFrameTimeStamp,
    lastFrameTimeStamp,
    dt,
    dtMax = 1/15,

//game objects
    boids = [];

window.onload = function(){
    canvas = document.getElementById("gameCanvas");
    canvas.height = CANVASHEIGHT;
    canvas.width = CANVASWIDTH;
    canvasContext = canvas.getContext("2d");

    init();
}

function init() {
    lastFrameTimeStamp = 0;

    initializeBoids();
    requestAnimationFrame(main);
}

function initializeBoids(){
    for (var i = 0; i < boidCount; i++){
        boids.push(new Boid(Math.random() * canvas.width, Math.random() * canvas.height));
    }
}
function main() {
    currentFrameTimeStamp = new Date();
    dt = (currentFrameTimeStamp - lastFrameTimeStamp) / 1000.0;
    dt = (dt < dtMax)? dt : dtMax;
    update(dt);
    draw();
    if (playbackPaused){
        return;
    }
    requestAnimationFrame(main);
}
