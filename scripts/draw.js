"use strict";

function draw(){
    drawBackground();
    drawBoids();
}

function drawBackground(){
    canvasContext.fillStyle = "black";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}

function drawBoids(){
    for (var i = 0; i < boids.length; i++){
        boids[i].draw();
    }
}

function drawTriangle(x, y, base, height, angle, color){
    // canvasContext.save();
    canvasContext.fillStyle = color;
    // canvasContext.fillRect(100, 100, 200, 200);
    canvasContext.fillRect(x - (base/2), y - (height/2), base, height);
    // canvasContext.restore();
}
