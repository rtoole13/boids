"use strict";

//defaults
var CANVASHEIGHT = 760,
    CANVASWIDTH = 1024,
    maxSpeed = 25,
    boidCount = 50,
    boidWidth = 10,
    boidHeight = 20,
    separationWeight = 1.5,
    alignmentWeight = 1.0,
    cohesionWeight = 1.0,

//controls
    mouseX,
    mouseY,
    playbackPaused = false,

//main objects
    debugMouseBoid,
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
    canvas.addEventListener("mousemove", getMousePosition, false)
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
    debugMouseBoid = new Boid(0, 0);
    flock.add(debugMouseBoid);
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

function getMousePosition(e){
	var rect = canvas.getBoundingClientRect(),
        root = document.documentElement;

	mouseX = e.pageX - rect.left - root.scrollLeft;
	mouseY = e.pageY - rect.top - root.scrollTop;
}
