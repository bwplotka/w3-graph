// standard global variables
var container, scene, camera, renderer, controls, graph;
var keyboard = new THREEx.KeyboardState();
var projector, mouse = {
    x: 0,
    y: 0
  },
  INTERSECTED;

init();
animate();

var CAMERA_Z, RADIUS, POINT_LIGHT_POS, POINT_LIGHT_INTENSITY, CENTER;

function init() {
  CAMERA_Z = 600;
  RADIUS = 200;
  CENTER = new THREE.Vector3(0, 0, 0);
  POINT_LIGHT_INTENSITY = 2;
  POINT_LIGHT_POS = new THREE.Vector3(300, 100, 200);

  // Scene
  scene = new THREE.Scene();
  // Camera
  var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight;
  var VIEW_ANGLE = 45,
    ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
    NEAR = 50,
    FAR = 20000;
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(0, 0, CAMERA_Z);
  camera.lookAt(scene.position);

  // Renderer
  if (Detector.webgl)
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
  else
    console.error("Cannot run WebGL here!");
    //renderer = new THREE.CanvasRenderer();

  renderer.setClearColor(0x000000, 1);
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

  container = document.getElementById('w3-graph-main');
  container.appendChild(renderer.domElement);


  // Events.
  THREEx.WindowResize(renderer, camera);
  THREEx.FullScreen.bindKey({
    charCode: 'm'.charCodeAt(0)
  });

  // Controls.
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  scene.fog = new THREE.FogExp2(0x9999ff, 0.00025);
  var pointLight =
    new THREE.PointLight(0xFFCCFF);

  // Set its position.
  pointLight.position.x = -POINT_LIGHT_POS.x;
  pointLight.position.y = 600;
  pointLight.position.z = -POINT_LIGHT_POS.z;
  pointLight.intensity = POINT_LIGHT_INTENSITY;

  // Add to the scene.
  scene.add(pointLight);

  pointLight =
    new THREE.PointLight(0xFFCCFF);

  // Set its position.
  pointLight.position.x = POINT_LIGHT_POS.x;
  pointLight.position.y = POINT_LIGHT_POS.y;
  pointLight.position.z = POINT_LIGHT_POS.z;
  pointLight.intensity = POINT_LIGHT_INTENSITY;

  // Add to the scene.
  scene.add(pointLight);


  projector = new THREE.Projector();
  document.addEventListener('mousemove', onDocumentMouseMove, false);


  this.env = new EnvironmentRender(CENTER, RADIUS);
  this.env.initScene(scene);
}

function renderGraphOnScene(graphData) {
  if (!isEmpty(graph)) {
    removeFromScene(graph.obj, scene);
  }

  graph = new GraphRender("w3-graph", graphData);
  graph.initScene(scene);
}

function onDocumentMouseMove(event) {
  // the following line would stop any other event handler from firing
  // (such as the mouse's TrackballControls)
  // event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

var need_key_change = false;

function update() {
  var w_key = keyboard.pressed("w");
  if (w_key && !need_key_change) {
    need_key_change = true;
    // TODO!
  } else if (!w_key) {
    need_key_change = false;
  }

  // create a Ray with origin at the mouse position
  //   and direction into the scene (camera direction)
  if (!isEmpty(names) && !isEmpty(graphData) && !isEmpty(graph)) {
    var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
    projector.unprojectVector(vector, camera);
    var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    // create an array containing all objects in the scene with which the ray intersects
    var intersects = ray.intersectObjects(graph.obj.children);

    // INTERSECTED = the object in the scene currently closest to the camera
    //		and intersected by the Ray projected from the mouse position

    // if there is one (or more) intersections
    if (intersects.length > 0) {
      // if the closest object intersected is not the currently stored intersection object
      if (intersects[0].object != INTERSECTED) {

        // restore previous intersection object (if it exists) to its original color
        if (INTERSECTED)
          INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
        // store reference to closest object as current intersection object
        INTERSECTED = intersects[0].object;
        // store color of closest object (for later restoration)
        INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
        // set a new color for closest object
        INTERSECTED.material.color.setHex(0x00ffff);

        // update text, if it has a "name" field.
        if (intersects[0].object.name) {
          var message = intersects[0].object.name;
          var div = document.getElementById("w3-graph-name");
          div.textContent = message;
        }

      }
    } else // there are no intersections
    {
      // restore previous intersection object (if it exists) to its original color
      if (INTERSECTED)
        INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
      // remove previous intersection object reference
      //     by setting current intersection object to "nothing"
      INTERSECTED = null;
    }
  }
  controls.update();
}

function render() {
  renderer.render(scene, camera);
}

function animate() {

  requestAnimationFrame(animate);
  render();
  update();

}
