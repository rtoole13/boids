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
        this.maxForce = 5;
        this.maxForceSq = this.maxForce * this.maxForce;
        this.maxSpeed = maxSpeed;
        this.maxSpeedSq = maxSpeed * maxSpeed;
        this.desiredSeparation = 50;
        this.desiredSeparationSq = this.desiredSeparation * this.desiredSeparation;

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
        var steering, count;
        steering = {x: 0, y: 0};
        count = 0;
        for (var i = 0; i < boids.length; i++){
            var boid = boids[i];
            if (this == boid){
                continue;
            }
            var dist = distance(boid.position, this.position);
            if (dist > 0 && dist < this.desiredSeparation){
                //Boid is too close! Steer away
                var dir;
                var dir = normalizeVector(vectorSubtract(this.position, boid.position));
                steering = vectorAdd(steering, scalarVectorMult(1/dist, dir)); //factor inv prop to distance
                count++;
            }
        }
        // Average steering vector
        if (count > 0){
            steering = scalarVectorMult(1/count, steering);
        }
        if (getVectorMagnitudeSq(steering) > 0){
            // non-zero steering vector
            // Steering = Desired - velocity
            var dir = normalizeVector(steering);
            steering = scalarVectorMult(this.maxSpeed, dir);
            steering = limitVectorMagSq(vectorSubtract(steering, this.velocity), this.maxForce, this.maxForceSq);
        }
        return steering;
    }

    // float desiredseparation = 25.0f;
    //     PVector steer = new PVector(0, 0, 0);
    //     int count = 0;
    //     // For every boid in the system, check if it's too close
    //     for (Boid other : boids) {
    //       float d = PVector.dist(position, other.position);
    //       // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    //       if ((d > 0) && (d < desiredseparation)) {
    //         // Calculate vector pointing away from neighbor
    //         PVector diff = PVector.sub(position, other.position);
    //         diff.normalize();
    //         diff.div(d);        // Weight by distance
    //         steer.add(diff);
    //         count++;            // Keep track of how many
    //       }
    //     }
    //     // Average -- divide by how many
    //     if (count > 0) {
    //       steer.div((float)count);
    //     }
    //
    //     // As long as the vector is greater than 0
    //     if (steer.mag() > 0) {
    //       // First two lines of code below could be condensed with new PVector setMag() method
    //       // Not using this method until Processing.js catches up
    //       // steer.setMag(maxspeed);
    //
    //       // Implement Reynolds: Steering = Desired - Velocity
    //       steer.normalize();
    //       steer.mult(maxspeed);
    //       steer.sub(velocity);
    //       steer.limit(maxforce);
    //     }
    //     return steer;



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
