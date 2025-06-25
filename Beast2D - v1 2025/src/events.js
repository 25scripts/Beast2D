//loading event
const loader={
	"actions":[],
	
	run:function(){
	for(i in this.actions){
		var act=this.actions[i]
		act();
	}
}
}
//mouse down
const mdown={
	"actions":[],
	
	run:function(){
		
		for(i in this.actions){
			var act=this.actions[i]
			act();
		}
	}
}
//mouseup events
const mup={
	"actions":[],
	
	run:function(){
		
		for(i in this.actions){
			var act=this.actions[i]
			act();
		}
	}
}
//clicks events
const mclicks={
	"actions":[],
	
	run:function(){
		
		for(i in this.actions){
			var act=this.actions[i]
			act();
		}
	}
}
//drag event
const mdrag={
	"actions":[],
	
	run:function(){
		for(i in this.actions){
			
			var act=this.actions[i]
			act();
		}
	}
}
//mouseobject
var mouseStruct2D=function(){
	this.position=vec(0,0);
	this.worldposition=vec(0,0);
	this.currentObj=null;
	this.type="mouseObj";
	this.mtouch=false;
	this.over=false;
	this.selector=null;
	this.states={};
	this.csignals=[];
	mclicks.actions.push(this.markObject);
	

}
mouseStruct2D.prototype={
	mouseOver:function(){
		var scn=canvas.currentScene;
		var coll=false;
		if(scn!=null){
		for(i in scn.colliders){
		var col=scn.colliders[i].mouseCollision();
		if(col!=null){
			return col
		}
		}
		}
		return null;
	},
	markObject:function(){
		
		var col=mouseObj.mouseOver();
		if(col!=null){
			mouseObj.selector.marked=col.object;
		}
		else{
			mouseObj.selector.marked=null;
		}
	},
	listen:function(key,event){
		var state=this.states[key];
	
		if(state){
			
			return state[event].active;
			
		}
		else{
			this.states[key]={
				"keyup":createInputState(),
				"click":createInputState(),
				"keydown":createInputState(),
				"move":createInputState()
			}
			return false;
		}
	},
	getState:function(key){
		var state=this.states[key]
		
		if(state){
			return state
		}
		else{
			this.states[key]={
				"keyup":createInputState(),
				"click":createInputState(),
				"keydown":createInputState(),
				"move":createInputState()
			}
			return this.states[key];
		}
	},
	clear:function(){
		for(i in this.csignals){
			this.csignals[i].active=false;
		}
	}
	
	
}
//mouse initance
const mouseObj=new mouseStruct2D();
//mouseInput function
function mouseInput(key="moved"){
	var keys={
		"moved":0,
		0:"LeftButton",
		1:"WheelButton",
		2:"RightButton",
	}
	 var i=new inputObj(keys[key],1);
 	return i;
}
//visual collision
function collide(mpos,obj){

var size=obj.getSize();
var x0=obj.position.x;
var y0=obj.position.y;

var x1=size[0]+x0;
var y1=size[1]+y0;



var xlock=false;
var ylock=false;
if((mpos.x>=x0)&(mpos.x<=x1)){
	xlock=true;
}
if((mpos.y>=y0)&(mpos.y<=y1)){
	ylock=true;
}
if((xlock==true)& (ylock==true)){
	if(mouseObj.currentObj!=null){
		mouseObj.currentObj.active=false;
	}
	
	mouseObj.currentObj=obj;
	return true;
}
else{
	
	return false;
}
	
}
//event handlers
function mclick(x,y,e){
	mouseObj.position.x=x;
	mouseObj.position.y=y;

	mouseObj.worldposition.x=x+camera.position.x;
	mouseObj.worldposition.y=y+camera.position.y;
	key=getKeyFromCode(e,1)
	
		
	var state=mouseObj.getState(key);

	state.click.active=true;
	if(state.click.response==true){
		keyboard.csignals.push(state.click);
	}
	
}
function mousedown(x,y,e){
	mouseObj.position.x=x;
	mouseObj.position.y=y;
	mouseObj.worldposition.x=x+camera.position.x;
	mouseObj.worldposition.y=y+camera.position.y;
	key=getKeyFromCode(e,1)

	var state=mouseObj.getState(key);
	state.keydown.active=true;
	if(state.keydown.response==true){
		keyboard.csignals.push(state.keydown);
	}
	
}
function mouseup(x,y,e){
	mouseObj.position.x=x;
	mouseObj.position.y=y;
	mouseObj.worldposition.x=x+camera.position.x;
	mouseObj.worldposition.y=y+camera.position.y;
	key=getKeyFromCode(e,1)
	
	var state=mouseObj.getState(key);
	state.keyup.active=true;
	if(state.keyup.response==true){
		keyboard.csignals.push(state.keyup);
	}
	
}
function mousemove(x,y,e){
	mouseObj.position.x=x;
	mouseObj.position.y=y;
	mouseObj.worldposition.x=x+camera.position.x;
	mouseObj.worldposition.y=y+camera.position.y;
	var state=mouseObj.getState(0);
	state.move.active=true;
	
	if(state.move.response==true){
		keyboard.csignals.push(state.move);
	}
	
}
//get key 
function getKeyFromCode(event,target=0){
	if(target==0){
	var key1=event.key;
	var key2=event.which;
	var key3=event.keyCode;
	if(key1){
	 var key=key1;
	 return key.toLowerCase();
	}
	else{
	if(key2){
		var key=key2;
		return key.toLowerCase();
	}
	else{
		if(key3){
			var key=String.fromCharCode(key3);
			return key.toLowerCase();
		}
	}
	}
	}
	else{
		key=event.button;
		var keys={
			"moved":0,
			0:"LeftButton",
			1:"WheelButton",
			2:"RightButton",
		}
		return keys[key];
	}
}
//inputObj to check events
var inputObj=function(key,target=0){
 this.key=key;
 //0 for keyboard and 1 for mouse;
 this.target=target;
}
inputObj.prototype={
down:function(){
	if(this.target==1){
		return mouseObj.listen(this.key,"keydown");
	}
	if(this.target==0){
	return keyboard.listen(this.key,"keydown");
	}
},
up:function(){
	if(this.target==1){
	return mouseObj.listen(this.key,"keyup");
	}
	if(this.target==0){
		return keyboard.listen(this.key,"keyup");
	}
},
click:function(){
	if(this.target==1){
		
		return mouseObj.listen(this.key,"click");
	}
	else{
		return null;
	}
},
move:function(){
	if(this.target==1){
		
		return mouseObj.listen(this.key,"move");
	}
	else{
		return null;
	}
}
}

//constructor
function input(key){
	var i=new inputObj(key,0);
	return i;
}
//input state
var inputState=function(response=true){
	this.active=false;
	//if true signal is trigger once each cycle and delete
	this.response=response;
	
	
}
//create input state
function createInputState(response=true,target=0){
	var s=new inputState(response,target);
	return s;
}
//keyup event
function keyup(event){
	var key=getKeyFromCode(event);
	state=keyboard.getState(key);
	state.keyup.active=true;
	state.keydown.active=false;
	if(state.keyup.response==true){
		keyboard.csignals.push(state.keyup);
	}
}
//keydown event
function keydown(event){
	var key=getKeyFromCode(event);
	state=keyboard.getState(key);
	state.keyup.active=false;
	state.keydown.active=true;
	
}
//keypress event
function keypress(event){
	var key=getKeyFromCode(event);
	state=keyboard.getState(key);
	state.keyup.active=false;
	state.keydown.active=true;
	
}
//keyboard object
var keyboardObj=function(){
	//key states
	this.states={}
	//signals to clear
	this.csignals=[];
}
keyboardObj.prototype={
	listen:function(keyString,event){
		var key=keyString.toLowerCase();
		var state=this.states[key];
		if(state){
		
			return state[event].active;
			
		}
		else{
			this.states[key]={
				"keyup":createInputState(),
				"keydown":createInputState(false)
			}
			return false;
		}
	},
	getState:function(keyString){
		var key=keyString.toLowerCase();
		var state=this.states[key]
		if(state){
			return state;
		}
		else{
			this.states[key]={
				"keyup":createInputState(),
				"keydown":createInputState(false)
			}
			return this.states[key];
		}
	},
	clear:function(){
		for(i in this.csignals){
			this.csignals[i].active=false;
		}
	}
}
const keyboard=new keyboardObj();
//function for clicking ui elements
function globalFocus(){
	var gui=canvas.currentScene.guiObjects;
	var activated=false;
	var i=gui.length-1;
	while(0<=i){
		var obj=gui[i];
		var id=obj.id;
		if(id=="button" || id=="imageGui"){
			if(collide(mouseObj.position,obj)==true){
				obj.active=true;
				activated=true;
				break;
			}
			else{
				obj.active=false;
			}
		}
		i-=1;
	}
	if(activated==false){
		if(mouseObj.currentObj!=null){
		mouseObj.currentObj.active=false;
		}
		mouseObj.currentObj=null;
	}
}
//event handler for mouse events
function eventHandler(){
	if(mouseInput(0).click()){

		mclicks.run()
	}
	if(mouseInput(0).down()){
		
		mouseObj.mtouch=true
		mdown.run();
	}
	if(mouseInput(0).up()){
	
		mouseObj.mtouch=false;
	}
	
	
	if(mouseInput().move()){
		if(mouseObj.mtouch==true && mouseObj.over==true){
			mdrag.run();
			
		}
	
	
	}

}
//clearing events
function clearEvents(){
		keyboard.clear();
		mouseObj.clear();
}