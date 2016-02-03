function createVertex(posVec, _color, _size, _rotation) {
  _color = _color || new THREE.Color(0x222222);
  _size = _size * _size || 1;
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

function createCube(posVec, _color, _size, _rotation) {
  _color = _color || new THREE.Color(0x222222);
  _size = _size || 1;
  _rotation = _rotation || null;
  var cube =
    new THREE.Mesh(
      new THREE.BoxGeometry(_size, _size, _size),
      new THREE.MeshLambertMaterial({
        color: _color
      }));
  cube.position.setX(posVec.x);
  cube.position.setY(posVec.y);
  cube.position.setZ(posVec.z);

  if (_rotation != null) {
    cube.rotation.x = _rotation.x;
    cube.rotation.y = _rotation.y;
    cube.rotation.z = _rotation.z;
  }

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
  this.sizeEdge = 0.2;
  this.detailedRenderNode = NodeRenderEnum.DETAILED;
  this.obj = new THREE.Object3D();
  this.obj.name = _name;
  this.parseGraph(_graph);
}

GraphRender.prototype.renderVertex = function(posVec, name, _size, _rotation) {
  var size = _size || this.sizeNode;
  var rotation = _rotation || null;
  var vertex = null
  switch (this.detailedRenderNode) {
    case NodeRenderEnum.NORMAL:
      vertex = createVertex(posVec, this.colorNodes, size, rotation);
      break;
    case NodeRenderEnum.DETAILED:
      vertex = createCube(posVec, this.colorNodes, size, rotation);
      break;
    case NodeRenderEnum.NONE:
      vertex = new THREE.Object3D();
      vertex.position.set(posVec);
      break;

  }
  vertex.name = name;
  return vertex
};

var ROOT_NODE_SIZE = 5;
var X = new THREE.Vector3(1, 0, 0);
var Y = new THREE.Vector3(0, 1, 0);
var Z = new THREE.Vector3(0, 0, 1);
var MAX_SIZE = 5;
var MIN_SIZE = 1;

GraphRender.prototype.parseGraph = function(_graph) {
  this.graph = _graph;
  this.graph.calculateStats();

  // Is that ok?
  this.sizeNode = (2 * Math.PI * RADIUS) / this.graph.nodeSize;
  if (this.sizeNode > MAX_SIZE) {
    this.sizeNode = MAX_SIZE;
  }
  if (this.sizeNode < MIN_SIZE) {
    this.sizeNode = MIN_SIZE;
  }

  // Render root in the center.
  this.root = this.graph.getRoot();
  this.root.position = CENTER;
  this.root.obj = this.renderVertex(this.root.position, this.root.name, this.sizeNode);
  this.root.lastChildDirection.copy(this.root.direction);
  this.obj.add(this.root.obj);

  this.depthLength = (RADIUS - 20) / (this.graph.depth-1);
  // BFS
  var nodesToVisit = [{
    to: this.graph.rootId
  }];
  while (nodesToVisit.length > 0) {
    // Get current Node.
    var currentNode = this.graph.getNode(nodesToVisit[0].to);
    nodesToVisit.shift();

    // Get Children of TO Node.
    var children = this.graph.getOutEdgesOf(currentNode._id);
    if (children.length > 0) {
      // When it has children it needs to be rendered (except the root).
      if (currentNode._id != this.graph.rootId) {
        // Get parent.
        var parentNode = this.graph.getNode(currentNode.parentId);
        // Map rotation from parent.
        currentNode.direction.copy(parentNode.lastChildDirection);

        // Move to another direction.
        switch (parentNode.currRotAxis) {
          case "x":
            console.log("Rotating X ", currentNode.direction);
            currentNode.direction.applyAxisAngle(
              X, parentNode.rotationPortion.x);
            parentNode.currRotAxis = "y";
            console.log("Rotating X ", currentNode.direction);
            break;
          case "y":
            currentNode.direction.applyAxisAngle(
              Y, parentNode.rotationPortion.y);
            parentNode.currRotAxis = "z";
            break;
          case "z":
            currentNode.direction.applyAxisAngle(
              Z, parentNode.rotationPortion.z);
            parentNode.currRotAxis = "x";
            break;
        }

        currentNode.direction.normalize();
        // Save last value.
        parentNode.lastChildDirection.copy(currentNode.direction);

        // Map position from parent.
        currentNode.position.copy(parentNode.position);
        currentNode.position.add(
          (currentNode.direction.clone()).multiplyScalar(this.depthLength));

        // Reneder vertex.
        currentNode.obj = this.renderVertex(currentNode.position,
          currentNode.name,
          this.sizeNode,
          currentNode.direction);
        this.obj.add(currentNode.obj);
        currentNode.lastChildDirection.copy(currentNode.direction);
        // Render edge.
        var edgeObject = createEdge(
          parentNode.position,
          currentNode.position,
          this.colorEdges,
          this.sizeEdge);
        // Currently edge contains target name.
        edgeObject.name = currentNode.name;
        this.obj.add(edgeObject);
        //console.log("Rendered ", currentNode);
      }

      nodeSize = this.sizeNode;
      nodeInterval = 3;
      this.renderLevel(currentNode._id,
        currentNode.direction,
        0,
        nodeSize,
        nodeInterval);

      //console.log("Lvl of ", currentNode);
      nodesToVisit = nodesToVisit.concat(children);
    }
    // If current node has not any child, then it is included in render lvl.
  }

  //this.obj.position.set(x, y, z);
  this.obj.updateMatrix();
};

GraphRender.prototype.renderLevel = function(ownerId,
  lvlDirection,
  distanceTopToOwner,
  nodeSize,
  nodeInterval) {
  // Get lvlInfo & owner.
  var lvlInfo = this.graph._levels[ownerId];

  if (lvlInfo.size == 0)
    return;

  var MIN_LVL_RADIUS = RADIUS / 10;
  var owner = this.graph.getNode(ownerId);

  // Calculate perpendicular vector.
  var perpToLvlDirection = new THREE.Vector3(0, 1, 0);
  if (lvlDirection.y != 0 || lvlDirection.z != 0) {
    perpToLvlDirection = new THREE.Vector3(1, 0, 0);
  }
  perpToLvlDirection.cross(lvlDirection);
  perpToLvlDirection.normalize();

  var rotation = lvlDirection;

  // Calculate parameters.
  // Calculate area.
  var area = lvlInfo.size * (nodeSize + nodeInterval) * (nodeSize + nodeInterval);
  var radius = Math.sqrt(area / Math.PI);

  if (radius < MIN_LVL_RADIUS) {
    radius = MIN_LVL_RADIUS;
  }

  var distanceCenterToOwner = distanceTopToOwner - radius;
  if (distanceCenterToOwner < 0)
    distanceCenterToOwner = 0;

  var subLvls = Math.ceil(radius / (nodeSize + nodeInterval));

  console.log("Calculated radius of lvl:", radius, " number of nodes: ", lvlInfo.size);

  // Calculate relative Axis.
  // Move down.
  var angleRelY = ((2 * Math.PI) / 3) / subLvls;
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
      numNodesOnSubLvl = (cirLength - nodeInterval) / (nodeInterval + nodeSize);

      //console.log("All ", cirLength, subLvlRadius, numNodesOnSubLvl);

      nodesToGo = lvlInfo.size - i;
      if (subLvlIndex == (subLvls - 1) || numNodesOnSubLvl <= 0 ||
        numNodesOnSubLvl > (nodesToGo - numNodesOnSubLvl)) {
        numNodesOnSubLvl = nodesToGo;
      }

      if (numNodesOnSubLvl)
        angleRelZ = (2 * Math.PI) / numNodesOnSubLvl;

    } else position.add(sphereVec);

    //console.log("Node: ", node, " pos ", position);

    // Render NODE.
    node.obj = this.renderVertex(position, node.name, nodeSize, rotation);
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
