"use strict";

class Boid {
    constructor(x, y){
        this.position = {x: x, y: y};
        this.angle = Math.random(Math.PI * 2);
        this.direction = {x: Math.cos(this.angle), y: Math.sin(this.angle)};
        this.speed = scalarVectorMult(Math.random(maxSpeed), {x: Math.cos(this.angle), y: Math.sin(this.angle)});
        this.acceleration = scalarVectorMult(Math.random(maxAccel), {x: Math.cos(this.angle), y: Math.sin(this.angle)});
        this.width = boidWidth;
        this.height = boidHeight;
    }

    update(dt){
        this.updateVelocity(dt);

        this.maybeWrap();
    }

    updateVelocity(dt){
        // this.velocity.x += acceleration.x * dt;
        // this.velocity.y += acceleration.y * dt;
    }
    updateAcceleration(force){
        // this.acceleration.x += force.x;
        // this.acceleration.y += force.y;
    }
    maybeWrap(){

    }

    draw(){
        drawTriangle(this.position.x, this.position.y, this.width, this.height, this.angle, "white");
    }
}
