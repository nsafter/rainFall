import "./style.css";
import * as THREE from "three";
import { Vector3 } from "three";
// import { OrbitControls } from "/node_modules/three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.z = 1;
camera.rotation.x = 1.16;
camera.rotation.y = -0.12;
camera.rotation.z = 0.27;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
// camera.position.set(0, 80, 120);

scene.fog = new THREE.FogExp2(0x11111f, 0.002);
renderer.setClearColor(scene.fog.color);

renderer.render(scene, camera);

const ambientlight = new THREE.AmbientLight(0x555555);
scene.add(ambientlight);

let directionalLight = new THREE.DirectionalLight(0xffeedd);
directionalLight.position.set(0, 0, 1);
scene.add(directionalLight);

const flash = new THREE.PointLight(0x062d89, 30, 500, 1.7);
flash.position.set(200, 300, 100);
scene.add(flash);

// let orangeLight = new THREE.PointLight(0xcc6600, 50, 450, 1.7);
// orangeLight.position.set(200, 300, 100);
// scene.add(orangeLight);
// let redLight = new THREE.PointLight(0xd8547e, 50, 450, 1.7);
// redLight.position.set(100, 30, 100);
// scene.add(redLight);
// let blueLight = new THREE.PointLight(0x3677ac, 50, 450, 1.7);
// blueLight.position.set(300, 300, 200);
// scene.add(blueLight);

// const control = new OrbitControls(camera,renderer.domElement);

const smokeTexture = new THREE.TextureLoader().load("smoke.jpg");
const cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
const cloudMaterial = new THREE.MeshLambertMaterial({
  map: smokeTexture,
  transparent: true,
});

var cloudMaterials = [];

for (let p = 0; p < 500; p++) {
  let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
  cloud.position.set(Math.random() * 800 - 400, 500, Math.random() * 500 - 450);
  cloud.rotation.x = 1.16;
  cloud.rotation.y = -0.12;
  cloud.rotation.z = Math.random() * 360;
  cloud.material.opacity = 0.5;
  cloudMaterials.push(cloud);
  scene.add(cloud);
}

const rainGeo = new THREE.BufferGeometry();
let rainArr = [];
// const vertices = new Vector3();
for (let i = 0; i < 15000; i++) {
  const rainDrop = new THREE.Vector3(
    Math.random() * 400 - 200,
    Math.random() * 500 - 250,
    Math.random() * 400 - 200
  );
  rainArr.push(rainDrop);
  rainDrop.velocity = {};
  rainDrop.velocity = 0;
  // console.log(rainDrop);
  // rainGeo.setFromPoints();
}

rainGeo.setFromPoints(rainArr);
rainGeo.computeVertexNormals();

const rainMaterial = new THREE.PointsMaterial({
  color: 0xaaaaaa,
  size: 0.15,
  transparent: true,
});
const rain = new THREE.Points(rainGeo, rainMaterial);
scene.add(rain);

function animate() {
  requestAnimationFrame(animate);
  cloudMaterials.forEach((p) => {
    p.rotation.z -= 0.002;
  });
  // control.update();
  if (Math.random() > 0.93 || flash.power > 100) {
    if (flash.power < 100)
      flash.position.set(Math.random() * 400, 300 + Math.random() * 200, 100);
    flash.power = 50 + Math.random() * 500;
  }

  rainArr.forEach((p) => {
    p[0] -= 0.1 + Math.random() * 0.1;
    p[1] += p.velocity;
    if (p[1] < -200) {
      p[1] = 200;
      p.velocity = 0;
    }
    rainGeo.attributes.position.needsUpdate = true;
    rain.rotation.y += 0.002;
  });

  renderer.render(scene, camera);
}
animate();
