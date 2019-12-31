"use strict";

class Flock{
    constructor(){
        this.boids = [];
    }
    update(dt){
        for (var i = 0; i < this.boids.length; i++){
            this.boids[i].update(dt, this.boids);
        }
    }
    add(boid){
        this.boids.push(boid);
    }

    draw(){
        for (var i = 0; i < this.boids.length; i++){
            this.boids[i].draw();
        }
    }
}

class Boid {
    constructor(x, y){
        // Physics
        this.position = {x: x, y: y};
        var angle = getRandomNumber(0, 2 * Math.PI);
        this.velocity = scalarVectorMult(getRandomNumber(0, maxSpeed), {x: Math.cos(angle), y: Math.sin(angle)});
        this.acceleration = {x: 0, y: 0};
        this.neighborHoodRadius = 2;
        this.maxForce = 0.03;
        this.maxSpeed = maxSpeed;
        this.maxSpeedSq = maxSpeed * maxSpeed;

        // Visual
        this.width = boidWidth;
        this.height = boidHeight;
        this.boundingRadius = Math.max(this.width, this.height);
    }

    update(dt, boids){
        this.flock(dt, boids);
        this.updateVelocity(dt);
        this.updatePosition(dt);
        this.maybeWrap();

        //reset acceleration
        this.acceleration = scalarVectorMult(0, this.acceleration);
    }

    updateAcceleration(force){
        this.acceleration = vectorAdd(this.acceleration, force);
    }

    updateVelocity(dt){
        this.velocity = vectorAdd(this.velocity, scalarVectorMult(dt, this.acceleration));
        this.velocity = limitVectorMagSq(this.velocity, this.maxSpeed, this.maxSpeedSq);
    }

    updatePosition(dt){
        this.position = vectorAdd(this.position, scalarVectorMult(dt, this.velocity));
    }

    flock(dt, boids){
        var separation, alignment, cohesion;
        separation = scalarVectorMult(separationWeight, this.separate(boids));
        alignment = scalarVectorMult(alignmentWeight, this.align(boids));
        cohesion = scalarVectorMult(cohesionWeight, this.cohere(boids));

        this.updateAcceleration(separation);
        this.updateAcceleration(alignment);
        this.updateAcceleration(cohesion);
    }

    separate(boids){
        return {x: 0, y: 0};
    }

    align(boids){
        return {x: 0, y: 0};
    }

    cohere(boids){
        return {x: 0, y: 0};
    }

    maybeWrap(){
        if(this.position.x > canvas.width) {
            this.position.x = 0;
        } else if(this.position.x < -this.boundingRadius) {
            this.position.x = canvas.width - 1;
        }
        if(this.position.y > canvas.height) {
            this.position.y = 0;
        } else if(this.position.y < -this.boundingRadius) {
            this.position.y = canvas.height - 1;
        }
    }

    draw(){
        drawTriangle(this.position.x, this.position.y, this.width, this.height, getAngleFromVector(normalizeVector(this.velocity), false), "white");


        canvasContext.save();
        canvasContext.strokeStyle = "white";
        canvasContext.beginPath();
        canvasContext.translate(this.position.x, this.position.y);
        canvasContext.moveTo(0, 0);
        canvasContext.lineTo(this.velocity.x, this.velocity.y);
        canvasContext.stroke();
        canvasContext.restore();
    }
}
