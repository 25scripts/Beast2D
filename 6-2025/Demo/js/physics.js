/**
 *this is the physics module containing the rigidbody  and collider classes.
 *@module Physics
 */
//system variables
/**
 * @constant
 * @global
 * @type {string}
 */
const circular="circular";
/**
 * @constant
 * @global
 * @type {string}
 */
const rectangular="rectangular"
//gravity force
/**
 * this is the gravity force of the physics engine. this can be adjust be setting the x and y properties of the vector object.
 * @constant
 * @global
 * @type {vec2d}
 */
const gravity=vec(0,0.05);

//rigidbody component
/**
 * this is the rigidbody object class
 * @class
 * @global
 */
class rigidObj{
	/**
	 * 
	 * @param {GameObject} obj this is the game object that the rigidbody belongs to.
	 */
	constructor(obj){
		/**
		 * @prop {number} mass this is the mass of the rigidbody
		 */
	this.mass=1;
	/**
		 * @prop {vec2d} acceleration this is the acceleration of the rigidbody
		 */
	this.acceleration=vec(0,0);
	/**
		 * @prop {vec2d} velocity this is the velocity of the rigidbody
		 */
	this.velocity=vec(0,0);
	/**
		 * @prop {boolean} gravity if true, the body is affected the gravity constant.
		 */
	this.gravity=true;
	/**
		 * @prop {GameObject} obj this is the game object that the rigidbody belongs to.
		 */
	this.object=obj;
	/**
		 * @prop {vec2d[]} forces this is the array of forces on the body.
		 */
	this.forces=[];
	
	this.dt=1;
	/**
		 * @prop {string} type this is the object type.e.g "rigidbody"
		 */
	this.type="rigidbody"
	/**
		 * @prop {number} drag this is the drag on the rigidbody.
		 */
	this.drag=0.0;
	/**
		 * @prop {boolean}active if true, then the rigidbody is active.
		 */
	this.active=true;
	this.deleted=false;
	obj.components[this.type]=this;
}
   /**
	* this function adds force to the body
	* @param {vec2d} force this is the force to be added.
	*@memberof rigidObj
	*@returns {void}
	*/
	applyForce(force){
		this.forces.push(force);
	}
	get_forces(){
		var vector=vec(0,0);
		for(i in this.forces){
				var f=this.forces[i];
				vector=addVec(vector,this.forces.pop(f));
		}
		return vector;
	}
/**
	 * this function deletes the rigidbody object from the scene at the start of the game cycle
	 * @function
	 * @memberof rigidObj
	 * @returns {void}
	 */
delete_later(){
	if(this.object.scene!=null){
		this.object.scene.deleted.push(this);
		
	}
	
}
/**
 * this function deletes the rigidbody object from the scene immediately
 * @function
 * @memberof rigidObj
 * @returns {void}
 */
delete(){
	if(this.object.scene!=null){
		if(this.object.scene!=null){
			this.object.components["rigidbody"]=null;
			this.deleted=true;
			delete(this);
		}
	}
	
}



	addDrag(){
		var drag=scalP(this.velocity,this.velocity);
		drag=scaleVec(drag,-this.drag/this.mass);
	}
		/**
	* this function sets the velocity the rigidbody
	*@param {vec2d} v this is the velocity of the body
	*@memberof rigidObj
	*@returns {void}
	*/
	setVelocity(v){
		this.velocity=v;
	}
	//update acceleration
	updateAcceleration()
	{

		var acc=vec(0,0);
		if(this.gravity==true){
			acc= addVec(acc,gravity);
			acc= addVec(acc,this.get_forces());
		}
		else{
			acc= addVec(acc,gravity);
			acc=addVec(acc,this.get_forces());
		}
		return acc;
	}
	process(){
	if(this.object!=null&&this.active==true){
		acc=this.updateAcceleration();
		var position=addVec(this.object.position,this.velocity)
		this.object.position.x=position.x;
		this.object.position.y=position.y;
		this.velocity=addVec(this.velocity,acc);
	}
	}
	
	update(){
	}
}
//colliders
/**
 * this is the collider object class.
 * @class
 * @global
 */
class colObj{
	/**
	 * 
	 * @param {GameObject} obj this is the game object that collider belongs to.
	 * @param {string} bound this is the collision type of the collider.e.g "rectangular" or "circular"
	 */
	constructor(obj,bound="rectangular"){
		/**
		 * @prop {GameObject} object this is the game object that collider belongs to.
		 */
	this.object=obj;
	/**
		 * @prop {boolean} active if true, then the collider is active.
		 */
	this.active=true;
	/**
	*@prop {boolean} visualize if true, then the poly objects are drawn to visualize the collider.
	*/
	this.visualize=false;
	/**
		 * @prop {string} type  this is the object type.e.g. "collider"
		 */
	this.type="collider";
	/**
		 * @prop {number} friction this is the friction factor of the collider used to reduce its velocity.
		 */
	this.friction=0.5;
	/**
		 * @prop {string} bound this is the collision type of the collider.e.g "rectangular" or "circular"
		 */
	this.bounds=bound
	/**
		 * @prop {number}  width this is the width of the collider
		 */
	this.width=50;
	/**
		 * @prop {number}  height this is the height of the collider
		 */
	this.height=50;
	/**
		 * @prop {number} radius this is the radius of the collider for circular collider
		 */
	this.radius=50;
/**
		 * @prop {number} bounce this is the bounce factor used to reduce the bounce energy of the collider
		 */
	this.bounce=0.4;
	/**
		 * @prop {boolean} static if true, the collider is considered static and does not respond to collisions.
		 */
	this.static=false;
		/**
		 * @prop {boolean} ghost if true, the collider is does not collide but its trigger function runs when entered.
		 */
		this.ghost=false;
	/**
		 * @prop {string} color this is the color used to visualize the collider.
		 */
	this.color="green";
	this.deleted=false;
	obj.components[this.type]=this;
	obj.scene.colliders.push(this);
}
/**
	 * this function deletes the collider object from the scene at the start of the game cycle
	 * @function
	 * @memberof collider
	 * @returns {void}
	 */
delete_later(){
	if(this.object.scene!=null){
		this.object.scene.deleted.push(this);
		
	}
	
}
/**
 * this function deletes the collider object from the scene immediately
 * @function
 * @memberof collider
 * @returns {void}
 */
delete(){
	
	if(this.object.scene!=null){
	
			if(this.object.scene.colliders.includes(this)){
			
				this.object.scene.colliders.splice(this.object.scene.colliders.indexOf(this),1)
			}
			this.object.components["collider"]=null;
			this.deleted=true;
			delete(this);
		
	}
	
}

	/**
  * this function called when the collider collides with another collider. this function used to set game logic.
  * @function
  * @param {colObj} col this is the collider that has been collided with.
  * @memberof colObj
  */
	trigger(col){
	
	}
	resolveVelocity(vector){
		if(this.object.active=true&&this.static==false){
		var rigidbody1=this.object.components["rigidbody"];
		if(rigidbody1){
			var vel=-dotP(rigidbody1.velocity,vector);

		
			
			rigidbody1.velocity=scaleVec(vector,this.bounce*vel);
			var acc=rigidbody1.updateAcceleration();
			//normal reaction
			acc=-dotP(acc,vector);
			rigidbody1.applyForce(scaleVec(vector,acc));
		

			
		}
		}
	}
	resolvePosition(vec){
		if(this.object.active=true && this.static==false){
		this.object.position.x+=vec.x;
		this.object.position.y+=vec.y;
		}
		
	}
	//check mouse over
	/**
	 * this function is used to check if the mouse is with in the collider, and returns null if false.
	 * @function
	 * @memberof colObj
	 * @returns {null|colObj}
	 */
	mouseCollision(){
		var mpos=this.object.scene.canvas.event_system.mouseObj.worldposition;
		var pos=this.object.position;
		//for circular collision
		if(this.bounds==circular){
			
				var dist=subVec(pos,mpos).magnitude;
				if(dist<this.radius){
					return this;
				}
		}
		//for rectangular collider
		else{
			
			if(this.bounds==rectangular){
				var w=this.width;
				var h=this.height;
				var edges=dbox_edges(dverts(pos,w,h,this.object.rotation));
				var axis=get_line(pos,mpos);
				
				var hits=[];
				for(i in edges){
					var pt=intersect_segment(axis,edges[i]);
					if(pt!=null){
						var segment=[pos,mpos]
						if(pt_segment(pt,segment)==null){
						
						hits.push(pt);
						}
						
					}
				}
				//if hits > 2 , there is potential collision
				if(hits.length>=2&&hits.length%2==0){
					
					return this;	
				}
		
			}
		}
		return null;
	}
	/**
	 * this function returns the normals of the collider for rectangular colliders
	 * @memberof colObj
	 * @function
	 * @returns {null|Object} {"top":top_normal,"right":right_normal,"top":bottom_normal,"left":left_normal,}
	 */
	getNormals(){
		if(this.bounds==rectangular){
			
			 var verts=dverts(this.object.position,this.width,this.height,this.object.rotation);
			 var normals=dnormals(verts);
			 normals={
				 top:normals[0],
				 right:normals[1],
				 bottom:normals[2],
				 left:normals[3]
			 }
			 return normals;
		}
		else{
			return null;
		}
	}
	/**
	 * this function is used to render the visuals of the collider.
	 * @function
	 * @memberof colObj
	 * @returns {void}
	 */
	render(){
	
		if(this.visualize==true){
	    var scene=this.object.scene;
		var ctx=scene.canvas.ctx;
		ctx.beginPath();
	
		if(this.bounds==rectangular){
		var verts1=dverts(this.object.position,this.width,this.height,this.object.rotation);

		var l1=new line(scene,verts1[0],verts1[1],this.color)	
		var l2=new line(scene,verts1[1],verts1[2],this.color)	
		var l3=new line(scene,verts1[2],verts1[3],this.color)		
		var l4=new line(scene,verts1[3],verts1[0],this.color)	
		l1.update();
		l2.update();
		l3.update();
		l4.update();
		
		}
		else{
		ctx.strokeStyle=this.color;
		ctx.lineWidth=this.lineWidth;
		ctx.arc(this.object.position.x,this.object.position.y,this.radius,0,Math.PI*2,true);
		ctx.stroke();
		}
		ctx.closePath();
		}
	}
	/**
	 * this function is sets the size of the collision bounds of the collider.
	 * @function
	 * @param {Array} size this is an array of the size of the bounds.e.g [width,height] for rectangular colliders and [radius] for circular colliders
	 * @memberof colObj
	 * @returns {void}
	 */
	setBounds(size){
		if(this.bounds==rectangular){
			this.width=size[0];
			this.height=size[1];
		}
		if(this.bounds==circular){
			this.radius=size[0];
		}
	}
	/**
	 * this function is returns the bounds of the collider
	 * @function
	 * @memberof colObj
	 * @returns {Array}  [width,height] for rectangular colliders and [radius] for circular colliders
	 */
	getBounds(){
		if(this.bounds==rectangular){
			return [this.width,this.height]
		}
		if(this.bounds==circular){
			
			return [this.radius]
		}
		
	}
	/**
	 * this function is returns the position of the collider
	 * @function
	 * @memberof colObj
	 * @returns {vec2d} position
	 */
	pos(){
		return this.object.position;
	}
	/**
	 * this function updates the collider on every frame.
	 * @function
	 * @memberof colObj
	 * @returns {void}
	 */
	update(){
		if(this.deleted==false){
			this.render();
		}
		
	}
}
//response ratios
function cratio(bol1,bol2){
if(bol1==false && bol2==false){return [0.5,0.5];}
if(bol1==true && bol2==false){return [0,1]}
if(bol1==false && bol2==true){return [1,0]}
if(bol1==true && bol2==true){return [0,0]}
return [0,0];
}

//2d projections for SAT 
function project2d(verts,normal){
	var values=[];
	for(i in verts){
		values.push(dotP(verts[i],normal));
	}
	return values;
}

//check projection overlap
function overlap2d(verts1,verts2,normals,normals2,col1,col2,ratios,alt=false){
	var hits=0;
	var overlap=null;
	//direction for resolving position
	var direction=null;
	for(i in normals){
		var n=normals[i];
		if(alt==false){
		var p1=range(project2d(verts1,n));
		var p2=range(project2d(verts2,n));
		}
		if(alt==1){
			var s=dotP(verts1[0],n)
			var p1={
				"min":s-col1.radius,
				"max":s+col1.radius,
			};
			var p2=range(project2d(verts2,n));
		}
		if(alt==2){
			var p1=range(project2d(verts1,n));
			var s=dotP(verts2[0],n)
			var p2={
				"min":s-col2.radius,
				"max":s+col2.radius,
			};
		}
		if(overlap==null){
			overlap=minVal(p1.max,p2.max)-maxVal(p2.min,p1.min);
			direction=[n,1];
		}
		else{
			lap=minVal(p1.max,p2.max)-maxVal(p2.min,p1.min);
			if(lap<overlap){
				overlap=lap;
				direction=[n,1];
			}
		}
		if((p1.max>=p2.max&&p1.min>=p2.max)||(p2.max>=p1.max&&p2.min>=p1.max)){
			hits++;
			break;
		}
	}
	
	for(i in normals2){
		var n=normals2[i];
		if(alt==false){
		var p1=range(project2d(verts1,n));
		var p2=range(project2d(verts2,n));
		}
		if(alt==1){
			var s=dotP(verts1[0],n);
			var p1={
				"min":s-col1.radius,
				"max":s+col1.radius,
			};
			var p2=range(project2d(verts2,n));
		}
		if(alt==2){
			var p1=range(project2d(verts1,n));
			var s=dotP(verts2[0],n)
			var p2={
				"min":s-col2.radius,
				"max":s+col2.radius,
			};
		}
		if(overlap==null){
			overlap=minVal(p1.max,p2.max)-maxVal(p2.min,p1.min);
			direction=[n,2];
		}
		else{
			lap=minVal(p1.max,p2.max)-maxVal(p2.min,p1.min);
			if(lap<overlap){
				overlap=lap;
				direction=[n,2];
			}
		}
		if((p1.max>=p2.max&&p1.min>=p2.max)||(p2.max>=p1.max&&p2.min>=p1.max)){
			hits++;
			break;
		}
	}
	
	
	//collision
	if(hits==0){
		//triggering collision detection
	
		if(col2.ghost==false){
			col1.trigger(col2);
		}
		if(col1.ghost==false){
			col2.trigger(col1);
		}
		
		

		//resolving directions
		var ndir=direction[0];
		var diff=subVec(col1.object.position,col2.object.position);
		//overlap
		var d=overlap;
		//directional factor
		f=dotP(ndir,diff);
		//direction sign
		if(f<0){var p=-1;}
		else{var p=1;}
		if(col1.ghost==false && col2.ghost==false){
		col1.resolvePosition(scaleVec(ndir,-d*p*ratios[0]));
		col2.resolvePosition(scaleVec(ndir,d*p*ratios[1]));
		col1.resolveVelocity(scaleVec(ndir,-1));
		col2.resolveVelocity(scaleVec(ndir,1));
		}
		
		
	}
	return null;
}

//collision dectection
/**
 * this function detects collision between two colliders,and calls their trigger functions if a collision detected.
 * @function
 * @param {colObj} col1 this is the first collider
 * @param {colObj} col2 this is the second collider
 * @returns {void}
 */
function collisionDetect(col1,col2){
var type1=col1.bounds;
var type2=col2.bounds;
var pos1=col1.object.position;
var pos2=col2.object.position;
var dir=subVec(pos1,pos2);
var dist=dir.magnitude;
var ratios=cratio(col1.static,col2.static);
//static collision
//spherical collision 
if(type2==circular&&type1==circular){
	//collision detection
	var hit=false;
	var dist_n=dist-(col1.radius+col2.radius)
	if(dist_n<=0){
			var f=Math.abs(dist_n);
			if(col1.ghost==false && col2.ghost==false){
				col1.resolvePosition(scaleVec(dir,-f*ratios[0]));
				col2.resolvePosition(scaleVec(dir,f*ratios[1]));
				col1.resolveVelocity(scaleVec(dir,-1));
				col2.resolveVelocity(scaleVec(dir,1));
			}
		
			if(col2.ghost==false){
			col1.trigger(col2);
			}
			if(col1.ghost==false){
			col2.trigger(col1);
			}
		
	}		
	

}


//sphere and box collision
if(type1==rectangular&&type2==circular){
	//box collider veritces
	var verts1=dverts(col1.object.position,col1.width,col1.height,col1.object.rotation);
	var verts2=[col2.object.position];
	//collider normals
	var n1=dnormals(verts1);
	//closest point to circle
	var n2=[null];
	var prev_d=null;
	for(i in verts1){
		d=subVec(verts2[0],verts1[i]).magnitude;
		if(prev_d==null){
			prev_d=d;
			n2=[subVec(verts2[0],verts1[i]).normalized()];
		}
		else{
			if(d<prev_d){
				prev_d=d;
				n2=[subVec(verts2[0],verts1[i]).normalized()];
			}

		}
	}
	var col_data=overlap2d(verts1,verts2,n1,n2,col1,col2,ratios,2);
}
if(type2==rectangular&&type1==circular){
	//box collider veritces
	var verts2=dverts(col2.object.position,col2.width,col2.height,col2.object.rotation);
	var verts1=[col1.object.position];
	//collider normals
	var n2=dnormals(verts2);
	//closest point to circle
	var n1=[null];
	var prev_d=null;
	for(i in verts2){
		d=subVec(verts1[0],verts2[i]).magnitude;
		if(prev_d==null){
			prev_d=d;
			n1=[subVec(verts1[0],verts2[i]).normalized()];
		}
		else{
			if(d<prev_d){
				prev_d=d;
				n1=[subVec(verts1[0],verts2[i]).normalized()];
			}

		}
	}
	var col_data=overlap2d(verts1,verts2,n1,n2,col1,col2,ratios,1);
}
//box and box collision
if(type2==rectangular&&type1==rectangular){
		//collider veritces
		var verts1=dverts(col1.object.position,col1.width,col1.height,col1.object.rotation);
		var verts2=dverts(col2.object.position,col2.width,col2.height,col2.object.rotation);
		//collider normals
		var n1=dnormals(verts1);
		var n2=dnormals(verts2);
		var col_data=overlap2d(verts1,verts2,n1,n2,col1,col2,ratios);
}
}

//constructors
/**
 * this function creates new collider
 * @function
 * @param {GameObject} obj this is the game object that collider belongs to.
 * @param {string} bound this is the collision type of the collider.e.g "rectangular" or "circular"
 * @returns {colObj} collider
 */
function collider(obj,bounds=rectangular){
	var col=new colObj(obj,bounds)
	return col;
}
/**
 * this function creates new rigidbody
 * @function
* @param {GameObject} obj this is the game object that the rigidbody belongs to.
 * @returns {colObj} collider
 */
function rigidbody(obj){
	var rig=new rigidObj(obj);
	return rig;
}
