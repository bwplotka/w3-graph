// standard global variables
var container, scene, camera, renderer, controls, graph, env;
var sphereRadius, camera_z, pointLightPos, pointLights;
var keyboard = new THREEx.KeyboardState();
var projector, mouse = {
    x: 0,
    y: 0
  },
  INTERSECTED;

init();
animate();

var POINT_LIGHT_INTENSITY, CENTER;

function init() {
  camera_z = 600;
  sphereRadius = 200;
  CENTER = new THREE.Vector3(0, 0, 0);
  POINT_LIGHT_INTENSITY = 2;
  pointLightPos = new THREE.Vector3(300, 100, 200);

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
  camera.position.set(0, 0, camera_z);
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

  pointLights = [];
  pointLights.push(new THREE.PointLight(0xFFCCFF));
  pointLights[0].name = "w3-walrus-pointLight1";
  // Set its position.
  pointLights[0].position.x = -pointLightPos.x;
  pointLights[0].position.y = 600;
  pointLights[0].position.z = -pointLightPos.z;
  pointLights[0].intensity = POINT_LIGHT_INTENSITY;

  // Add to the scene.
  scene.add(pointLights[0]);

  pointLights.push(new THREE.PointLight(0xFFCCFF));
  pointLights[1].name = "w3-walrus-pointLight2";

  // Set its position.
  pointLights[1].position.x = pointLightPos.x;
  pointLights[1].position.y = pointLightPos.y;
  pointLights[1].position.z = pointLightPos.z;
  pointLights[1].intensity = POINT_LIGHT_INTENSITY;

  // Add to the scene.
  scene.add(pointLights[1]);


  projector = new THREE.Projector();
  document.addEventListener('mousemove', onDocumentMouseMove, false);

  env = new EnvironmentRender(CENTER, sphereRadius);
  env.initScene(scene);
}

function renderGraphOnScene(graphData) {
  if (!isEmpty(graph)) {
    removeFromScene(graph.obj, scene);
  }

  graph = new GraphRender(CENTER, "w3-graph", graphData);
  removeFromScene(env.obj, scene);

  // Refresh env
  env = new EnvironmentRender(CENTER, graph.radius);
  env.initScene(scene);

  // Refresh camera
  camera.position.set(0, 0, graph.radius*3);

  // refresh lights:
  for (var i in pointLights) {
    removeFromScene(pointLights[i], scene);
  }

  // Set its position.
  pointLights[0].position.x = -graph.radius*2;
  pointLights[0].position.y = graph.radius*3;
  pointLights[0].position.z = -graph.radius;
  pointLights[0].intensity = POINT_LIGHT_INTENSITY;

  // Add to the scene.
  scene.add(pointLights[0]);

  // Set its position.
  pointLights[1].position.x = graph.radius*2;
  pointLights[1].position.y = graph.radius/2;
  pointLights[1].position.z = graph.radius;
  pointLights[1].intensity = POINT_LIGHT_INTENSITY;

  // Add to the scene.
  scene.add(pointLights[1]);
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
