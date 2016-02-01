function createVertex(posVec, _color, _size) {
  _color = _color || new THREE.Color(0x222222);
  _size = _size || 1;
  var dotGeometry = new THREE.Geometry();
  dotGeometry.vertices.push(posVec);
  var dotMaterial = new THREE.PointCloudMaterial({
    color: _color,
    size: _size,
    sizeAttenuation: true
  });
  return new THREE.PointCloud(dotGeometry, dotMaterial);
}

function createEdge(aVec, bVec, _color, _size) {
  var edgeGeometry = new THREE.Geometry();
  edgeGeometry.vertices.push(aVec);
  edgeGeometry.vertices.push(bVec);
  //edgeGeometry.vertices.push(new THREE.Vector3(10, 0, 0));
  var edgeMaterial = new THREE.LineBasicMaterial({
    color: _color,
    size: _size
  });
  return new THREE.Line(edgeGeometry, edgeMaterial);
}

function createCube(posVec, _color, _size) {
  _color = _color || new THREE.Color(0x222222);
  _size = _size || 1;
  var cube =
    new THREE.Mesh(
      new THREE.BoxGeometry(_size, _size, _size),
      new THREE.MeshNormalMaterial({
        color: _color
      }));
  console.log(posVec);
  cube.position.set(posVec);
  return cube;
}

function GraphRender(_id, _graph, _colorNodes, _colorEdges) {
  this.colorNodes = _colorNodes || new THREE.Color(0xFFFF00);
  this.colorEdges = _colorEdges || new THREE.Color(0x09ff00);
  this.sizeNode = 10;
  this.sizeEdge = 0.25;
  this.detailedRenderNode = false;
  this.obj = new THREE.Object3D();
  this.obj.id = _id
  this.parseGraph(_graph);
}

GraphRender.prototype.renderVertex = function(posVec, name) {
  var vertex = null
  if (!this.detailedRenderNode) {
    vertex = createVertex(posVec, this.colorNodes, this.sizeNode);
  } else {
    vertex = createCube(posVec, this.colorNodes, this.sizeNode);
  }
  vertex.name = name
  vertex.id = this.obj.id + "_some_vertex"
  return vertex
};

GraphRender.prototype.parseGraph = function(_graph) {
  this.graph = _graph;
  this.graph.calculateStats();

  this.root = this.graph.getRoot();
  this.root.obj = this.renderVertex(CENTER, this.root.name);
  this.root.position = CENTER;
  this.obj.add(this.root.obj);

  this.edgeLength = (RADIUS - 5) / this.graph.depth;
  // BFS
  var nodesToVisit = [{
    to: this.graph.rootId
  }];
  while (nodesToVisit.length > 0) {
    // Get Edge
    var currEdge = nodesToVisit[0];
    nodesToVisit.shift();

    // Get Children of TO Node.
    var children = this.graph.getOutEdgesOf(currEdge.to);
    if (children.length > 0) {
      this.renderLevel(currEdge.to);
      nodesToVisit = nodesToVisit.concat(children);
    }
  }

  //this.obj.position.set(x, y, z);
  this.obj.updateMatrix();
};

var NODE_INTERVAL = 10;
var MINIMAL_CIR_LENGTH = 100;


GraphRender.prototype.renderLevel = function(ownerId) {
  var lvlInfo = this.graph._levels[ownerId];
  var owner = this.graph.getNode(ownerId);

  var cirLength = (NODE_INTERVAL * 2 * lvlInfo.size);
  // TODO: Tune up.
  if (cirLength < MINIMAL_CIR_LENGTH) {
    cirLength = MINIMAL_CIR_LENGTH;
  }

  // FLAT circut currently. TODO: Make it 3d
  var radius = cirLength / (2 * Math.PI);

  var angle = (2 * Math.PI) / lvlInfo.size;

  var circutVec = new THREE.Vector3(0, 0, radius);
  for (var i in lvlInfo.members) {
    var node = this.graph.getNode(lvlInfo.members[i]);


    var position = new THREE.Vector3();
    position.copy(owner.position);


    // Make it different! not only up!
    position.add(
      (new THREE.Vector3(0, 1, 0)).multiplyScalar(this.edgeLength));

    position.add(circutVec);

    //console.log("Node: ", node, " pos ", position);
    // Render NODE.
    node.obj = this.renderVertex(position, node.name);
    node.position = position;
    this.obj.add(node.obj);

    // Render Edge. Save?
    edgeObject = createEdge(
      owner.position,
      node.position,
      this.colorEdges,
      this.sizeEdge);
    // Currently edge contains target name.
    edgeObject.name = node.name
    edgeObject.id = this.obj.id + "_some_edge"
    this.obj.add(edgeObject);

    // Move cirVec
    circutVec.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
  }
};

GraphRender.prototype.setPos = function(x, y, z) {
  this.obj.position.set(x, y, z);
  this.obj.updateMatrix();
};

GraphRender.prototype.initScene = function(scene) {
  scene.add(this.obj);
};
