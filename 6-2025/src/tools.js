//look at object
function lookAt(obj,target){
	var pos1=obj.position;
	if(target.type=="vec"){
		var pos2=target;
	}else{
	var pos2=target.position;
	}
	var dir=subVec(pos1,pos2);
	var angle=dir.getAngle();
	
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
function frameTool(){
	var ftool=new frameObj();
	return ftool;
}