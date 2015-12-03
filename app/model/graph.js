// Useful dead code. (:

//var darkMaterial = new THREE.MeshBasicMaterial( { color: 0x000088 } );
//var lambertMaterial = new THREE.MeshPhongMaterial( { color: 0x000088 } );
//var lineMaterial = new THREE.LineBasicMaterial( { color: 0x000088 } );
////var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x0F1319, wireframe: true, transparent: true } );
////var multiMaterial = [ darkMaterial, wireframeMaterial ];
//var U_RACK_LENGHT = 4.4;
//var U_SERVER_LENGHT = 4;
//
//function BaseEdgeRack(id, u, width, depth, color, linewidth) {
//    this.obj = new THREE.Group();
//    this.rackGeometry = new THREE.BoxGeometry( width, u*U_RACK_LENGHT, depth);
//    var rack = new THREE.EdgesHelper( new THREE.Mesh(this.rackGeometry), color );
//    rack.name = id;
//    //Does not work on windows
//	//rack.material.linewidth = linewidth;
//
//    this.obj.add(rack);
//    this.max_u = u;
//    this.servers =[];
//}
//
//BaseEdgeRack.prototype.setPos = function(x,y,z){
//    this.obj.position.set(x, y, z);
//    this.obj.updateMatrix();
//};
//
//BaseEdgeRack.prototype.initScene = function(scene){
//    scene.add(this.obj);
//};
//
//BaseEdgeRack.prototype.addServer = function(server, u_adress){
//    //TODO: Check if doable
//    this.servers[u_adress] = server;
//	server.u_adress =  u_adress;
//    var y_bottom = -(this.max_u*U_RACK_LENGHT/2) + server.u*U_RACK_LENGHT/2;
//    var y_pos = y_bottom + u_adress*U_RACK_LENGHT;
//    server.setPos( 0, y_pos ,0);
//    this.obj.add(server.obj);
//};
//
//function Rack(id, u, type) {
//    width = 58;
//    if (type == "19"){
//        width = 48;
//    }
//    BaseEdgeRack.call(this, id, u, width, 60, 0x0F1319, 2);
//}
//
//w3g_inherits(Rack, BaseEdgeRack);
//
////SERVER---------------
//
//function BaseEdgeServer(id, u, width, depth, wire_color, color, linewidth) {
//	this.obj = new THREE.Group();
//	this.serverGeometry = new THREE.BoxGeometry( width, u*U_SERVER_LENGHT, depth);
//	this.wiredMesh = new THREE.EdgesHelper(new THREE.Mesh(this.serverGeometry), wire_color );
//	this.wiredMesh.name = "wire";
//	this.wiredMesh.server = this;
//	this.wiredMesh.material.linewidth = linewidth;
//
//	this.SolidMesh = new THREE.Mesh(this.serverGeometry, new THREE.MeshLambertMaterial( { color: color }));
//	this.SolidMesh.name = "mesh";
//	this.SolidMesh.server = this;
//
//    this.obj.add(this.wiredMesh);
//	this.obj.add(this.SolidMesh);
//
//    this.obj.name = id;
//	this.id = id;
//    this.u = u;
//
//}
//
//BaseEdgeServer.prototype.setPos = function(x,y,z){
//    this.obj.position.set(x, y, z);
//    this.obj.updateMatrix();
//};
//
//BaseEdgeServer.prototype.on_hover = function(scene, hover){
//	removeFromSceneByName("txt2", scene);
//    if ( hover ) {
//		var spritey = makeTextSprite( " Serverek nr " + this.id + " (" + this.u + " u)",
//		{ fontsize: 24, fontface: "Georgia", textColor: { r:1.0, g:0, b:0, a:1.0 }, borderColor: {r:1, g:1, b:0, a:1.0} } );
//		spritey.position.set(100,50,100);
//		s_scale = spritey.scale;
//		SCALE = 10
//		spritey.scale.set(s_scale.x*SCALE,s_scale.y*SCALE,s_scale.z*SCALE);
//		spritey.name = "txt2";
//		scene.add( spritey );
//		// store color of closest object (for later restoration)
//		this.wiredMesh.currentHex = this.wiredMesh.material.color.getHex();
//		// set a new color for closest object
//		this.wiredMesh.material.color.setHex( 0xffff00 );
//	} else {
//		this.wiredMesh.material.color.setHex( this.wiredMesh.currentHex );
//	}
//};
//
//
//function Server(id, u, type) {
//    width = 57;
//    if (type == "19"){
//        width = 47;
//    }
//    BaseEdgeServer.call(this, id, u, width, 55, 0x0F1319, 0x6A646E, 2);
//}
//
//w3g_inherits(Server, BaseEdgeServer);
