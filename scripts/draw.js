"use strict";

function draw(){
    drawBackground();
    flock.draw();
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
    canvasContext.save();
    canvasContext.strokeStyle = color;
    canvasContext.beginPath();
    canvasContext.translate(x, y);
    canvasContext.rotate(-1 * (angle + Math.PI/2));
    canvasContext.moveTo(0, height);
    canvasContext.lineTo(-base / 2, 0);
    canvasContext.lineTo(base / 2, 0);
    canvasContext.closePath();
    canvasContext.stroke();
    canvasContext.restore();
    // canvasContext.fillRect(100, 100, 200, 200);
    // canvasContext.fillStyle = color;
    // canvasContext.fillRect(0, 0, base, height);

}
