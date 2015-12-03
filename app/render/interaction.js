function mouse_hover(){
	// find intersections

	// create a Ray with origin at the mouse position
	//   and direction into the scene (camera direction)
	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	vector.unproject( camera );
	var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	// create an array containing all objects in the scene with which the ray intersects
	var intersects = ray.intersectObjects( current_rack.obj.children, true ); //scene.children

	// INTERSECTED = the object in the scene currently closest to the camera
	//		and intersected by the Ray projected from the mouse position

	// if there is one (or more) intersections
	if (intersects.length > 0 && intersects[0].object.name == "rack1" ){
			intersects.splice(0,1);
	}

	if (intersects.length > 0 && intersects[0].object.name == "wired" ){
			intersects.splice(0,1);
	}

	if ( intersects.length > 0 )
	{

		// if the closest object intersected is not the currently stored intersection object
		if ( intersects[ 0 ].object.server != INTERSECTED )
		{
		    // restore previous intersection object (if it exists) to its original color
			if ( INTERSECTED )
				INTERSECTED.on_hover(scene,false);
			// store reference to closest object as current intersection object
			INTERSECTED = intersects[ 0 ].object.server;
			INTERSECTED.on_hover(scene, true);
		}
	}
	else // there are no intersections
	{
		// restore previous intersection object (if it exists) to its original color
		if ( INTERSECTED )
			INTERSECTED.on_hover(scene, false);
		// remove previous intersection object reference
		//     by setting current intersection object to "nothing"
		INTERSECTED = null;
	}

}