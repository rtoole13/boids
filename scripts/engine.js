"use strict";

function update(dt){
    updateBoids(dt);
}

function updateBoids(dt){
    for (var i = 0; i < boids.length; i++){
        boids[i].update(dt);
    }
}

function rotateVector(xi, yi, theta, isDegrees){
    if (isDegrees){
        theta *= Math.PI/180;
    }
    return {x: xi * Math.cos(theta) - yi * Math.sin(theta),
            y: xi * Math.sin(theta) + yi * Math.cons(theta)};
}

function getRandomVector(min, max){
    return {x: min + max * Math.random(),
            y: min + max * Math.random()};
}

function scalarVectorMult(scalar, vector){
    return {x: scalar * vector.x, y: scalar * vector.y};
}
