/**
 *this is the vectors module that contains the vector class and math functions.
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
 * This is class for 2d vectors.
 * This returns 2d vector in form an object
 * @class
 * @global
 */
class vec2d{
	/**
	 * 
	 * @param {number} x this is the x component of the vector
	 * @param {number} y this is the y component of the vector
	 * @returns {vec2d} 2D Vector 
	 */
	constructor(x,y){
	/**
	 * @prop {string} type this the type of the object.e.g "vec" for vector
	 */
	this.type="vec"
	/**
	 * @prop {number} x this is the x component of the vector
	 */
	this.x=parseFloat(x);
	/**
	 * @prop {number} y this is the y component of the vector
	 */
	this.y=parseFloat(y);
	
	var vx=this.x*this.x;
	var vy=this.y*this.y;
	/**
	 * @prop {number} magnitude this is the magnitude of the vector computed on creation.
	 */
	this.magnitude=sqrt(vx+vy);
    /**
	 * @prop {number} nx this is the normalized y component of the vector computed on creation.
	 */
	this.nx=this.x/this.magnitude;
	/**
	 * @prop {number} ny this is the normalized y component of the vector computed on creation.
	 */
	this.ny=this.y/this.magnitude;
	return this;
}
/**
 * this function returns mangitude of the vector.
 * @function
 * @memberof vec2d
 * @returns {number} magnitude
 */
getMagnitude(){
	this.magnitude=parseFloat(sqrt(this.x*this.x+this.y*this.y));
	return this.magnitude;
}
/**
 * this function returns a normalzied copy of the vector.
 * @function
 * @memberof vec2d
 * @returns {vec2d} 2D vector
 */
normalized(){
	this.getMagnitude();
	this.nx=this.x/this.magnitude;
	this.ny=this.y/this.magnitude;
	var v=vec(this.nx,this.ny);
	return v;
}
/**
 * this function returns the angle of the vector with the x axis in degrees.
 * @function
 * @memberof vec2d
 * @returns {number} angle
 */
getAngle(){
var hyp=sqrt(this.nx*this.nx+this.ny*this.ny);
var angle=180*asin(this.ny/hyp)/Math.PI;


return angle;

}
/**
 * this function returns a copy of the vector.
 * @function
 * @memberof vec2d
 * @returns {vec2d} 2D vector
 */
copy(){
	var copy=copyVec(this);
	return copy;
}
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
/**
 * this function returns the dot product of two vectors
 * @function
 * @param {vec2d} vec1 this is the first vector
 * @param {vec2d} vec2 this is the second vector 
 * @returns {number} dot product
 */
function dotP(vec1,vec2){
	var v=vec1.x*vec2.x+vec1.y*vec2.y;
	return v;
}
//normalvector
/**
 * this function returns a normalized copy of the vector
 * @function
 * @param {vec2d} v1 this is the vector to be normalized.
 * @returns {vec2d} normalized vector
 */
function nvec(v1){
	var v=vec(v1.y,-v1.x);
	return v;
}
//scaleVector
/**
 * this is function scales a vector
 * @function
 * @param {vec2d} vec this is the vector to be scaled.
 * @param {number} factor factor to scale the vector with
 * @returns {vec2d} scaled vector
 */
function scaleVec(vec,factor){
	var v=vec.normalized();
	v.x*=factor;
	v.y*=factor;
	return v;
}
//CopyVector 
/** 
* this is function copys a vector
* @function
* @param {vec2d} vec this is the vector to be copy
* @returns {vec2d} copy of the vector
*/
function copyVec(vec){
	var v=new vec2d(vec.x,vec.y);
	return v;
}
//add vector
/**
 * this function adds two vectors
 * @function
 * @param {vec2d} vec1 this is the first vector
 * @param {vec2d} vec2 this is the second vector 
 * @returns {vec2d} vector
 */
function addVec(vec1,vec2){
	var v=new vec2d(vec2.x+vec1.x,vec2.y+vec1.y);
	return v;
}
//subtract vector
/**
 * this function subtracts two vectors
 * @function
 * @param {vec2d} vec1 this is the first vector
 * @param {vec2d} vec2 this is the second vector 
 * @returns {vec2d} vector
 */
function subVec(vec1,vec2){
	var v=new vec2d(parseFloat(vec2.x-vec1.x),parseFloat(vec2.y-vec1.y));
	return v;
}
//correct_angle
/**
 * this function converts angle of vector to 360 degrees angle starting from one zero point.
 * @function
 * @param {number} theta this is the angle of the vector
 * @param {vec2d} vec this is the vector that the angle belongs to. 
 * @returns {number} corrected angle
 */
function correct_angle(theta,vec){
	var rot1=theta;
	if(vec.x>=0 && vec.y>=0){
		return rot1;
	}
	else if(vec.x<0 && vec.y>=0){
		return (90-abs(rot1))+90;
	}
	else if(vec.x<0 && vec.y<0){
		return abs(rot1)+180;
	}
	else if(vec.x>=0 && vec.y<0){
		return (90-abs(rot1))+270;
	}
	
	return rot1;
}
//rotate axis
/**
 * this function returns vector based a rotate x and y axis
 * @param {vec2d} v this is the vector to be transformed
 * @param {vec2d} rx  this is positive vector for rotated x -axis
 * @param {vec2d} ry this is positive vector for rotated y-axis
 * @returns {void}
 */
function rotateAxis(v,rx,ry){
	
	var nx=rx.normalized();
	var ny=ry.normalized();

	var rvx=scaleVec(nx,-v.y);
	var rvy=scaleVec(ny,v.x);

	return addVec(rvx,rvy);


}
//rotate vec
/**
 * this function rotates a vector about a point
 * @param {vec2d} v this is the vector to be rotated
 * @param {number} rot this is the degree of rotation
 * @param {vec2d} origin this is the center of rotation
 * @returns {void}
 */
function rotVec(v,rot,origin=vec(0,0)){
	 var dx=v.x-origin.x;
	 var dy=v.y-origin.y;
	 //angle in radians;
	 var theta=rot*Math.PI/180;
	 v.x= dx*cos(theta)-dy*sin(theta)+origin.x;
	 v.y= dx*sin(theta)+dy*cos(theta)+origin.y;

}
//vector to cartesion line
/**
 * this is function creates a line based on a slope and a constant from two points.
 * @param {vec2d} p1  this is the first point of the line
 * @param {vec2d} p2 this is the end point of the line
 * @returns {Object} {"m":gradient,"c":constant,"def":true if line is vertical}
 */
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
/**
 * this function checks if a point is on segment and returns null if false otherwise it returns the point.
 * @function
 * @param {vec2d} c this is the point
 * @param {vec2d[]} segment this is an array of two vectors forming the segment
 * @returns {null|vec2d}
 */
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
/**
 * this function checks if a  line is intersects segment and returns null if false otherwise it returns the line object.
 * @function
 * @param {Object} line this is the line object.e.g {"m":gradient,"c":constant,"def":true if line is vertical}
 * @param {vec2d[]} segment this is an array of two vectors forming the segment
 * @returns {null|Object}
 */
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
/**
 * this function checks if two lines intersect, and returns null if they don't intersect otherwise returns the point of intersection
 * @function
 * @param {Object} line1 this is the first line object in the form return by the get get_line function
 * @param {Object} line2  this is the second line object in the form return by the get get_line function
 * @returns {null|vec2d} 
 */
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
/**
 * this function returns the mid point of two vectors
 * @function
 * @param {vec2d} v1 this is the first vector
 * @param {vec2d} v2 this is the second vector
 * @returns {vec2d} midpoint
 */
function midVec(v1,v2){
	var v=vec((v1.x+v2.x)/2,(v1.y+v2.y)/2)
	return v;
}
//get centroid of list of vectors
/**
 * this is function returns the centroid of the list of vectors
 * @function
 * @param {vec2d[]} vec_list this is the array of vectors
 * @returns {null|vec2d}
 */
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
/**
 * this function converts a rectangle defintion into its vertices. vertices in clockwise order from top left corner
 * @function
 * @param {vec2d} pos this is the center of the rectangle
 * @param {number} w this is the width of the rectangle
 * @param {number} h this is the height of the rectangle
 * @param {number} rot this is the rotation of the rectangle
 * @returns {vec2d[]} vertices
 */
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
/**
 * this function converts vertices of rectangle into normals. the normals returned are in clockwise order from the top of the rectangle.
 * @function
 * @param {vec2d[]} verts these are the vertices of the rectangle
 * @returns {vec2d[]} an array of normalized vectors representing the normals of the rectangle
 */
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
/**
 * this function returns the edges of a rectangle. the edges are returned in a clockwise order starting with the top edge.
 * @param {vec2d[]} verts this is the array of the vertices of the rectangle 
 * @returns {Array} this is the array of the edges of the rectangle as arrays of the two vectors.
 */
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
/**
 * this function returns the absolute value of the value
 * @function
 * @param {number} x  this is value to be converted
 * @returns {number}
 */
function abs(x){return Math.abs(x);}
//cosine
/**
 * this function returns the cosine of angle
 * @function
 * @param {number} x  this is the angle in radians
 * @returns {number}
 */
function cos(x){return Math.cos(x);}
//sine
/**
 * this function returns the sine of angle
 * @function
 * @param {number} x  this is the angle in radians
 * @returns {number}
 */
function sin(x){return Math.sin(x);}
//tan
/**
 * this function returns the tan of angle
 * @function
 * @param {number} x  this is the angle in radians
 * @returns {number}
 */
function tan(x){return Math.tan(x);}
//atan
/**
 * this function returns computes the arc tan
 * @function
 * @param {number} x  
 * @returns {number} angle in radians
 */
function atan(x){return Math.atan(x);}
//asin
/**
 * this function returns computes the arc sine
 * @function
 * @param {number} x  
 * @returns {number} angle in radians
 */
function asin(x){return Math.asin(x);}
//acos
/**
 * this function returns computes the arc cosine
 * @function
 * @param {number} x  
 * @returns {number} angle in radians
 */
function acos(x){return Math.acos(x);}
//square root
/**
 * this function returns the square root of number
 * @function
 * @param {number} x  
 * @returns {number}
 */
function sqrt(x){return Math.sqrt(x);}
//min value
/**
 * this function returns the minimum value of two values
 * @function
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
function minVal(x,y){return Math.min(x,y);}
//max value
/**
 * this function returns the maximum of two values
 * @function
 * @param {number} x  
 * @param {number} y  
 * @returns {number}
 */
function maxVal(x,y){return Math.max(x,y);}
//max and min of range
/**
 * this function returns the minimum and maximum values from list
 * @function
 * @param {number[]} list this is array of the numbers
 * @param {number} min0 this is default minimum
 * @param {number} max0  this is the default maximum
 * @returns {Object} {"min":minimum,"max":maximum}
 */
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
/**
 * this function generates pairs from a list array
 * @param {Array} list 
 * @function
 * @returns {Array} an array of pairs of the list elements
 */
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
