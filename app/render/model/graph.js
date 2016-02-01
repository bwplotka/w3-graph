function createVertex(posVec, _color, _size) {
  _color = _color || new THREE.Color(0x222222);
  _size = _size *_size || 1;
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
      new THREE.MeshLambertMaterial({
        color: _color
      }));
  cube.position.setX(posVec.x);
  cube.position.setY(posVec.y);
  cube.position.setZ(posVec.z);
  return cube;
}

NodeRenderEnum = {
  DETAILED: 1,
  NORMAL: 2,
  NONE: 3
}

function GraphRender(_name, _graph, _colorNodes, _colorEdges) {
  this.colorNodes = _colorNodes || new THREE.Color(0xffff00);
  this.colorEdges = _colorEdges || new THREE.Color(0x09ff00);
  this.sizeNode = 20;
  this.sizeEdge = 0.2;
  this.detailedRenderNode = NodeRenderEnum.DETAILED;
  this.obj = new THREE.Object3D();
  this.obj.name = _name;
  this.parseGraph(_graph);
}

GraphRender.prototype.renderVertex = function(posVec, name, _size) {
  var size = _size || this.sizeNode;
  var vertex = null
  switch (this.detailedRenderNode) {
    case NodeRenderEnum.NORMAL:
      vertex = createVertex(posVec, this.colorNodes, size);
      break;
    case NodeRenderEnum.DETAILED:
      vertex = createCube(posVec, this.colorNodes, size);
      break;
    case NodeRenderEnum.NONE:
      vertex = new THREE.Object3D();
      vertex.position.set(posVec);
      break;

  }
  vertex.name = name;
  return vertex
};

GraphRender.prototype.parseGraph = function(_graph) {
  this.graph = _graph;
  this.graph.calculateStats();

  // Render root in the center.
  this.root = this.graph.getRoot();
  this.root.obj = this.renderVertex(CENTER, this.root.name);
  this.root.position = CENTER;
  this.obj.add(this.root.obj);

  this.edgeLength = RADIUS / this.graph.depth;
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
      var lvlDirection = new THREE.Vector3(0, 1, 0);
      this.renderLevel(currEdge.to, lvlDirection, 20);

      nodesToVisit = nodesToVisit.concat(children);
    }
  }

  //this.obj.position.set(x, y, z);
  this.obj.updateMatrix();
};

var NODE_INTERVAL = 10;
var MINIMAL_CIR_LENGTH = 100;


GraphRender.prototype.renderLevel = function(ownerId,
                                             lvlDirection,
                                             nodeSize) {
  // Get lvlInfo & owner.
  var lvlInfo = this.graph._levels[ownerId];
  var owner = this.graph.getNode(ownerId);

  // Calculate perpendicular vector.
  var perpToLvlDirection = new THREE.Vector3(0, 1, 0);
  if (lvlDirection.y != 0 || lvlDirection.z != 0) {
    perpToLvlDirection = new THREE.Vector3(1, 0, 0);
  }
  perpToLvlDirection.cross(lvlDirection);

  // Calculate parameters.
  // Calculate area.
  var area = lvlInfo.size * (nodeSize) * (nodeSize);
  radius = Math.sqrt(area / Math.PI);

  var subLvls = Math.ceil(radius / (nodeSize));

  console.log("Calculated radius:", radius, "Number of subLvls:", subLvls);

  var distanceCenterToOwner = (this.edgeLength - radius);

  // Calculate relative Axis.
  // Move down.
  var angleRelY = ((2*Math.PI)/3) / subLvls;
  var summaricAngleRelY = 0;
  // Move right.
  var numNodesOnSubLvl = 1;
  var angleRelZ = 0;

  var subLvlIndex = 0;
  // Relative sphere indicator (from center).
  var sphereVec = new THREE.Vector3(0, 0, 0);
  sphereVec.add(
    (lvlDirection.clone()).multiplyScalar(radius));

  // Foreach lvl member.
  for (var i in lvlInfo.members) {
    var node = this.graph.getNode(lvlInfo.members[i]);

    // Compose base position.
    var position = new THREE.Vector3();
    position.copy(owner.position);
    position.add(
      (lvlDirection.clone()).multiplyScalar(distanceCenterToOwner));

    // Add relative movement.
    if (numNodesOnSubLvl <= 0) {
      subLvlIndex++;
      //console.log("Move down", subLvlIndex);
      sphereVec.applyAxisAngle(perpToLvlDirection, angleRelY);
      position.add(sphereVec);

      summaricAngleRelY += angleRelY;
      var subLvlRadius = Math.sin(summaricAngleRelY) * radius;
      var cirLength = 2 * Math.PI * subLvlRadius;
      numNodesOnSubLvl = cirLength / (NODE_INTERVAL + nodeSize);

      //console.log("All ", cirLength, subLvlRadius, numNodesOnSubLvl);

      nodesToGo = lvlInfo.size - i;
      if (subLvlIndex == (subLvls - 1) || numNodesOnSubLvl <= 0) {
        numNodesOnSubLvl = nodesToGo;
      }
      angleRelZ = (2 * Math.PI) / numNodesOnSubLvl;

    } else position.add(sphereVec);

    //console.log("Node: ", node, " pos ", position);

    // Render NODE.
    node.obj = this.renderVertex(position, node.name, nodeSize);
    node.position = position;
    this.obj.add(node.obj);

    // Render Edge. Save?
    edgeObject = createEdge(
      owner.position,
      node.position,
      this.colorEdges,
      this.sizeEdge);
    // Currently edge contains target name.
    edgeObject.name = node.name;
    this.obj.add(edgeObject);

    // Apply next sphereVec position.
    // Rotate in relative Y axis.
    sphereVec.applyAxisAngle(lvlDirection, angleRelZ);
    numNodesOnSubLvl--;
  }
};

GraphRender.prototype.setPos = function(x, y, z) {
  this.obj.position.set(x, y, z);
  this.obj.updateMatrix();
};

GraphRender.prototype.initScene = function(scene) {
  scene.add(this.obj);
  scene.updateMatrix();
};
