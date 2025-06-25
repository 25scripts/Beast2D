/**
 *Vectors module
 *@module Vectors
 */

//constructors
/**
 * this is a function creates 2d vector 
 * @param {number} x this is the x component of the vector
 * @param {number} y this is the y component of the vector
 * @returns {vec2d} vec2d
 */
function  vec(x,y){
	
	var v=new vec2d(x,y);
	
	return v;
}


//2d vector object
/**
 * This is vector 2d object
 * This returns 2d vector in form an object
 * @global
 * @typedef {Object} vec2d
 * @param {number} x this is the x component of the vector
 * @param {number} y this is the y component of the vector
 * @prop {number} x this is the x component of the vector
 * @prop {number} y this is the y component of the vector
 * @prop {number} nx this is the normalized x component of the vector computed on creation
 * @prop {number} ny this is the normalized y component of the vector computed on creation
 * @prop {number} magnitude this is the magnidute of the vector computed on creation
 * @prop {Function} normalized this function returns a normalized copy of 2d vector 
 * @prop {Function} getMagnitude this function returns the current magnitude of the vector
 * @prop {Function} getAngle this function returns the angle of vector with the x-axis in radians
 * @prop {Function} copy this function returns a copy of the vector
 * @returns vec2d
 */
var vec2d=function(x,y){
	this.type="vec"
	this.x=parseFloat(x);
	this.y=parseFloat(y);
	
	vx=this.x*this.x;
	vy=this.y*this.y;
	
	this.magnitude=sqrt(vx+vy);
    
	this.nx=this.x/this.magnitude;
	this.ny=this.y/this.magnitude;
	return this;
}

vec2d.prototype.getMagnitude=function(){
	this.magnitude=parseFloat(sqrt(this.x*this.x+this.y*this.y));
	return this.magnitude;
}
vec2d.prototype.normalized=function(){
	this.getMagnitude();
	this.nx=this.x/this.magnitude;
	this.ny=this.y/this.magnitude;
	var v=vec(this.nx,this.ny);
	return v;
}
vec2d.prototype.getAngle=function(){
var hyp=sqrt(this.nx*this.nx+this.ny*this.ny);
var angle=180*asin(this.ny/hyp)/Math.PI;


return angle;

}
vec2d.prototype.copy=function(){
	var copy=copyVec(this);
	return copy;
}
//magnitude
/**
 * this function that computes the magnitude of two vectors
 * @function
 * @param {number} x  this is the x component of first vector
 * @param {number} y this is the y component of first vector
 * @param {number} x2  this is the x component of second vector
 * @param {number} y2 this is the y component of second vector
 * @returns {float}
 */
function magnitude(x,y,x2,y2){
	var vx=parseFloat(x2-x);
	var vy=parseFloat(y2-y);
	vx=vx*vx;
	vy=vy*vy;
	var mag=parseFloat(sqrt(vx+vy));
	return parseFloat(Math.sign(mag)*mag);
	
}

//dotProduct
function dotP(vec1,vec2){
	var v=vec1.x*vec2.x+vec1.y*vec2.y;
	return v;
}
//normalvector
function nvec(v1){
	var v=vec(v1.y,-v1.x);
	return v;
}
//scaleVector
function scaleVec(vec,factor){
	var v=vec.normalized();
	v.x*=factor;
	v.y*=factor;
	return v;
}
//CopyVector 
function copyVec(vec){
	var v=new vec2d(vec.x,vec.y);
	return v;
}
//add vector
function addVec(vec1,vec2){
	var v=new vec2d(vec2.x+vec1.x,vec2.y+vec1.y);
	return v;
}
//subtract vector

function subVec(vec1,vec2){
	var v=new vec2d(parseFloat(vec2.x-vec1.x),parseFloat(vec2.y-vec1.y));
	return v;
}
//correct_angle
function correct_angle(theta,vec){
	var rot1=theta;
	if(vec.y<0&&vec.x<0){rot1=rot1+180*Math.PI/180}
    if(vec.y>0&&vec.x<0){rot1=(rot1+360*Math.PI/180)+180*Math.PI/180}
	return rot1;
}
//rotate vec
function rotVec(v,rot,origin=vec(0,0)){
	 var dx=v.x-origin.x;
	 var dy=v.y-origin.y;
	 //angle in radians;
	 var theta=rot*Math.PI/180;
	 v.x= dx*cos(theta)-dy*sin(theta)+origin.x;
	 v.y= dx*sin(theta)+dy*cos(theta)+origin.y;

}
//vector to cartesion line
function get_line(p1,p2){
	//definition  if vertical, line_def=true
	var line_def=false
	var grad=0;
	var constant=0;
	//compute the gradient
	if((p2.x-p1.x)==0){
		constant=p1.x;
		line_def=true;
	}
	else{
		grad=((p2.y-p1.y)/(p2.x-p1.x))
		constant=(p2.y-((p2.y-p1.y)/(p2.x-p1.x))*p2.x);
	}
	//line definition
	var lineObj={
		//gradient
		m:grad,
		//constant
		c:constant,
		def:line_def
	}
	
	return lineObj;
}
//check if on point on line segment
function pt_segment(c,segment){
	var a=segment[0];
	var b=segment[1];

	var ab=subVec(a,b);
	var ac=subVec(a,c);
	var kac=dotP(ab,ac);
	var kab=dotP(ab,ab);
	

	if(kac>0&&kac<kab){

		return c;
	}
	else{
		return null;
	}
}
//line and line segment interection
function intersect_segment(line,segment){
 var a=segment[0];
 var b=segment[1];
 var l=get_line(a,b);

 var c=intersect_line(line,l);
 if(c==null){
		return null;
 }
 else{
	var ab=subVec(a,b);
	var ac=subVec(a,c);
	var kac=dotP(ab,ac);
	var kab=dotP(ab,ab);
	if(kac>0&&kac<kab){
		return c;
	}
	else{
		return null;
	}

 }
}
//line instersection
function intersect_line(line1,line2){
			
		if(line1.def==false&&line2.def==false){
		//gradient difference
		var gdiff=(line2.m-line1.m);
		if(gdiff!=0){
		var x=((line1.c-line2.c)/gdiff);
		var y=(line1.m*x+line1.c)
		//intersection point as a vector	
		return vec(x,y);
		}
		else{
			//there is no intersection or lines are parallel
			return null;
		}
		}
		else{
			//if both lines are vertical, no intersection
			if(line1.def==true&&line2.def==true){
				return null;
			}
			//if line one is vertical
			if(line2.def==false){
				var x=line1.c;
				var y=(line2.m*x+line2.c)
				//intersection point as a vector	
				return vec(x,y);
			}
			//if line two is vertical
			if(line1.def==false){
				var x=line2.c;
				var y=(line1.m*x+line1.c)
				//intersection point as a vector	
				return vec(x,y);
			}
		}	
		return null;
}
//midpoint of vectors
function midVec(v1,v2){
	var v=vec((v1.x+v2.x)/2,(v1.y+v2.y)/2)
	return v;
}
//get centroid of list of vectors
function get_centroid(vec_list){
	var x0=0;
	var y0=0;
	var num=vec_list.length;
	for(i in vec_list){
		var v=vec_list[i];
		x0+=v.x;
		y0+=v.y;

	}

	if(num!=0){
		x0=parseFloat(x0/num);
		y0=parseFloat(y0/num);
		return vec(x0,y0);
	}
	else{
		return null;
	}
}
//decompose box to vertices with position is at center
function dverts(pos,w,h,rot=0){
	var x=pos.x;
	var y=pos.y;
	//vertices in clockwise order from top left corner
	var verts=[
		vec(x-w/2,y-h/2),
		vec(x+w/2,y-h/2),
		vec(x+w/2,y+h/2),
		vec(x-w/2,y+h/2)
	];
	//applying rotation
	for(i in verts){
		rotVec(verts[i],rot,pos);
	}
	verts.push(pos);
	return verts;
}
//decompose box normals
function dnormals(verts){
	var cent=verts[verts.length-1];
	//main normals
	var normals=[
		subVec(cent,midVec(verts[0],verts[1])).normalized(),
		subVec(cent,midVec(verts[1],verts[2])).normalized(),
		subVec(cent,midVec(verts[2],verts[3])).normalized(),
		subVec(cent,midVec(verts[3],verts[0])).normalized(),
	
	];
	return normals;
}
//decompose box edges
function dbox_edges(verts){
	 //edges of the box
	
	 var edges=[
			[verts[0],verts[1]],
			[verts[1],verts[2]],
			[verts[2],verts[3]],
			[verts[3],verts[0]]
	 ]
	 return edges;
}
//absolute 
function abs(x){return Math.abs(x);}
//cosine
function cos(x){return Math.cos(x);}
//sine
function sin(x){return Math.sin(x);}
//tan
function tan(x){return Math.tan(x);}
//atan
function atan(x){return Math.atan(x);}
//asin
function asin(x){return Math.asin(x);}
//acos
function acos(x){return Math.acos(x);}
//square root
function sqrt(x){return Math.sqrt(x);}
//min value
function minVal(x,y){return Math.min(x,y);}
//max value
function maxVal(x,y){return Math.max(x,y);}
//max and min of range
function range(list,min0=0,max0=0){
	var i=0;
	var maxv=min0;
	var minv=max0;
	if(list.length>1){
	while(i<list.length-1){
		var v1=list[i];
		if(i==0){maxv=v1;minv=v1;}
		var v2=list[i+1];
		maxv=maxVal(maxv,v2);
		minv=minVal(minv,v2);
		i++;
	}
	}
	else{
		if(list.length==1){return {"min":list[0],"max":list[0]};}
	}
	return {"min":minv,"max":maxv};
}
//pair objects list
function pairOf(list){
	var pairs=[]
	for(i in list){
		var pair=[];
		var obj=list[i];
		var a=parseInt(i)+1;
		while(a<list.length){
			var obj2=list[a]
			pair=[obj,obj2];
			pairs.push(pair);
			a++;
		}
	}
	return pairs;
}
