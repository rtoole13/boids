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
        this.alignmentNeighborHoodRadius = 50;
        this.alignmentNeighborHoodRadiusSq = this.alignmentNeighborHoodRadius * this.alignmentNeighborHoodRadius;
        this.cohesionNeighborHoodRadius = 175;
        this.cohesionNeighborHoodRadiusSq = this.cohesionNeighborHoodRadius * this.cohesionNeighborHoodRadius;
        this.maxForce = 7;
        this.maxForceSq = this.maxForce * this.maxForce;
        this.maxSpeed = maxSpeed;
        this.maxSpeedSq = maxSpeed * maxSpeed;
        this.desiredSeparation = 25;
        this.desiredSeparationSq = this.desiredSeparation * this.desiredSeparation;
        this.jitterAngle = jitterAngle;

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

        // var jitter = scalarVectorMult(jitterWeight, this.jitter());
        // this.updateAcceleration(jitter);
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

    align(boids){
        //Calculate average velocity of neighborhood
        var steer, sum, count;
        steer = {x: 0, y: 0};
        sum = {x: 0, y: 0};
        count = 0;
        for (var i = 0; i < boids.length; i++){
            var boid = boids[i];
            if (this == boid){
                continue;
            }
            var distSq = distanceSq(this.position, boid.position);
            if (distSq > 0 && distSq < this.alignmentNeighborHoodRadiusSq){
                //FIXME considering all boids in radius, could and probably should ignore the ones immediately behind!
                sum = vectorAdd(sum, boid.velocity);
                count++;
            }
        }
        if (count > 0){
            // Average
            //FIXME unneccessary? Likely in all cases, no need to average here since normalizing later
            //Steer = Desired - Velocity
            sum = scalarVectorMult(1/count, sum);
            var dir = normalizeVector(sum);
            sum = scalarVectorMult(this.maxSpeed, dir);
            steer = limitVectorMagSq(vectorSubtract(sum, this.velocity), this.maxForce, this.maxForceSq);
        }
        return steer;
    }

    cohere(boids){
        // Steer towards center of mass of neighbors
        var steer, sum, count;
        steer = {x: 0, y: 0};
        sum = {x: 0, y: 0};

        for (var i = 0; i < boids.length; i++){
            var boid = boids[i];
            if (this == boid){
                continue;
            }
            var distSq = distanceSq(this.position, boid.position);
            if (distSq > 0 && distSq < this.cohesionNeighborHoodRadiusSq){
                sum = vectorAdd(sum, boid.velocity);
                count++;
            }
        }
        if (count > 0){
            sum = scalarVectorMult(1/count, sum); // steer towards center
            return this.seek(sum);
        }
        return steer;
    }

    jitter(){
        var steer, desiredDir;
        //Steer = Desired - Velocity
        desiredDir = getRandomDirectionInAngleRange(this.velocity, this.jitterAngle, true);
        steer = scalarVectorMult(this.maxSpeed, desiredDir);
        steer = limitVectorMagSq(vectorSubtract(steer, this.velocity), this.maxForce, this.maxForceSq);
        return steer;
    }

    seek(target){
        var steer = normalizeVector(vectorSubtract(target, this.position));
        steer = scalarVectorMult(this.maxSpeed, steer);
        return limitVectorMagSq(vectorSubtract(steer, this.velocity), this.maxForce, this.maxForceSq);
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
