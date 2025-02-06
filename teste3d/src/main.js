import * as THREE from 'three';
import './style.css';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87CEEB); // Sky blue background
document.body.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// Road
const roadGeometry = new THREE.PlaneGeometry(20, 100);
const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2;
scene.add(road);

// Ground
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x90EE90 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.1;
scene.add(ground);

// Car factory function
function createCar(color) {
  const car = new THREE.Group();
  
  // Car body
  const bodyGeometry = new THREE.BoxGeometry(1, 0.5, 2);
  const bodyMaterial = new THREE.MeshPhongMaterial({ color });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.5;
  car.add(body);

  // Roof
  const roofGeometry = new THREE.BoxGeometry(0.8, 0.4, 1);
  const roof = new THREE.Mesh(roofGeometry, bodyMaterial);
  roof.position.y = 0.9;
  car.add(roof);

  // Wheels
  const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
  const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

  const wheels = [
    { x: -0.5, z: 0.7 },
    { x: 0.5, z: 0.7 },
    { x: -0.5, z: -0.7 },
    { x: 0.5, z: -0.7 }
  ];

  wheels.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.position.set(pos.x, 0.2, pos.z);
    wheel.rotation.z = Math.PI / 2;
    car.add(wheel);
  });

  return car;
}

// Create multiple cars
const cars = [];
const carColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];

for (let i = 0; i < 5; i++) {
  const car = createCar(carColors[i]);
  car.position.z = i * -10;
  car.position.x = -2; // Left lane
  cars.push(car);
  scene.add(car);
}

// Camera position
camera.position.set(5, 5, 15);
camera.lookAt(0, 0, 0);

// Animation
function animate() {
  requestAnimationFrame(animate);

  // Move cars
  cars.forEach(car => {
    car.position.z += 0.1;
    if (car.position.z > 50) {
      car.position.z = -50;
    }
  });

  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();