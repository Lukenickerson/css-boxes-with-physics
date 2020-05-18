// This is a remake of https://davetayls.me/blog/2013/06/04/3d-css-and-physics-with-cannonjs
import {
	World, Box, Material, Body, ContactMaterial, NaiveBroadphase, Plane, Vec3
} from '../node_modules/cannon-es/dist/cannon-es.js';
const CANNON = {
	World, Box, Material, Body, ContactMaterial, NaiveBroadphase, Plane, Vec3
};
const NUM_OF_BOXES = 50;
const STEP_AMOUNT = 1.0/60.0;

function Vector3(x, y, z){
	this.x  = x;
	this.y  = y;
	this.z  = z;
}

Vector3.prototype = {
	join: function(s){
		return [
			this.x,
			this.y,
			this.z
		].join(s);
	},
	copy: function(v){
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
	},
	set: function(x, y, z){
		this.x = x;
		this.y = y;
		this.z = z;
	}
};
	
// Box
function DemoBox(groundMat) {
	this.el = document.createElement('div');
	this.el.innerHTML = this.template;
	this.el.className = 'box';

	// this.position = new Vector3(0,0,0);
	this.rotation = new Vector3(0,0,0);

	var shape = new CANNON.Box(new CANNON.Vec3(10,10,6));
	var material = new CANNON.Material();
	// this.body = new CANNON.Body(0.1, shape, mat);
	this.body = new CANNON.Body({ shape, material, mass: 0.1 });
	this.body.linearDamping = 0.1;

	var ground = new CANNON.ContactMaterial(groundMat, material, { friction: 0.5, restitution: 0.2 });
	world.addContactMaterial(ground);
}

DemoBox.prototype = {
	template: '<i class="front"></i><i class="back"></i>',
	render: function(){
		const pos = 'translate3d('+ [
				this.body.position.x,
				this.body.position.z*-1,
				this.body.position.y
			].join('px,') +'px)';
		const rotation = this.body.quaternion.toAxisAngle();
		const rot = 'rotate3d('+ [
				rotation[0].x,
				rotation[0].y,
				rotation[0].z
				].join(',') +', '+ rotation[1] +'rad)';
			// rot = [
			// 	'rotateX('+ this.rotation.x +'deg)',
			// 	'rotateY('+ this.rotation.x +'deg)',
			// 	'rotateZ('+ this.rotation.x +'deg)'
			// ].join(' ')
		this.el.style.transform = pos +' '+ rot;
	}
};

// physics
// Setup our world
var world = new CANNON.World();
world.gravity.set(0,0,-90.82);
world.broadphase = new CANNON.NaiveBroadphase();
// scene
const scene = document.getElementById('scene');
const boxes = [];

function makeGround(world) {
	// Create a plane
	var shape = new CANNON.Plane();
	var material = new CANNON.Material();
	var groundBody = new CANNON.Body({ shape, material, mass: 0 });
	world.addBody(groundBody);
	return { groundBody, material, shape };
}

function makeDemoBoxes(n, world, scene, groundMat) {
	for (var i=0; i < n; i++){
		var b = new DemoBox(groundMat);
		scene.appendChild(b.el);
		b.body.position.set(
			Math.random()*100 -50,
			Math.random()*50 -25,
			Math.random()*400
		);
		world.addBody(b.body);
		boxes.push(b);
	}
}

function init() {
	const { material } = makeGround(world);
	makeDemoBoxes(NUM_OF_BOXES, world, scene, material);
}

function updateWorld() {
	world.step(STEP_AMOUNT);
}

function render() {
	for (var i=0; i < boxes.length; i++) {
		boxes[i].render();
	}
}

function frame() {
	updateWorld();
	render();
	// console.log(boxes[0])
	requestAnimationFrame(frame);
}

window.addEventListener('load', function(){
	init();
	render();
});

window.addEventListener('click', function(){
	frame();
	return false;
});
	
// export default {};
	