
var darkMaterial = new THREE.MeshBasicMaterial( { color: 0x000088, side: THREE.DoubleSide} );
var lambertMaterial = new THREE.MeshPhongMaterial( { color: 0x000088, side: THREE.DoubleSide } );
var lineMaterial = new THREE.LineBasicMaterial( { color: 0x000088, side: THREE.DoubleSide } );
var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x0F1319, wireframe: true, transparent: true, side: THREE.DoubleSide} );
var multiMaterial = [ darkMaterial, wireframeMaterial ];

var CENTER = new THREE.Vector3(0, 0, 0);
var PHI_SEGMENTS = 1;
var RADIUS = 200;

function WalrusSphereRender(radius, linewidth, theta, color) {
    this.obj = new THREE.Group();
    this.ringMaterial = new THREE.MeshBasicMaterial(
        { color: color, wireframe: true, transparent: true, side: THREE.DoubleSide});

    this.ringMesh1 =
        new THREE.Mesh(
            new THREE.RingGeometry(radius, radius + linewidth, theta, PHI_SEGMENTS),
            this.ringMaterial);
    this.ringMesh2 =
        new THREE.Mesh(
            new THREE.RingGeometry(radius, radius + linewidth, theta, PHI_SEGMENTS),
            this.ringMaterial);
     this.ringMesh2.rotation.y += Math.PI / 2;

    this.ringMesh3 =
        new THREE.Mesh(
            new THREE.RingGeometry(radius, radius + linewidth, theta, PHI_SEGMENTS),
            this.ringMaterial);
     this.ringMesh3.rotation.x += Math.PI / 2;

    this.obj.add(this.ringMesh1);
    this.obj.add(this.ringMesh2);
    this.obj.add(this.ringMesh3);
}

WalrusSphereRender.prototype.setPos = function(x,y,z){
    this.obj.position.set(x, y, z);
    this.obj.updateMatrix();
};

WalrusSphereRender.prototype.initScene = function(scene){
    scene.add(this.obj);
};

function createEnv(obj, enable_sphere, enable_center) {
  if (enable_sphere) {
    var walrusSphere = new WalrusSphereRender(RADIUS, 0.1, 64, 0x5c5c5c); // 0x007403
    walrusSphere.setPos(CENTER.x, CENTER.y, CENTER.z);
    walrusSphere.initScene(obj);
  }

  if (enable_center) {
    obj.add(createVertex(CENTER, 0xffffff));
  }
}

function EnvironmentRender() {
    this.obj = new THREE.Group();
    createEnv(this.obj, true, true);
}

EnvironmentRender.prototype.setPos = function(x,y,z){
    this.obj.position.set(x, y, z);
    this.obj.updateMatrix();
};

EnvironmentRender.prototype.initScene = function(scene){
    scene.add(this.obj);
};
