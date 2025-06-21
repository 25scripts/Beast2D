
/**
 *this is the events module containing the mouse  and keyboard object classes.
 *@module Events
 */
/**
 * This is the eventsystem class
 * @global
 */

class eventSystem{
	/**
	 * @param canvas this is the canvas object to which the event system belongs
	 */
	constructor(canvas){
	/**
 * 
 * @prop {canv} canvas this is the canvas object to which the event system belongs
 */
	this.canvas=canvas;

/**
 * 
 * @prop {object} loader this object is used to for callbacks when all game assets are loaded.
 */
	this.loader={
	/**
	 * this is array of callback functions
	 * @type {Array} 
	 */
	"actions":[],
	/**
	 * this is function used call the callback functions in  actions  array
	 */
	run:function(){
    for(let i=0; i<this.actions.length;i++){
		var act=this.actions[i]
		act();
	}
}
}

//mousedown events
/**
 * 
 * @prop {object} mdown this object is used to for callbacks when  mouse button is down
 */
this.mdown={
	/**
	 * this is array of callback functions
	 * @type {Array} 
	 */
	"actions":[],
	/**
	 * this is function used call the callback functions in  actions  array
	 */
	run:function(){
		
		for(let i=0; i<this.actions.length;i++){
			var act=this.actions[i]
			act();
		}
	}
}
//mouseup events
/**
 * 
 * @prop {object} mup this object is used to for callbacks when  mouse button is up
 */
this.mup={
	/**
	 * this is array of callback functions
	 * @type {Array} 
	 */
	"actions":[],
	/**
	 * this is function used call the callback functions in  actions  array
	 */
	run:function(){
		
		for(let i=0; i<this.actions.length;i++){
			var act=this.actions[i]
			act();
		}
	}
}
//clicks events

/**
 * 
 * @prop {object} mclicks this object is used to for callbacks when mouse is clicked
 */
 this.mclicks={
	/**
	 * this is array of callback functions
	 * @type {Array} 
	 */
	"actions":[],
	/**
	 * this is function used call the callback functions in  actions  array
	 */
	run:function(){
		
		for(let i=0; i<this.actions.length;i++){
			var act=this.actions[i]
			act();
		}
	}
}
//mouse move events
/**
 * 
 * @prop {object} m_move this object is used to for callbacks when mouse is  moving
 */
this.m_move={
	/**
	 * this is array of callback functions
	 * @type {Array} 
	 */
	"actions":[],
	/**
	 * this is function used call the callback functions in  actions  array
	 */
	run:function(){
		for(let i=0; i<this.actions.length;i++){
			
			var act=this.actions[i]
			act();
		}
	}
}

//drag event


/**
 * 
 * @prop {object} mdrag this object is used to for callbacks when mouse is dragging
 */
this.mdrag={
	/**
	 * this is array of callback functions
	 * @type {Array} 
	 */
	"actions":[],
	/**
	 * this is function used call the callback functions in  actions  array
	 */
	run:function(){
		for(let i=0; i<this.actions.length;i++){
			
			var act=this.actions[i]
			act();
		}
	}
}

//keyboard event object
/**
 * 
 * @prop {keyboardObj} keyboard this is the keyboard object 
 */
this.keyboard=new keyboardObj();
//mouse event object
/**
 * 
 * @prop {mouseStruct2D} mouseObj this is  the mouse event object used to handle mouse events.
 */
this.mouseObj=new mouseStruct2D(this);
	}

	/**
 * this function creates a input  object for a keyboard key.
 * @param {string} key this is the keyboard key to checked.
 * @returns {inputObj} input object.
 * @memberof eventSystem
 */
 input(key){
	var i=new inputObj(this,key,0);
	return i;
}
	//mouseInput function
/**
 * function checks whether mouse event is active.
 * @param {string} key mouse event state to be checked.e.g  "moved" for moving,0 for "LeftButton", 1 for "WheelButton",2 for "RightButton"
 * @returns {inputObj}
 *  * @memberof eventSystem
 */
 mouseInput(key="moved"){
	var keys={
		"moved":0,
		0:"LeftButton",
		1:"WheelButton",
		2:"RightButton",
	}
	
	 var i=new inputObj(this,keys[key],1);
 	return i;
}
 collide(mpos,obj){

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
		if(this.mouseObj.currentObj!=null){
			this.mouseObj.currentObj.active=false;
		}
		
		this.mouseObj.currentObj=obj;
		return true;
	}
	else{
		
		return false;
	}
		
	}
	//event handlers
 mclick(x,y,e){
	this.mouseObj.position.x=x;
	this.mouseObj.position.y=y;

	this.mouseObj.worldposition.x=x+this.canvas.camera.position.x;
	this.mouseObj.worldposition.y=y+this.canvas.camera.position.y;
	var key=getKeyFromCode(e,1)
	
		
	var state=this.mouseObj.getState(key);

	state.click.active=true;
	if(state.click.response==true){

		this.mouseObj.csignals.push(state.click);
	}
	
}
mousedown(x,y,e){
	this.mouseObj.position.x=x;
	this.mouseObj.position.y=y;
	this.mouseObj.worldposition.x=x+this.canvas.camera.position.x;
	this.mouseObj.worldposition.y=y+this.canvas.camera.position.y;
	var key=getKeyFromCode(e,1)

	var state=this.mouseObj.getState(key);
	state.keydown.active=true;
	if(state.keydown.response==true){
		this.mouseObj.csignals.push(state.keydown);
	}
	
}
 mouseup(x,y,e){
	this.mouseObj.position.x=x;
	this.mouseObj.position.y=y;
	this.mouseObj.worldposition.x=x+this.canvas.camera.position.x;
	this.mouseObj.worldposition.y=y+this.canvas.camera.position.y;
	var key=getKeyFromCode(e,1)

	var state=this.mouseObj.getState(key);
	state.keyup.active=true;
	if(state.keyup.response==true){
		this.mouseObj.csignals.push(state.keyup);
	}
	if(key=="RightButton"){
		event.preventDefault();
	}
	
}
mousemove(x,y,e){
	this.mouseObj.position.x=x;
	this.mouseObj.position.y=y;
	this.mouseObj.worldposition.x=x+this.canvas.camera.position.x;
	this.mouseObj.worldposition.y=y+this.canvas.camera.position.y;
	var state=this.mouseObj.getState(0);
	state.move.active=true;
	this.m_move.run()
	if(state.move.response==true){
		this.mouseObj.csignals.push(state.move);
	}
	
}
//keyup event
keyup(event){

	var key=getKeyFromCode(event);
	var state=this.keyboard.getState(key);
	state.keyup.active=true;
	state.keydown.active=false;

	if(state.keyup.response==true){
		this.keyboard.csignals.push(state.keyup);
	}
}
//keydown event
 keydown(event){
	
	var key=getKeyFromCode(event);
	var state=this.keyboard.getState(key);
	state.keyup.active=false;
	state.keydown.active=true;
	
}
//keypress event
 keypress(event){
	var key=getKeyFromCode(event);
	var state=this.keyboard.getState(key);
	state.keyup.active=false;
	state.keydown.active=true;
	
}
//function for clicking ui elements
globalFocus(){
	var gui=this.canvas.currentScene.guiObjects;
	var activated=false;
	var i=gui.length-1;
	while(0<=i){
		var obj=gui[i];
		var id=obj.id;
		if(id=="button" || id=="imageGui"){
			if(this.collide(this.mouseObj.position,obj)==true){
				if(obj.enabled==true){
					
					if(obj.active==false && this.mouseObj.previous_obj!=this){
						obj.hover();
						this.mouseObj.previous_obj=this;
						
					}
				
					obj.active=true;
					activated=true;
					
				}
				
				break;
			}
			else{
				obj.active=false;
			}
		}
		
		i-=1;
	}
	if(activated==false){
		if(this.mouseObj.currentObj!=null){
		this.mouseObj.currentObj.active=false;
		}
		this.mouseObj.currentObj=null;
		this.mouseObj.previous_obj=null;
	}
}
//event handler for mouse events
 eventHandler(){
	if(this.mouseInput(0).click()){
		
		if(this.mouseObj.currentObj!==null){
			if(this.mouseObj.currentObj.enabled==true){
				this.mouseObj.currentObj.action();
			}
			
		}
		this.mclicks.run()
	}
	if(this.mouseInput(0).down()){
		
		this.mouseObj.mtouch=true
		this.mdown.run();
	}
	if(this.mouseInput(0).up()){
	
		this.mouseObj.mtouch=false;
	}
	
	
	if(this.mouseInput().move()){
		if(this.mouseObj.mtouch==true && this.mouseObj.over==true){
			this.mdrag.run();
			
		}
	
	
	}

}
//clearing events
/**
 * functions clears keyboard and mouse events
 * @function
 * @returns {void}
 */
 clearEvents(){
	this.keyboard.clear();
	this.mouseObj.clear();
}
}
//mouseobject
/**
 * this is the mouse object class
 * @class
 * @global
 */
class mouseStruct2D{
	/**
	 * @param {eventSystem} event_system this is the event system object which the mouse event object belongs
	 */
	constructor(event_system){
		/**
		 * @prop {vec2d} position this is the position of the mouse
		 */
	this.position=vec(0,0);
		/**
		 * @prop {canv} event_system this is the canvas object which the mouse event object belongs
		 */
		this.event_system=event_system
	/**
		 * @prop {vec2d} worldposition this is the world position of the mouse
		 */
	this.worldposition=vec(0,0);
	
	this.currentObj=null;
	
	this.type="mouseObj";

	this.mtouch=false;

	this.over=false;

	this.selector=null;

	this.states={};
	
	this.csignals=[];
	
	this.active_collider=null;
	event_system.m_move.actions.push(function(){event_system.mouseObj.setCurrentMouseOver()});
	event_system.mclicks.actions.push(function(){event_system.mouseObj.markObject()});
	this.previous_obj=null;

}
	setCurrentMouseOver(){
		var col=this.event_system.mouseObj.mouseOver();
		if(col!=null){
			
			this.event_system.mouseObj.active_collider=col;
			
		}
		else{
			this.event_system.mouseObj.active_collider=null;
			
		}
	}
	mouseOver(){

		var scn=this.event_system.canvas.currentScene;
		var coll=false;
		if(scn!=null){
		for(let i=0;i< scn.colliders.length;i++){
		var col=scn.colliders[i].mouseCollision();
		if(col!=null){
			return col
		}
		}
		}
		return null;
	}
	markObject(){
		
		var col=this.event_system.mouseObj.mouseOver();
		if(col!=null){
		
			if(this.event_system.mouseObj.selector){
				this.event_system.mouseObj.selector.marked=col.object;
			}
			
		}
		else{
			if(this.event_system.mouseObj.selector!=null){
		
				if(this.event_system.mouseObj.selector){
					this.event_system.mouseObj.selector.marked=null;
				}
			}
			
		}
	}
	listen(key,event){
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
	}
	getState(key){
		
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
	}
	
	clear(){
		for(let i=0;i<this.csignals.length;i++){
			this.csignals[i].active=false;
		}
	}
	
	
}


//visual collision




//get key 
function getKeyFromCode(event,target=0){

	if(target==0){
	var key1=event.key;
	var key2=event.which;
	var key3=event.keyCode;
	if(key1){
	 var key=key1;
	 
	 if(key==" "){
		key="Space"
	 }
	 return key.toLowerCase();
	}
	else{
	if(key2){
		var key=key2;
		if(key==" "){
			key="Space"
		 }
		return key.toLowerCase();
	}
	else{
		if(key3){
			var key=String.fromCharCode(key3);
			if(key==" "){
				key="Space"
			 }
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
/**
 * this is the input object class it returns the state of any event.
 * @class
 * @global
 */
class inputObj{
	/**
	 * 
	 * @param {eventSystem} event_system this is the event_system object that the input object belongs to
	 * @param {string} key this is name of the event or key being checked.
	 * @param {number} target this specifies the device to check the event for. e.g 0 for keyboard, 1 for mouse.
	 */
	constructor(event_system,key,target=0){

		/**
		 * @prop {eventSystem} event_system this is the event_system object that the input object belongs to
		 */
 this.event_system=event_system;
				/**
		 * @prop {string} key this is name of the event or key being checked.
		 */
 this.key=key;
 //0 for keyboard and 1 for mouse;
 			/**
		 *@prop  {number} target this specifies the device to check the event for. e.g 0 for keyboard, 1 for mouse
		 */
 this.target=target;
}
/**
 * this function returns true if a keyboard key or mouse button is down.
 *@memberof inputObj
 * @returns {boolean} state of the event
 */
down(){
	if(this.target==1){
		return this.event_system.mouseObj.listen(this.key,"keydown");
	}
	if(this.target==0){
	return this.event_system.keyboard.listen(this.key,"keydown");
	}
}
/**
 * this function returns true if a keyboard key or mouse button is up.
 *@memberof inputObj
 * @returns {boolean} state of the event
 */
up(){
	if(this.target==1){
	return this.event_system.mouseObj.listen(this.key,"keyup");
	}
	if(this.target==0){
		return this.event_system.keyboard.listen(this.key,"keyup");
	}
}
/**
 * this function returns true if mouse button is clicked.
 *@memberof inputObj
 * @returns {boolean} state of the event
 */
click(){
	if(this.target==1){
		
		return this.event_system.mouseObj.listen(this.key,"click");
	}
	else{
		return null;
	}
}
/**
 * this function returns true if mouse is moved.
 *@memberof inputObj
 * @returns {boolean} state of the event
 */
move(){
	if(this.target==1){
		
		return this.event_system.mouseObj.listen(this.key,"move");
	}
	else{
		return null;
	}
}
}



//input state
/**
 * @class
 * @global
 */
class inputState{
	constructor(response=true){
	this.active=false;
	//if true signal is trigger once each cycle and delete
	this.response=response;
	
	}
}
//create input state
function createInputState(response=true,target=0){
	var s=new inputState(response,target);
	return s;
}

//keyboard object
/**
 * this is object class for the keyboard object.
 * @class
 * @global
 */
class keyboardObj{
	
	constructor(){
	//key states
	/**
	 * @prop {Array} states this an array of the keyboard input states 
	 */
	this.states={}

	this.csignals=[];
}
   /**
	* 
	* @param {string} keyString this is the keyboard key to be checked
	* @param {string} event  this is the event to be checked.e.g "up"
	* @returns {boolean}
	*/
	listen(keyString,event){
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
	}
	getState(keyString){
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
	}
	clear(){
		for(let i=0;i<this.csignals.length;i++){
			this.csignals[i].active=false;
		}
	}
}



