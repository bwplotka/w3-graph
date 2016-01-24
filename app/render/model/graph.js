function createVertex(posVec, _color) {
  var dotGeometry = new THREE.Geometry();
  dotGeometry.vertices.push(posVec);
  var dotMaterial = new THREE.PointCloudMaterial({color: _color, size: 1, sizeAttenuation: true });
  var dot = new THREE.PointCloud(dotGeometry, dotMaterial);
  return dot;
}

function createEdge(aVec, bVec, _color) {
  var edgeGeometry = new THREE.Geometry();
  edgeGeometry.vertices.push(aVec);
  edgeGeometry.vertices.push(bVec);
  //edgeGeometry.vertices.push(new THREE.Vector3(10, 0, 0));
  var edgeMaterial = new THREE.LineBasicMaterial({color: _color, size: 0.5});
  var edge = new THREE.Line(edgeGeometry, edgeMaterial);
  return edge;
}

function GraphRender(graph, color) {
   this.obj = new THREE.Group();
   this.parseGraph(graph);
}

GraphRender.prototype.parseGraph = function(graph){
  // TODO(bplotka): My todo graph to THREE objects.
   //this.obj.position.set(x, y, z);
   this.obj.updateMatrix();
};


GraphRender.prototype.setPos = function(x, y, z){
   this.obj.position.set(x, y, z);
   this.obj.updateMatrix();
};

GraphRender.prototype.initScene = function(scene){
   scene.add(this.obj);
};
