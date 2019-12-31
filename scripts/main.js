"use strict";

//defaults
var CANVASHEIGHT = 760,
    CANVASWIDTH = 1024,
    maxSpeed = 25,
    boidCount = 10,
    boidWidth = 10,
    boidHeight = 30,
    separationWeight = 1.5,
    alignmentWeight = 1.0,
    cohesionWeight = 1.0,

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
    flock;
    //boids = [];

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
    flock = new Flock();
    for (var i = 0; i < boidCount; i++){
        flock.add(new Boid(Math.random() * canvas.width, Math.random() * canvas.height));
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
