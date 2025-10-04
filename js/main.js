import * as THREE from './three.module.js';

const scene = new THREE.Scene();

let aspect = 1;
let viewSize = 2;
let cam = new THREE.OrthographicCamera(
    -aspect * viewSize, aspect * viewSize, viewSize, -viewSize, 0.1, 10
);
cam.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(800, 800);
renderer.domElement.style.display = 'block';
renderer.domElement.style.margin = 'auto';
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.right = '0';
renderer.domElement.style.bottom = '0';
renderer.domElement.style.width = '800px';
renderer.domElement.style.height = '800px';
document.body.style.overflow = 'hidden';
document.body.appendChild(renderer.domElement);

const initialWidth = 1.5;
const initialHeight = 0.7;
const geometry = new THREE.PlaneGeometry(initialWidth, initialHeight);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
const dvdObject = new THREE.Mesh(geometry, material);
scene.add(dvdObject);

// Start at origin
dvdObject.position.set(0, 0, 0);

let xSpeed = 0.04 * (Math.random() > 0.5 ? 1 : -1);
let ySpeed = 0.03 * (Math.random() > 0.5 ? 1 : -1);

function getRandomColor() {
    return new THREE.Color(Math.random(), Math.random(), Math.random());
}
dvdObject.material.color = getRandomColor();

let bounceCount = 0;
const maxBounces = 8;
const shrinkFactor = 1 / maxBounces;


function shrinkObject() {
    dvdObject.scale.x -= shrinkFactor;
    dvdObject.scale.y -= shrinkFactor * (initialHeight / initialWidth);
    if (dvdObject.scale.x < 0) dvdObject.scale.x = 0;
    if (dvdObject.scale.y < 0) dvdObject.scale.y = 0;
}


function animate() {
    // Move
    dvdObject.position.x += xSpeed;
    dvdObject.position.y += ySpeed;

    const xBound = aspect * viewSize - (initialWidth * dvdObject.scale.x) / 2;
    const yBound = viewSize - (initialHeight * dvdObject.scale.y) / 2;

    let bounced = false;
    if (dvdObject.position.x > xBound) {
        dvdObject.position.x = xBound;
        xSpeed *= -1;
        bounced = true;
    }
    if (dvdObject.position.x < -xBound) {
        dvdObject.position.x = -xBound;
        xSpeed *= -1;
        bounced = true;
    }
    if (dvdObject.position.y > yBound) {
        dvdObject.position.y = yBound;
        ySpeed *= -1;
        bounced = true;
    }
    if (dvdObject.position.y < -yBound) {
        dvdObject.position.y = -yBound;
        ySpeed *= -1;
        bounced = true;
    }
    if (bounced) {
        dvdObject.material.color = getRandomColor();
        shrinkObject();
        bounceCount++;
    }

    if (bounceCount >= maxBounces || dvdObject.scale.x <= 0.01 || dvdObject.scale.y <= 0.01) {
        dvdObject.visible = false;
        xSpeed = 0;
        ySpeed = 0;
    }

    renderer.render(scene, cam);
}

renderer.setAnimationLoop(animate);
