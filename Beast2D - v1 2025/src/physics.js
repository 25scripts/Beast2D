/**
 *Vectors module
 *@module Physics
 */
//system variables
const circular="circular";
const rectangular="rectangular"
//gravity force
const gravity=vec(0,0.05);

//rigidbody component
/**
 * @class
 * @global
 */
var rigidObj=function(obj){
	this.mass=1;
	this.acceleration=vec(0,0);
	this.velocity=vec(0,0);
	this.gravity=true;
	this.object=obj;
	this.forces=[];
	this.dt=1;
	this.type="rigidbody"
	this.drag=0.0;
	this.active=true;
	obj.components[this.type]=this;
}
rigidObj.prototype={
	applyForce:function(force){
		this.forces.push(force);
	},
	get_forces:function(){
		var vector=vec(0,0);
		for(i in this.forces){
				var f=this.forces[i];
				vector=addVec(vector,this.forces.pop(f));
		}
		return vector;
	},
	delete:function(){
		if(this.scene!=null){
			this.objects.components.splice(this.objects.components.indexOf(this),1)
		}
	},
	addDrag:function(){
		var drag=scalP(this.velocity,this.velocity);
		drag=scaleVec(drag,-this.drag/this.mass);
	},
	setVelocity:function(v){
		this.velocity=v;
	},
	//update acceleration
	updateAcceleration:function()
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
	},
	process:function(){
	if(this.object!=null&&this.active==true){
		acc=this.updateAcceleration();
		var position=addVec(this.object.position,this.velocity)
		this.object.position.x=position.x;
		this.object.position.y=position.y;
		this.velocity=addVec(this.velocity,acc);
	}
	}
	,
	update:function(){
	}
}
//colliders
/**
 * @class
 * @global
 */
var colObj=function(obj,bound="rectangular"){
	this.object=obj;
	this.active=true;
	this.visualize=false;
	this.type="collider";
	this.friction=0.5;
	this.bounds=bound
	this.width=50;
	this.height=50;
	this.radius=50;

	this.bounce=0.4;
	this.static=false;
	this.color="green";
	obj.components[this.type]=this;
	obj.scene.colliders.push(this);
}
colObj.prototype={
	delete:function(){
		if(this.scene!=null){
			this.objects.scene.colliders.splice(this.objects.scene.colliders.indexOf(this),1)
			this.objects.colliders.splice(this.objects.colliders.indexOf(this),1)
		}
	},
	trigger:function(col){
	
	},
	resolveVelocity:function(vector){
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
	},
	resolvePosition:function(vec){
		if(this.object.active=true && this.static==false){
		this.object.position.x+=vec.x;
		this.object.position.y+=vec.y;
		}
		
	},
	//check mouse over
	mouseCollision:function(){
		var mpos=mouseObj.worldposition;
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
	},
	getNormals:function(){
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
	},
	render:function(){
		
		if(this.visualize==true){
		var gl=canvas.gl;
		gl.beginPath();
	
		if(this.bounds==rectangular){
		var verts1=dverts(this.object.position,this.width,this.height,this.object.rotation);

		l1=new line(verts1[0],verts1[1],this.color)	
		l2=new line(verts1[1],verts1[2],this.color)	
		l3=new line(verts1[2],verts1[3],this.color)		
		l4=new line(verts1[3],verts1[0],this.color)	
		l1.update();
		l2.update();
		l3.update();
		l4.update();
		
		}
		else{
		gl.strokeStyle=this.color;
		gl.lineWidth=this.lineWidth;
		gl.arc(this.object.position.x,this.object.position.y,this.radius,0,Math.PI*2,true);
		gl.stroke();
		}
		gl.closePath();
		}
	},
	setBounds:function(size){
		if(this.bounds==rectangular){
			this.width=size[0];
			this.height=size[1];
		}
		if(this.bounds==circular){
			this.radius=size[0];
		}
	},
	getBounds:function(){
		if(this.bounds==rectangular){
			return [this.width,this.height]
		}
		if(this.bounds==circular){
			
			return [this.radius]
		}
		
	},
	pos:function(){
		return this.object.position;
	},
	update:function(){

			this.render();
			
		
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
		col1.trigger(col2);
		col2.trigger(col1);
		

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
		
		col1.resolvePosition(scaleVec(ndir,-d*p*ratios[0]));
		col2.resolvePosition(scaleVec(ndir,d*p*ratios[1]));
		col1.resolveVelocity(scaleVec(ndir,-1));
		col2.resolveVelocity(scaleVec(ndir,1));
		
		
	}
	return null;
}

//collision dectection
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
			col1.resolvePosition(scaleVec(dir,-f*ratios[0]));
			col2.resolvePosition(scaleVec(dir,f*ratios[1]));
			col1.resolveVelocity(scaleVec(dir,-1));
			col2.resolveVelocity(scaleVec(dir,1));
			
			col1.trigger(col2);
			col2.trigger(col1);
	}		
	else{

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
function collider(obj,bounds=rectangular){
	var col=new colObj(obj,bounds)
	return col;
}
function rigidbody(obj){
	var rig=new rigidObj(obj);
	return rig;
}
