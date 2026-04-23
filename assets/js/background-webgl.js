const container = document.getElementById('webgl-container');

if (container && typeof THREE !== 'undefined') {
  const scene = new THREE.Scene();

  const bgColor = 0x09090b;
  scene.background = new THREE.Color(bgColor);
  scene.fog = new THREE.FogExp2(bgColor, 0.025);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 15);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0x222233, 1.5);
  scene.add(ambientLight);

  const tealLight = new THREE.PointLight(0x00e5ff, 5, 50);
  tealLight.position.set(10, 15, 10);
  scene.add(tealLight);

  const violetLight = new THREE.PointLight(0xb388ff, 4, 50);
  violetLight.position.set(-10, -15, 10);
  scene.add(violetLight);

  const backLight = new THREE.PointLight(0xffffff, 2, 60);
  backLight.position.set(0, 0, -20);
  scene.add(backLight);

  const shardMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.15,
    transmission: 0.95,
    ior: 1.5,
    thickness: 2.5,
    transparent: true,
    opacity: 1.0,
    side: THREE.DoubleSide
  });

  const geometries = [
    new THREE.TetrahedronGeometry(1, 0),
    new THREE.OctahedronGeometry(1, 0),
    new THREE.IcosahedronGeometry(1, 0)
  ];

  geometries.forEach((geo) => {
    geo.scale(1, 2.5 + Math.random() * 1.5, 1);
  });

  const shards = [];
  const shardCount = 60;

  for (let i = 0; i < shardCount; i++) {
    const geo = geometries[Math.floor(Math.random() * geometries.length)];
    const mesh = new THREE.Mesh(geo, shardMaterial);

    mesh.position.x = (Math.random() - 0.5) * 40;
    mesh.position.y = (Math.random() - 0.5) * 40;
    mesh.position.z = (Math.random() - 0.5) * 30 - 5;

    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    mesh.rotation.z = Math.random() * Math.PI;

    const scale = Math.random() * 0.8 + 0.2;
    mesh.scale.set(scale, scale, scale);

    mesh.userData = {
      rx: (Math.random() - 0.5) * 0.002,
      ry: (Math.random() - 0.5) * 0.002,
      rz: (Math.random() - 0.5) * 0.002,
      dy: (Math.random() - 0.5) * 0.005 + 0.002,
      originalY: mesh.position.y
    };

    scene.add(mesh);
    shards.push(mesh);
  }

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let scrollY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) / windowHalfX;
    mouseY = (event.clientY - windowHalfY) / windowHalfY;
  });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    shards.forEach((shard) => {
      shard.rotation.x += shard.userData.rx;
      shard.rotation.y += shard.userData.ry;
      shard.rotation.z += shard.userData.rz;
      shard.position.y += Math.sin(elapsedTime * 0.5 + shard.userData.originalY) * 0.005;
    });

    targetX = mouseX * 2;
    targetY = -(mouseY * 2) + (scrollY * 0.015);

    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;

    camera.lookAt(camera.position.x * 0.5, camera.position.y * 0.5, 0);
    renderer.render(scene, camera);
  }

  animate();
}
