"use strict";

function update(dt){
    flock.update(dt);
    debugMouseBoid.position.x = mouseX;
    debugMouseBoid.position.y = mouseY;
}

// function updateFlock(dt){
//     for (var i = 0; i < boids.length; i++){
//         boids[i].update(dt);
//     }
// }

function rotateVector(v, theta, isDegrees){
    if (isDegrees){
        theta *= Math.PI/180;
    }
    return {x: v.x * Math.cos(theta) - v.y * Math.sin(theta),
            y: v.x * Math.sin(theta) + v.y * Math.cons(theta)};
}

function getVectorMagnitude(v){
    return Math.sqrt(getVectorMagnitudeSq(v));
}

function getVectorMagnitudeSq(v){
    return Math.pow(v.x, 2) + Math.pow(v.y, 2);
}

function normalizeVector(v){
    var magnitude = getVectorMagnitude(v);
    return {x: v.x / magnitude,
            y: v.y / magnitude};
}

function getRandomVector(min, max){
    return {x: getRandomNumber(min, max),
            y: getRandomNumber(min, max)};
}

function getRandomNumber(min, max){
    return min + (max - min) * Math.random();
}

function scalarVectorMult(scalar, v){
    return {x: scalar * v.x, y: scalar * v.y};
}

function limitVectorMagSq(v, limit, sqLimit){
    var magSq, dir;
    magSq = getVectorMagnitudeSq(v);
    if (magSq <= sqLimit){
        return v;
    }
    dir = normalizeVector(v);
    return {x: limit * dir.x,
            y: limit * dir.y}
}

function limitVectorMagnitude(v, limit){
    var magSq, dir;
    magSq = getVectorMagnitudeSq(v);
    if (magSq <= (limit * limit)){
        return v;
    }
    dir = normalizeVector(v);
    return {x: limit * dir.x,
            y: limit * dir.y}
}

function vectorAdd(v1, v2){
    return {x: v1.x + v2.x,
            y: v1.y + v2.y};
}

function vectorSubtract(v1, v2){
    // v1 - v2
    return {x: v1.x - v2.x,
            y: v1.y - v2.y};
}
function distance(p1, p2){
    return Math.sqrt(distanceSq(p1, p2));
}

function distanceSq(p1, p2){
    return Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2);
}

function dotProduct(v1, v2){
    return v1.x * v2.x + v1.y * v2.y;
}

function getAngleFromVector(v, inDegrees){
	if (v.y >= 0){
        if (!inDegrees){
            return - Math.acos(v.x);
        }
		return - Math.acos(v.x) * 180 / Math.PI;
	}
	else{
        if (!inDegrees){
            return Math.acos(v.x);
        }
		return Math.acos(v.x) * 180 / Math.PI;
	}
}
