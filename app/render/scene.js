// standard global variables
var container, scene, camera, renderer, controls;
var keyboard = new THREEx.KeyboardState();
var projector, mouse = { x: 0, y: 0 }, INTERSECTED;

init();
animate();

function init()
{
    // Scene
    scene = new THREE.Scene();
    // Camera
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 50, FAR = 20000;
    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0,0,600);
    camera.lookAt(scene.position);

    // Renderer
    if (Detector.webgl )
      renderer = new THREE.WebGLRenderer( {antialias:true, alpha:true} );
    else
    console.error("Cannot run WebGL here!");
      //renderer = new THREE.CanvasRenderer();

    renderer.setClearColor(0x000000, 1);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    container = document.getElementById( 'w3-graph-main' );
    container.appendChild( renderer.domElement );

    // Events.
    THREEx.WindowResize(renderer, camera);
    THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });

    // Controls.
    controls = new THREE.OrbitControls( camera, renderer.domElement );

    scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
    var pointLight =
    new THREE.PointLight(0xFFCCFF);

    // Set its position.
    pointLight.position.x = 100;
    pointLight.position.y = 70;
    pointLight.position.z = 500;
    pointLight.intensity = 1.2;

    // Add to the scene.
    scene.add(pointLight);

    projector = new THREE.Projector();
    document.addEventListener('mousemove', onDocumentMouseMove, false );

    this.env = new EnvironmentRender();
    this.env.initScene(scene);

    this.graph = null;
}

function renderGraphOnScene(graphData) {
  if (this.graph != null) {
    // erase
  }

  this.graph = new GraphRender(graphData);
  this.graph.initScene(scene);
}

function onDocumentMouseMove(event)
{
	// the following line would stop any other event handler from firing
	// (such as the mouse's TrackballControls)
	// event.preventDefault();

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

var need_key_change = false;
function update()
{
   var w_key = keyboard.pressed("w");
	if( w_key && !need_key_change ) {
		need_key_change = true;

		//se.switchWired(false);
		//scene.add(se.obj);
	} else if (!w_key){
		need_key_change = false;
	}

    controls.update();
}

function render()
{
    renderer.render( scene, camera );
}

function animate()
{
    requestAnimationFrame( animate );
    render();
    update();
}
