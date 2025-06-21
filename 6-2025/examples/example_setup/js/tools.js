/**
 *this is the tools module that contains special actions e.g. look at objects and measure frame rate;
 *@module Tools
 */
//look at object
/**
 * this function makes an gameobject face in the direction of vector or gameobject.
 * @function
 * @param {GameObject} obj this is the gameobject to apply the rotation.
 * @param {object} target this is another gameobject or vector. 
 * @param {vec2d} offset this is offset vector from which the object positions are relative. the defualt value is null;
 * @returns {void} 
 */
function lookAt(obj,target,offset=null){
	var pos1=obj.position;
	if(target.type=="vec"){
		var pos2=target;
	}else{
	var pos2=target.position;
	}
	if(offset!=null){
		if(offset.type=="vec"){
			pos1=subVec(offset,pos1);
			pos2=subVec(offset,pos2);
		}
	}
	
	var dir=subVec(pos1,pos2).normalized();
	
	var angle=dir.getAngle();

	angle=correct_angle(angle,dir);
	
	obj.rotation=angle;
	
	
}
//frame tool
var frameObj=function (){
this.label=new label("Frames:0 FPS",center());
this.label.size=12;
this.count=0;
this.prev=null;
this.delay=20;
this.frames=0;
}
frameObj.prototype={
	compute:function(){
		var cur=performance.now();
		if(this.prev!=null&&this.frames>=this.delay){
		var t=(cur-this.prev)/1000;
		var c=parseInt(1/t);
		this.count=c;
		this.frames=0;
		}
		this.frames++;
		this.prev=cur;
	
	},
	render:function(){
		this.label.text="Frames: "+this.count+"FPS";
		this.label.update();
	}
	,update:function(){
		this.compute();
		this.render();
	}
}
//constructor
/**
 * this function measures  frame rate
 * @function
 * @returns {void} 
 */
function frameTool(){
	var ftool=new frameObj();
	return ftool;
}
/**
 * This is class for timer
 * This returns timer object
 * @class
 * @global
 */
class timerObj{
	/**
	 * 
	 * @param {number} interval this interval of timer for callback in seconds
	 * @param {object} callback callback function for the timer
	 * @param {object}  arg  this is the arg to the call back function
	
	 * @returns {vec2d} 2D Vector 
	 */
	constructor(interval,callback=null,arg=null){
	/**
	 * @prop {number} interval this interval of timer for callback in seconds
	 */
	this.interval=interval
		/**
	 * @prop {object}  arg  this is the arg to the call back function
	 */
	this.arg=arg;
	/**
	 * @prop {object} callback callback function for the timer
	 */
	this.callback=callback
	/**
	 * @prop {boolean} loop_once if set to true, the timer only runs once
	 */
	this.loop_once=false;
	this.active=false;
	}
	/**
 * this function to stops the timer
 * @function
 * @returns {void}
 */
stop(){
	
	this.active=false;
}
/**
 * this function to start the timer
 * @function
 * @param {boolean} loop_once if set to true, the timer only runs once
 * @returns {void}
 */
start(loop_once=false){
	this.active=true;
	this.loop_once=loop_once;
	setTimeout(this.update,this.interval,this);
	
}
update(obj){
	if(obj.active==false){
		return 0;
	}
   if(obj.callback!=null){
	if(obj.arg!=null){
		obj.callback(obj.arg)
	}
	else{
		obj.callback();
	}
	
   }
	
   if(obj.loop_once!=true){
	setTimeout(obj.update,obj.interval,obj);
   }
}
}
/**
 * this function to create new timer
 * @function
 * @param {number} interval this interval of timer for callback in seconds
* @param {object} callback callback function for the timer
* @param {object}  arg  this is the arg to the call back function
 * @returns {timerObj}
 */
function Timer(interval,callback=null,arg=null){
	return new timerObj(interval,callback,arg);
}


