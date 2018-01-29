require("threejs/three.min.js");
 

 	function Scene3D (rendering_env, lighting_env,loading_env){
this.rendering_env=rendering_env;
this.lighting_env=lighting_env;
this.loading_env=loading_env;
this.camera_position= function (x,y,z){
	this.rendering_env.camera.position.x=x;
		this.rendering_env.camera.position.y=y;
		this.rendering_env.camera.position.z=z;

}
this.cube= function(x,y,z){
return new THREE.Mesh( new THREE.BoxGeometry( x,y,z) );
}
this.triangle= function (x,y,z){
	return new THREE.Mesh( new THREE.Triangle( x,y,z) );
}
}

function Util3D (){

	this.load_mesh= function (scene,path,file){ //creates Obj3D and adds to scene
	return scene.loading_env.loadMesh (path,file,'obj',scene.rendering_env.scene,'',0,0,0,'front' );
}
this.add_mesh= function(scene,mesh ){
	scene.rendering_env.addToScene ( mesh);
}
	
	this.createObj= function (){
	return 	new THREE.Object3D();
	}
	
	this.createObj2= function (scene,path,file){
	var o= 	new THREE.Object3D();
	var m = this.load_mesh ( scene,path,file);
	o.add(m);
	return o ;
	}

	this.trX = function (mesh,x){
					mesh.translateX (x);
 	}
	this.trY = function (mesh,y){
					mesh.translateY (y);
 	}
 	this.trZ = function (mesh,z){
					mesh.translateZ (z);
 	}
 	this.rotX = function (mesh,deg){
					mesh.rotation.x= this.toRadians (deg);
 	}
	this.rotY =  function (mesh,deg){
					mesh.rotation.y= this.toRadians (deg);
 	}
 	this.rotZ =  function (mesh,deg){
					mesh.rotation.z= this.toRadians (deg);
 	}
 	this.scale= function (mesh, x,y,z){
 		mesh.scale.set(x,y,z);
 	}

 	this.toDegrees = function  (angle) {
  return angle * (180 / Math.PI);
	}
this.toRadians = function (angle) {
  return angle * (Math.PI / 180);
}
this.print= function (str){
	console.log(str);
}


this.init_matrix= function (){
return  new THREE.Matrix4();

}
this.apply_rotation= function ( x,y,z,degree,m){
	var rotation = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(x,y,z), this.toRadians (degree));
		return m.multiply( rotation);
}
this.apply_translation= function ( x,y,z,m){
var translation =new THREE.Matrix4().makeTranslation(x,y,z);
		return m.multiply( translation);
}
this.apply_matrix =function(mesh, m){
	mesh.applyMatrix(m);
}
this.set_matrix =function(mesh, m){
	 mesh.matrix=m.clone();
}
this.get_matrix = function(mesh){
	return mesh.matrix;
}
this.reset_matrix = function(mesh){
mesh.matrix=  new THREE.Matrix4();
}
  }


function helicopter (scene){
	this.scene =scene;
	var u = new Util3D();
	this.mesh=u.createObj();
	this.corps= u.load_mesh(this.scene,'assets/helico','helicoCorp' );
this.mesh.add(this.corps); 
this.mot1 = new helico_moteur(this.scene);
this.mot2 = new helico_moteur(this.scene);
this.mot3 = new helico_moteur(this.scene);

this.mesh.add(this.mot1.mesh);
this.mesh.add(this.mot2.mesh);
this.mesh.add(this.mot3.mesh);
u.trX(this.mot1.mesh, -8);
u.trX(this.mot2.mesh, 8);
u.trY(this.mot1.mesh, 0.5);
u.trY(this.mot2.mesh, 0.5);
u.trZ(this.mot1.mesh, 3.5);
u.trZ(this.mot2.mesh, 3.5);
u.trZ(this.mot3.mesh, 7);
u.rotX(this.mot1.mesh, -90);
u.rotX(this.mot2.mesh, -90);


	this.build = function(){
	 
this.mot1.build(10);
this.mot2.build(30);
this.mot3.build(60);


	}
}
function helico_moteur_pale (scene, init_angle){
	this.scene =scene;
	var u = new Util3D();
	this.mesh=u.createObj();
 	this.angle;
	this.init_angle=init_angle;
		var rect= this.scene.cube (5,0.5,0.05);
		//u.add_mesh(this.scene,rect);
			var rect2= this.scene.cube (2,0.5,0.05);
		//u.add_mesh(this.scene,rect2);
		u.trX ( rect2, 2.5);
		u.trY(rect2,1);
		u.rotZ(rect2, 65);

u.rotX(this.mesh, 90);
u.trZ(this.mesh, -2);
u.trX(this.mesh, 1.85);
this.mesh.add(rect);
this.mesh.add(rect2);
	this.build = function(angle){
		this.angle= this.init_angle+angle;


var pale_m= u.init_matrix();
  u.reset_matrix (this.mesh);
 pale_m=u.apply_rotation (0,0,1, this.angle, pale_m);
u.apply_matrix ( this.mesh, pale_m);
}
 
	 
}
function helico_moteur_axe (scene){
	this.scene =scene;
	var u = new Util3D();
	this.mesh=u.createObj();
	this.pale1= new helico_moteur_pale(this.scene,0);
	this.pale2= new helico_moteur_pale(this.scene,180);
	//this.pale3= new helico_moteur_pale(this.scene,240);
this.axe = u.load_mesh(this.scene,'assets/helico','axe' );
u.rotX (this.axe,90);
u.trY (this.axe, -2);
this.rpm;
this.angle=0;
this.mesh.add(this.axe);
	this.mesh.add(this.pale1.mesh);
		this.mesh.add(this.pale2.mesh);
			//this.mesh.add(this.pale3.mesh);
 
	this.build = function(rpm){
 		this.angle++;
 		this.rpm=rpm;
this.pale1.build(0+this.rpm*this.angle);
this.pale2.build(0+this.rpm*this.angle);
//this.pale3.build(0);



	}
 
	 

}
function helico_moteur (scene){
	this.scene =scene;
	var u = new Util3D();
	this.mesh=u.createObj();
	this.axe=new  helico_moteur_axe(this.scene);
u.scale(this.axe.mesh,1.3,1.3,1.3);
	this.capot= u.load_mesh(this.scene,'assets/helico','turbine' );
this.mesh.add(this.capot);
u.rotX ( this.capot,90);
u.trY ( this.capot,-2.5);
this.mesh.add(this.axe.mesh);



	this.build = function(rpm){
	 
this.axe.build(rpm);


	}
	
	this.set_v = function (v){

	}

}