
var darkMaterial = new THREE.MeshBasicMaterial( { color: 0x000088, side: THREE.DoubleSide} );
var lambertMaterial = new THREE.MeshPhongMaterial( { color: 0x000088, side: THREE.DoubleSide } );
var lineMaterial = new THREE.LineBasicMaterial( { color: 0x000088, side: THREE.DoubleSide } );
var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x0F1319, wireframe: true, transparent: true, side: THREE.DoubleSide} );
var multiMaterial = [ darkMaterial, wireframeMaterial ];

var PHI_SEGMENTS = 1;

function WalrusSphere(radius, linewidth, theta, color) {
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

WalrusSphere.prototype.setPos = function(x,y,z){
    this.obj.position.set(x, y, z);
    this.obj.updateMatrix();
};

WalrusSphere.prototype.initScene = function(scene){
    scene.add(this.obj);
};

function createEnv(scene) {
    var walrusSphere = new WalrusSphere(200, 0.1, 64, 0x007403);
    walrusSphere.setPos(0,0,0);
    walrusSphere.initScene(scene);

    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3( 0, 0, 0));
    var dotMaterial = new THREE.PointCloudMaterial( { size: 1, sizeAttenuation: false } );
    var dot = new THREE.PointCloud(dotGeometry, dotMaterial);
    scene.add(dot);
}

