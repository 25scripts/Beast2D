/**
 *this module contain the core functions of the system including; scenes, gameobjects, canvas objects
 *@module Engine
 */


//system variables
/**
 * constant  stores the time for refresh rate for the canvas
 * @type {number} 
 * @global
 */
const timeout=50;
/**
 * object stores images generated as HTML Image Elements
 * @type {object} 
 * @global
 */
var imageSet={}
/**
 * object stores audio generated as HTML Audio Elements
 * @type {object} 
 * @global
 */
var soundSet={}
/**
 * game stores images to be used by the game
 * @type {Array}
 * @global
 */
var images=[];
/**
 * object stores audio to be used by the game
 * @type {Array}
 * @global 
 */
var sounds=[];
/**
 * variable stores the current number of assets(images and audios) to be loaded for the game
 * @type {number} 
 */
var assetcount=0;
/**
 * variable stores the current number of assets(images and audios)  loaded for the game
 * @type {number} 
 */
var assetslive=0;
/**
 * variable stores progress in loading the game assets
 * @type {number} 
 */
var progress=0;
/**
 * variable stores whether the game assets are fully loaded.
 * @type {boolean} 
 */
var loading=false;
/**
 * variable stores whether cursor object.
 * @type {curObj} 
 * @global
 */
var cursor=null;
//view object
/**
 * This is a namspace used to control the viewport settings of the game. <br>
 * Example: viewObj.position=vec(0,0); to set the location of the viewport
 * @namespace
 */
var viewObj={
	/**
	 * This is the webgl 2D context.
	 * @type {Object} 
	 */
	gl:null,
	//translation vector
	/**
	 * This is the position of the viewport
	 * @see {@link vec2d}
	 * @type {vec2d} 
	 */
	position:vec(0,0),
	//actual position 
	//translation vector
	/**
	 * This is the world position of the viewport
	 * @see {@link vec2d}
	 * @type {vec2d} 
	 */
    worldposition:center(),
	/**
	 * This is viewport object
	 * @prop {number} width this is the width of the viewport
	 * @prop {number} height this is the height of the viewport
	 */
	viewport:{
		"width":400,
		"height":500
	},
	/**
	 * This function sets the position of the viewport
	 * @function
	 * @param {vec2d} position
	 */
	setPosition:function(vec){
		var offsetx=vec.x-viewObj.position.x;
		var offsety=vec.y-viewObj.position.y;

		viewObj.worldposition.x=vec.x;
		viewObj.worldposition.y=vec.y;

		viewObj.position.x=-offsetx;
		viewObj.position.y=-offsety;

		canvas.gl.translate(-offsetx,-offsety);
	},
	/**
	 * This function sets the position of the viewport
	 * @function
	 * @param {number} width this is the width of the viewport
	 * @param {number} height this is the height of the viewport
	 */
	setViewport:function(width,height){
		viewObj.viewport.width=width;
		viewObj.viewport.height=height;
		canvas.resetViewport(width,height);
	}
	
}

//sprites and tiles
/**
 * This is the sprite tile class for creating sprite tiles.
 */
class tileObj{
/**
 * 
 * @param {scene} scene this is the scene for the tile.
 * @param {vec2d} position this is the position of the tile
 * @param {number} count this is the number of tiles
 * @param {HTMLImageElement} image  this is the sprite image of the tile
 * @param {boolean} collide sets whether tile has collision
 */
constructor(scen,pos=null,count=1,img=null,collide=false){
if(pos!=null){
	this.position=pos;
}
else{
	this.position=center();
}
/**
 * @property {string}  name this the name of the tile
 */
this.name="tile";
/**
 * @property {string}  scene  this is the scene for the tile object
 */
this.scene=scen;
/**
 * @property {object} components this a dictionary storing component objects such as colliders.
 */
this.components={};
/**
 * @property {Array}  colliders this an array storing the colliders for the tile.
 */
this.colliders=[];
/**
 * @property {Array}  size this is the size of the each tile. e.g [50,50]
 */
this.size=[50,50];
/**
 * @property {number} spacing this is the spacing of the tiles.
 */
this.spacing=0;
/**
 * @property {number}  rotation this is the rotation of the tile.
 */
this.rotation=0;
/**
 * @property {boolean} active sets whether the tileobj is active.
 */
this.active=true;
if(collide==true){
	this.components["collider"]=collider(this);
}
else{
	this.components["collider"]=null;
}
/**
 * @property {number}  count this is the number of tiles
 */

this.count=count;
//0 for horizontal or 1 for vertical;
/**
 * @property {number}  direction this is the direction of the tile.e.g.0 for horizontal or 1 for vertical;
 */
this.direction=0;
/**
 * @property {HTMLImageElement}  img this is the image of the tile object.
 */
this.img=img;
this.processBounds();
}
pre_transform(){
	var gl=canvas.gl;
	gl.save();
}
transform(){
	
	var gl=canvas.gl;
	gl.translate((this.position.x),(this.position.y));
	gl.rotate(this.rotation*Math.PI/180);
	gl.translate(-(this.position.x),-(this.position.y));
	
	
}
post_transform(){
	var gl=canvas.gl;
	gl.restore();
	
	
}
/**
 * this function returns the collider of the tile object
 * @function
 * @memberof tileObj
 * @returns {collider} collider 
 */
collider(){
	return this.components["collider"];
}
/**
 *  this sets the size of the tile object
 * @function
 * @memberof tileObj
 * @param {Array} size this is the size of the tile object. e.g [50,50]
 */
setSize(size){
	this.size=size;
}
/**
 * this function returns the size of the tile object
 * @function
 * @memberof tileObj
 * @returns {Array} size
 */
getSize(){
	return this.size;
}
processBounds(){
		var size=this.size;
		var col=this.components["collider"];
		if(this.direction==0){
			size=[size[0]*this.count+(this.count-1)*this.spacing,size[1]];			
		}
		else{
			size=[size[0],size[1]*this.count+(this.count-1)*this.spacing];
		}
		if(col!=null){
			col.setBounds(size);
		}
		return size;
}
render(){
	//overall size
	var overall=this.processBounds();
	//img source
	var img=this.img;
	var count=this.count;
	var spacing=this.spacing;
	var dir=this.direction;
	var size=this.size;
	if(this.direction==0){
		var h=1;
		var v=0;
	}
	else{
		var h=0;
		var v=1;
	}
	if(img!=null){
		var i=0;
		var rect=null;
		this.pre_transform();
		this.transform();
		while(i<count){
			var pos=addVec(this.position.copy(),vec(-overall[0]/2,-overall[1]/2));
			if(i==0){
			pos.x+=(i*h+0.5)*size[0];
			pos.y+=(i*v+0.5)*size[1];
			}
			else{
			pos.x+=(i*h+0.5)*size[0]+i*h*spacing;
			pos.y+=(i*v+0.5)*size[1]+i*v*spacing;
			}
			rect=new rectangle(pos,size[0],size[1]);
			rect.setImage(img);
			rect.update();
			i++;
		}
		this.post_transform();

	}
}
update(){
	
	this.render();
	
	for(i in this.components){
		this.components[i].update();
	}
}
}


//animation clips
/**
 * This is class for the animation clip object.
 * @class
 * @global
 */
class clipObj{
/**
	 * 
	 * @param {string} name this is the name of the animation clip
	 * @param {	HTMLImageElement} source this is the source image for the animation clip
	 * @param {number} w this is the width of the source image.
	 * @param {number} h this is the height of the source image.
	 * @param {number} w1 this is the width of the sprite animation frame.
	 * @param {number} h2 this is the height of the image animation frame.
	 */
constructor(name,source,w,h,w1,h2){
/**
 * @prop {string} name this is the name of the animation clip
 */
this.name=name;
/**
 * @prop {HTMLImageElement} source this is the source image for the animation clip
 */
this.source=source;
//size of sprite animation frame;
/**
 * @prop {number} width this is the width of the source image.
 */
this.width=w;
/**
 * @prop {number} height this is the height of the source image.
 */
this.height=h;
//total size of sprite 
/**
 * @prop {Array} clip_size this is the size of the animation clip frame.e.g [50,50].
 */
this.clip_size=[w1,h2]
//clip direction 0 for horizontal and 1 for vertical
/**
 * @prop {number} direction this is the direction of the animation clip.e.g: direction 0 for horizontal and 1 for vertical.
 */
this.direction=0;
}
}

//animations
/**
 * this is the object class for animations
 * @class
 * @global
 */
class animObj{
/**
* @param {GameObject} object this is the game object that the animation belongs to.
*/
constructor(object){
/**
 * @prop {string} type this is the type of the class object.e.g. animation.
 */	
this.type="animation";
/**
 * @prop {object} clips this is a dictionary of animation clips belonging to the animation object.
 */	
this.clips={};
/**
 * @prop {string} clip_name this is the name of the current animation clip.
 */	
this.clip_name=null;
//delay between each frame
/**
 * @prop {number} delay this is the frame delay for the animation.
 */	
this.delay=5;
this.dt=0;
/**
 * @prop {boolean} stop if true the animation has stopped.
 */	
this.stop=true;
/**
 * @prop {number} frame this is the current animation frame.
 */	
this.frame=0;
/**
 * @prop {number} frames this is total number of frames for the current animation clip;
 */	
this.frames=0;
/**
 * @prop {GameObject} object this is the game object that the animation belongs to.
 */	
this.object=object;
/**
 * @prop {boolean} repeat if true, the animation plays and repeats.
 */	
this.repeat=true;
//playonce -> 0 , repeat -> 1
/**
 * @prop {number} play_mode sets the play mode of the animation.e.g: 0 for play once and 1 for repeat.
 */	
this.play_mode=0;
}
/**
 * this function creates animation clip and adds to the animation;
 * @function
 * @param {string} name this is the name of the animation clip
* @param {	HTMLImageElement} source this is the source image for the animation clip
* @param {number} w this is the width of the source image.
* @param {number} h this is the height of the source image.
* @param {number} w1 this is the width of the sprite animation frame.
* @param {number} h2 this is the height of the image animation frame.
*@memberof animObj
 * @returns {clipObj} clip
 */
addClip(name,source,w,h,h1,h2){
		var c=new clipObj(name,source,w,h,h1,h2)
		this.clips[name]=c;
		return c;
	}
	/**
 * this function plays the animation
 * @function
 * @param {string} name this is the name of the animation clip to play
 *@memberof animObj
 * @returns {void}
 */
	Play(name){
		if(this.stop==true){
			this.stop=false;
			this.frame=0;
			this.clip_name=name;
		}
	}
	
	loop(){
		var index=this.frame;
		clip=this.clips[this.clip_name];
		if(clip.direction==0){
			this.frames=parseInt(clip.width/clip.clip_size[0])	
		}
		else{
			this.frames=parseInt(clip.height/clip.clip_size[1])	
		}
		
		if(clip){
				
				var mat=this.object.materials[0];
				mat.animated=true;
				
				mat.loadClip(clip,index);
				
				if(this.frame>=this.frames){
					if(this.repeat==true){
					this.frame=0;
					}
					else{
						this.stop=true;
					}
				}
				
		}
		if(this.dt>=this.delay){
		this.frame++;
		this.dt=0;
		}
		this.dt++;
	}
	update(){
		
		if(this.stop==false){
			
			this.loop();
		}
	}
}
//visualization objects
/**
 * this is object class for 2d selector used to select objects on the screen. this works together with the tools library.
 * @class
 * @global
 */
class selector2D{
	/**
	 * 
	 * @param {vec2d} vector this is the position of the selector.
	 */
	constructor(vect=null){
	/**
	 * @prop {vec2d} position this is the position of the selector.
	 */
	this.position=vec(0,0);
	/**
	 * @prop {boolean} visible if true, the selector is visible.
	 */
	this.visible=true;

	this.marked=null;
	if(vect!=null){
		this.position=vect;
	
	}
    else{
	this.position=vec(0,0);
	}
	mouseObj.selector=this;
	mdrag.actions.push(this.dragObj);
	
}

	dragObj(){
		//selection based on collider
		var obj=mouseObj.selector.marked;
		
		if(obj!=null){
		
		var col=obj.components["collider"];
		col=col.mouseCollision();
		if(col!=null){
			obj.position.x=mouseObj.position.x;
			obj.position.y=mouseObj.position.y;
			
			
		}
		}
	}
	draw(){
		var gl=canvas.gl;
		gl.save();
		var offset=20;
		
		var x0=this.marked.position.x;
		var y0=this.marked.position.y;
		
		gl.beginPath();
		gl.lineWidth=2;
	
		
			
		var yn=""+this.marked.position.y;
		var xn=""+this.marked.position.x;
		var name=this.marked.name;
		xn=xn.substr(0,7);
		yn=yn.substr(0,7);
		
		gl.strokeStyle='#67ff67';
		//y-axis
		gl.moveTo(x0,y0);
		gl.lineTo(x0,y0+offset);
		gl.fillStyle='#aaeeaa';
		gl.font='10px Arial';
		gl.fillText('Y '+yn,x0-2,y0+offset+10);
		gl.fillText(''+name,x0+offset+2,y0+10);
		gl.fill();
		gl.stroke();
		//x-axis
		gl.beginPath();
		gl.strokeStyle='#ff6767';
		gl.moveTo(x0,y0);
		gl.lineTo(x0+offset,y0);
		gl.fillStyle='#eeaaaa';
		gl.font='10px Arial';
		gl.fillText('X '+xn,x0+offset+5,y0-1);
		gl.fill();
		gl.stroke();
		gl.restore();
	}
	
	update(){
	
		if(this.marked!=null){
				this.draw();
		}
	}		
}
//gameobject
/**
 * this is the gameobject class
 * @class
 * @global
 */
class GameObject{
/**
 * 
 * @param {string} name  this is the name of game object
 */
constructor(name=""){
	/**
	 *@prop {string} name this is name of the game object. 
	 */
this.name=name;
/**
	 *@prop {scen} scene this is  scene for the game object.
	 */
this.scene=null;
/**
	 *@prop {number} width this is width of the game object renderer.
	 */
this.width=50;
/**
	 *@prop  {number} height this is height of the game object renderer.
	 */
this.height=50;
/**
	 *@prop {vec2d} position  this is position  of the game object. 
	 */
this.position=vec(canvas.width/2,canvas.height/2);
/**
 * @property {object} components this a dictionary storing component objects such as colliders.
 */
this.components={};
/**
	 *@prop {Array} materials this is an array the materials on the game object.
	 */
this.materials=[];
this.materials[0]=material(this,"mat0");
/**
	 *@prop {number}  rotation  this is the angle of rotation of the game object.
	 */
this.rotation=0;
/**
	 *@prop {boolean} active if true, the game object is active.
	 */
this.active=true;
	
}
/**
	 * this function sets the position of the game object.
	 * @function
	 * @param {vec2d} vector this is the new position  of the game object
	 *@memberof GameObject
	 * @returns {void}
	 */
	setPosition(vec){
		this.position.x=vec.x;
		this.position.y=vec.y;
		this.position.getMagnitude();
	}
	/**
	 * this function adds animations to the game object.
	 * @function
	 * @memberof GameObject
	 * @returns {animObj} animation
	 */
	addAnimator(){
		var anim=new animObj(this);
		this.components["animation"]=anim;
		return anim;
	}
	/**
	 * this function deletes the game object from the scene.
	 * @function
	 * @memberof GameObject
	 * @returns {void}
	 */
	delete(){
		if(this.scene!=null){
			this.scene.objects.splice(this.scene.objects.indexOf(this),1)
		}
	}
	/**
	 * this function returns the rigid body of the game object
	 * @memberof GameObject
	 * @returns {rigidObj} rigid body
	 */
	rigidbody(){
		return this.components["rigidbody"];
	}
	/**
	 * this function returns the collider of the game object
	 * @function
	 * @memberof GameObject
	 * @returns {colObj} collider
	 */
	collider(){
		return this.components["collider"];
	}
	/**
	 * this function sets the size of the game object renderer.
	 * @function
	 * @memberof GameObject
	 * @param {number} width  width of the renderer
	 * @param {number} height height of the renderer
	 * @returns {void}
	 */
	setSize(width,height){
		this.width=width;
		this.height=height;
	}
	pre_transform(){
		var gl=canvas.gl;
		gl.save();
	
		
	}
	transform(){
		
		var gl=canvas.gl;
		gl.translate((this.position.x),(this.position.y));
		gl.rotate(this.rotation*Math.PI/180);
		gl.translate(-(this.position.x),-(this.position.y));
		
		
	}
	post_transform(){
		var gl=canvas.gl;
		gl.restore();
		
		
	}
	addComponent(obj){
		this.components[obj.type]=obj;
		return obj
	}
	render(){
		for(i in this.materials){
			this.materials[i].update();
		}
	}
	/**
	 * this function used to set the game logic for the game object. It is automatically called during the logic cycle of the game.
	 * @function
	 * @memberof GameObject
	 * @returns {void}
	 */
	logic(){}
	update(){
		for(i in this.components){
			var comp=this.components[i];
			comp.update();
		}
		
		this.logic();
		this.pre_transform();
		this.transform();
		this.render();
		this.post_transform();
		
	}	
	
}
//scene object
/**
 * this is the scene class.
 * @class
 * @global
 */
class scen{
	/**
	 * 
	 * @param {string } name  this is the name of the scene.
	 */
	constructor(name){
		/**
		 * @prop {string } name  this is the name of the scene.
		 */
	this.name=name;
	/**
		 * @prop {Array} backgrounds this is an array of background objects in the scene. 
		 */
	this.backgrounds=[];
	/**
		 * @prop {Array} objects  this is an array of game objects in the scene.
		 */
	this.objects=[];
	/**
		 * @prop {Array} layouts  this is an array of layout objects in the scene.
		 */
	this.layouts=[];
	/**
		 * @prop {Array} polys  this is an array of poly objects in the scene such as line objects.
	*/
	this.polys=[];
	/**
		 * @prop {Array} guiObjects  this is an array of guiObjects in the scene such as buttons.
	*/
	this.guiObjects=[];
	/**
		 * @prop {Array} colliders  this is an array of colliders in the scene such as buttons.
	*/
	this.colliders=[];
	/**
		 * @prop {Array} visuals  this is an array of visual objects  in the scene.
	*/
	this.visuals=[];

	canvas.addScene(this);
	this.initialize();
}
/**
 * this function runs when the scene is set. It can used to do any logic required at the start of the scene such as
 * creating game objects.
 * @memberof scen
 * @function
 */
    reset(){
		
	}
	/**
 * this function assigns the scene parameter to all objects that belong to this scene.
 * @function
 * @memberof scen
 * returns {void}
 */
	connect(){
	for(i in this.backgrounds){this.backgrounds[i].scene=this};
	for(i in this.layouts){this.layouts[i].scene=this};
	for(i in this.guiObjects){this.guiObjects[i].scene=this};
	for(i in this.polys){this.polys[i].scene=this};
	for(i in this.objects){this.objects[i].scene=this};
	}
	/**
	 * this function can used to do the any logic required for the scene. It is called during the logic cycle of the game.
	 * @function
	 */
	logic(){}
	update(){
		var gl=canvas.gl;
		this.logic();
		for (i in this.backgrounds){
			
			var bg=this.backgrounds[i];
		
			bg.update();
		}
		
		for(i in this.objects){
			var obj=this.objects[i];
			
			obj.update();
			
		
		}
		for(i in this.polys){
			var obj=this.polys[i];
			
			obj.update();
		
			
			
		}
		for(i in this.layouts){
			var layout=this.layouts[i];
			layout.update();
		}
		globalFocus();
		for(i in this.guiObjects){
			var obj=this.guiObjects[i];

			
			obj.update();
			
			
		}
		for(i in this.visuals){
			var obj=this.visuals[i];
			obj.update();
			
			
		}
		cursor.update();
		
	}
	/**
	 * this function adds a tile object to the scene.
	 * @function
	 * @param {vec2d} pos this is the position of the tile object.
	 * @param {number} count this is the count for the tile object.
	 * @param {HTMLImageElement} img this is the HTMLImageElement for the tile. this can be obtained from the imageSet object.
	 * @param {boolean} collide this set whether the tile object has collision.
	 * @memberof scen
	 * @returns {tileObj} tile
	 */
	addTile(pos=null,count=1,img="",collide=false){
			var t=new tileObj(this,pos,count,img,collide);
			this.objects.push(t);
			return t;
	}
	/**
	 * this function adds a layout object to the scene.
	 * @function
	 * @param {vec2d} pos this is the position of the layout
	 *@param {string} align this is the alignment of the layout.e.g. center.
	 *@memberof scen
	 *@returns {layoutObj} layout
 	 */
	addLayout(pos=null,align="center"){
		var layout=new layoutObj(pos,align);
		this.layouts.push(layout);
		return layout;
	}
	/**
	 * this function adds a background object to the scene.
	 * @function
	 * @param {string|HTMLImageElement} source this is the source of the background.
	 *@param {string} type this is the type of background.e.g color
	 *@memberof scen
	 *@returns {bgObj} background
 	 */
	addBg(source="black",type="color"){
		var bg=new bgObj(source,type);
		this.backgrounds.push(bg);
		return bg;
	}
	/**
	 * this function adds a visual object to the scene.
	 * @function
	 * @param {object} v this is any object whose update function is to be run through the visual cycle of the scene.
	 * @memberof scen
	 *@returns {Object} visual
 	 */
	addVisual(v){
		this.visuals.push(v);
		return v;
	}
	/**
	 * this function creates a poly object which draws a line on the screen. this object is stored in the polys array of the scene object.
	 * @function
	 * @param {vec2d} vec1 this is the start position of the line.
	 * @param {vec2d} vec2 this is the end position of the line.
	 * @param {string} color this is the color of the line.e.g black
	 * @param {number} color this is the width of the line.e.g 1
	 * @memberof scen
	 *@returns {line} line object
 	 */
	drawLine(vec1,vec2,color="black",width=1){
		var l=new line(vec1,vec2,color,width);
		l.scene=this;
		this.polys.push(l);
		return l;
	}
	/**
	 * this function creates a poly object which draws a rectangle on the screen. this object is stored in the polys array of the scene object.
	 * @function
	 * @param {vec2d} vec1 this is the center position of the rectangle. 
	 * @param {number} width this is the width of the rectangle.
	 * @param {number}height this is the height of the rectangle.
	 * @param {color} color this is the color of the rectangle.e.g. black
	 * @param {boolean} fill sets whether the rectangle is to be filled.
	 * backup 7
	 *@returns {rectangle} rectangle
 	 */
	drawRectangle(vec1,width=50,height=50,color="black",fill=true){
		var rect=new rectangle(vec1,width,height,color,fill);
		this.polys.push(rect);
		rect.scene=this;
		return rect;
	}
	
	drawPoint(vec1,radius=30,color="black",fill=true){
		var c=new circle(vec1,radius,color,fill);
		c.scene=this;
		this.polys.push(c);
		return c;
	}
	
	addProgress(val=0,pos=null){
		var prog=new progBar(val,pos);
		prog.scene=this;
		this.guiObjects.push(prog);
		return prog;
	}
	addImageGui(source=null,pos=null){
		var img=new imageGui(source,pos);
		img.scene=this;
		this.guiObjects.push(img);
		return img;
	}
	addText(text="",pos=null){
		var textGui=new label(text,pos);
		textGui.scene=this;
		this.guiObjects.push(textGui);
		return textGui;
	}addButton(text="",pos=null){
		var button=new buttonGui(text,pos);
		button.scene=this;
		this.guiObjects.push(button);
		return button;
	}
addGameObject(name=""){
		var obj=new GameObject(name);
		obj.scene=this;
		this.objects.push(obj);
		return obj;
	}
	initialize(){
	this.reset();
	if(canvas.currentScene==null){
		canvas.currentScene=this;
	}
	}
	
	run(){
		this.initialize();
		canvas.currentScene=this;
	}
	
}
//backgrounds
var bgObj=function(source="black",type="color"){
	this.position=vec(0,0);
	this.type=type;
	this.source=source;
}
bgObj.prototype={
	
	delete:function(){
		if(this.scene!=null){
			this.scene.backgrounds.splice(this.scene.backgrounds.indexOf(this),1)
		}
	},
	update:function(){
		
		var gl=canvas.gl;
		if(this.type=="color"){
			
			gl.fillStyle=this.source;
			gl.fillRect(this.position.x,this.position.y,canvas.width,canvas.height);
		}
		else{
			
			if(this.type=="image"){
	
			gl.drawImage(this.source,this.position.x,this.position.y,canvas.width,canvas.height);
			}
		}
	}
	
}
//layout object
var layoutObj=function(pos=null,align="center"){
	this.alignment=align;
	this.top=0;
	this.scene=null;
	this.bottom=0;
	this.left=0;
	this.right=0;
	this.spacing=30;
	this.prev_h=0;
	this.prev_y=0;
	this.init=false;
	if(pos!=null){
		this.position=pos;
	}
	else{
	this.position=vec(0,0);
	}
	this.width=canvas.width;
	this.height=canvas.height;
	this.objects=[];
	
}
layoutObj.prototype={
	delete:function(){
		if(this.scene!=null){
			this.scene.layouts.splice(this.scene.layouts.indexOf(this),1)
		}
		delete(this);
	},
	update:function(){
		var total_h=0;
		for (i in this.objects){
			var obj=this.objects[i];
			var size=obj.getSize();
			total_h+=size[1]+this.spacing;
			
		}
		var y0=this.position.y+canvas.height/2-total_h/2;
		for (i in this.objects){
			var obj=this.objects[i];
			var size=obj.getSize();
			var width=size[0];
			var height=size[1];
		
			var x=this.position.x+this.width/2-width/2;
			
			var y=y0;
			y0+=height+this.spacing;
			
			obj.position.x=x
			obj.position.y=y;
			
			
			
		}
	},
	setMargins:function(top,bottom,left,right){
		this.top=top;
		this.bottom=bottom;
		this.left=left;
		this.right=right;
	},
	addObject:function(obj){
		this.objects.push(obj);
	}

}
//gui objects
var label=function (text="",pos=null){
	this.text=text;
	this.type="fill"
	this.size=15;
	this.font="Verdana";
	this.color="white";
	this.scene=null;
	this.id="label";
	this.rotation=0;
	if(pos==null){
		this.position=vec(canvas.width/2,canvas.height/2);
	}
	else{
		this.position=pos;
	}
}
label.prototype={
	transform:function(){
		var gl=canvas.gl;
		gl.translate(this.position.x,this.position.y);
		gl.rotate(this.rotation);
	},
	delete:function(){
		if(this.scene!=null){
			this.scene.guiObjects.splice(this.scene.guiObjects.indexOf(this),1)
		}
	},
	getSize(){
		var size={}
		canvas.gl.font=this.getFont();
		return canvas.gl.measureText(this.text);
	},
	getFont:function(){
		var font=""+this.size+"px "+this.font;
		return font;
	},
	setStyle:function(font,size=15,type="fill"){
		this.type=type;
		this.size=15;
		this.font=font;
	},
	update(){
		var gl=canvas.gl;
		gl.beginPath();
		
		if(this.type=="stroke"){
		gl.strokeStyle=this.color;
		gl.font=""+this.size+"px "+this.font;
		gl.strokeText(this.text,this.position.x,this.position.y);
		gl.stroke();
		}
		else{
		if(this.type=="fill"){
		gl.fillStyle=this.color;	
		gl.font=""+this.size+"px "+this.font;
		gl.fillText(this.text,this.position.x,this.position.y);
		gl.fill();
			
		}	
			
		}
		gl.closePath();
	}
}
//button Gui
var buttonGui=function (text="",pos=null){
	this.label=new label(text);
	this.tcolor="white";
	this.scene=null;
	this.tcolor2="cyan";
	this.padding=10;
	this.position=null;
	this.color="red";
	this.color2="green";
	this.image1=null;
	this.image2=null;
	this.img=false;
	this.img2=false;
	this.id="button";
	this.active=false;
	this.rotation=0;
	if(pos==null){
		this.position=vec(canvas.width/2,canvas.height/2);
	}
	else{
		this.position=pos;
	}
}
buttonGui.prototype={
	transform:function(){
		
	},
	delete:function(){
		if(this.scene!=null){
			this.scene.guiObjects.splice(this.scene.guiObjects.indexOf(this),1)
		}
		delete(this);
	},
	active_draw:function(){
		var gl=canvas.gl;
		gl.beginPath();
		this.label.color=this.tcolor2;
		var size=this.getSize();;
		gl.fillStyle=this.color2;
		if(this.img2==false){
		gl.fillRect(this.position.x,this.position.y,size[0],size[1]);
		}
		else{
		gl.drawImage(this.image2,this.position.x,this.position.y,size[0],size[1]);
		}
		gl.closePath();
	},
	setImages:function(img,img2=null){
		this.img=true;
		if(img2!=null){
			this.image2=img2;
			this.img2=true;
		}
		this.image1=img;
	},
	action:function(){
	//what the button should 
	alert("click "+this.label.text);
	},
	getSize:function(){
		
		canvas.gl.font=this.label.getFont();
		var size=canvas.gl.measureText(this.label.text);
	
		var width=size.width+this.padding*2;
		var height=this.label.size+this.padding*2;
		return [width,height];
	},
	inactive_draw:function(){
		var gl=canvas.gl;
		gl.beginPath();
		this.label.color=this.tcolor;
		var size=this.getSize();
		gl.fillStyle=this.color;
		if(this.img==false){
		gl.fillRect(this.position.x,this.position.y,size[0],size[1]);
		}
		else{
		gl.drawImage(this.image1,this.position.x,this.position.y,size[0],size[1]);
		}
		gl.closePath();
	},
	update(){
		
		if(this.active==false){
			this.inactive_draw();
		}
		else{
			this.active_draw();
		}
		
		this.label.position.x=this.position.x;
		this.label.position.y=this.position.y;
		
		this.label.position.x+=this.padding;
		this.label.position.y+=this.padding+this.label.getSize().actualBoundingBoxAscent;
		this.label.update();
		
	}
}
//ui image
var progBar=function(val=0,pos=null){
	this.color="blue";
	this.color2="green";
	this.width=100;
	this.height=30;
	this.progress=val;
	this.scene=null;
	if(pos==null){
		this.position=vec(canvas.width/2,canvas.height/2);
	}
	else{
		this.position=pos;
	}
}
progBar.prototype={
	setValue:function(val){
	this.progress=val;
	
	},
	update:function(){
		var gl=canvas.gl;
		gl.beginPath();
		
		gl.fillStyle=this.color;
		gl.fillRect(this.position.x,this.position.y,this.width,this.height);
		gl.fillStyle=this.color2;
		var val=this.progress;
		
		if(val>1){
			val=1;
			
		}
		if(val<0){
			val=0;
			
		}
		gl.fillRect(this.position.x,this.position.y,this.width*val,this.height);
		gl.fill();
		gl.closePath();
		
	}
}
/**
 * this is cursor object
 * @typedef {Object} curObj
 * @param {image} source 
 * @param {vec2d} pos 
 * @prop {image} source this is the image of the cursor displayed
 * @prop {boolean} visible sets whether the cursor is visible or not
 * @prop {number} width width of the cursor
 * @prop {number} height height of the cursor
 */
var curObj=function(source=null,pos=null){
	this.source=source;
	this.visible=false;
	this.width=50;
	this.height=50;
	
}
curObj.prototype={
	setImage:function(source){
		this.source=source
	}
	,update:function(){
		if(this.visible==true){
		canvas.element.style.cursor="none";
		var gl=canvas.gl;
		
		gl.drawImage(this.source,mouseObj.position.x-this.width/2,mouseObj.position.y-this.height/2,this.width,this.height);

		}		
	}
}
var imageGui=function (source=null,pos=null){
	this.position=null;
	this.image1=source;
	this.scene=null;
	this.image2=null;
	this.width=100;
	this.height=100;
	this.img=true;
	this.img2=false;
	this.dynamic=false;
	this.id="imageGui";
	this.active=false;
	this.click=false;
	this.rotation=0;
	if(pos==null){
		this.position=vec(canvas.width/2,canvas.height/2);
	}
	else{
		this.position=pos;
	}
}
imageGui.prototype={
	transform:function(){
		var gl=canvas.gl;
		gl.translate(this.position.x,this.position.y);
		gl.rotate(this.rotation);
	},
	delete:function(){
		if(this.scene!=null){
			this.scene.guiObjects.splice(this.scene.guiObjects.indexOf(this),1)
		}
		delete(this);
	},
	active_draw:function(){
		var gl=canvas.gl;
		gl.beginPath();
		gl.fillStyle="black";
		if(this.dynamic==true){
		if(this.img2==false){
		gl.fillRect(this.position.x,this.position.y,this.width,this.height);
		}
		else{
		gl.drawImage(this.image2,this.position.x,this.position.y,this.width,this.height);
		}
		}
		gl.closePath();
	},
	setImages:function(img,img2=null){
		this.img=true;
		if(img2!=null){
			this.image2=img2;
			this.img2=true;
		}
		this.image1=img;
	},
	action:function(){
	//what the button should 
	if(this.click==true){
	alert("Image clicked");
	}
	},
	getSize:function(){
		var width=this.width;
		var height=this.height;
		
		return [width,height];
	},
	inactive_draw:function(){
		var gl=canvas.gl;
		gl.beginPath();
	
		gl.drawImage(this.image1,this.position.x,this.position.y,this.width,this.height);
		
		gl.closePath();
	},
	update(){
		
		if(this.active==false){
			this.inactive_draw();
		}
		else{
			this.active_draw();
		}
		
	}
}
//polys
var line=function(vec1,vec2,color="red",thickness=1){
	this.scene=null;
	this.origin=vec1;
	this.target=vec2;
	this.color=color;
	this.width=thickness;
	this.rotation=0;
	this.visible=true;
}
line.prototype={
	pre_transform:function(){
		var gl=canvas.gl;
		gl.save();
	
		
	},
	transform:function(){
		
		var gl=canvas.gl;
		gl.translate((this.origin.x),(this.origin.y));
		gl.rotate(this.rotation*Math.PI/180);
		gl.translate(-(this.origin.x),-(this.origin.y));
		
		
	},
	post_transform:function(){
		var gl=canvas.gl;
		gl.restore();
		
		
	},
	delete:function(){
		if(this.scene!=null){
			this.scene.polys.splice(this.scene.polys.indexOf(this),1)
		}
		delete(this);
	},
	update:function(){
		
		if(this.visible==true){
		
		var gl=canvas.gl;
		gl.beginPath();
		gl.strokeStyle=this.color;
		gl.lineWidth=this.width;
		gl.moveTo(this.origin.x,this.origin.y);
		gl.lineTo(this.target.x,this.target.y);
		gl.stroke();
		gl.closePath();
		}
	}
}
var circle=function(pos=null,radius=30,color="white",fill=true){
	this.scene=null;
	this.position=null
	if(pos!=null){
		this.position=pos;
	}
	else{
		this.position=vec(0,0);
	}
	this.radius=radius;
	this.lineWidth=1;
	this.color=color;
	this.fill=fill;
	this.rotation=0;
	this.visible=true;
}
circle.prototype={
	pre_transform:function(){
		var gl=canvas.gl;
		gl.save();
	
		
	},
	transform:function(){
		
		var gl=canvas.gl;
		gl.translate((this.position.x+this.radius/2),(this.position.y+this.radius/2));
		gl.rotate(this.rotation*Math.PI/180);
		gl.translate(-(this.position.x+this.radius/2),-(this.position.y+this.radius/2));
		
		
	},
	post_transform:function(){
		var gl=canvas.gl;
		gl.restore();
		
		
	},
	delete:function(){
		if(this.scene!=null){
			this.scene.polys.splice(this.scene.polys.indexOf(this),1)
		}
		delete(this);
	},
	update:function(){
		if(this.visible==true){
		var gl=canvas.gl;
		gl.beginPath();
		if(this.fill==true){
		gl.fillStyle=this.color;
		gl.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2,true);
		gl.fill();
		}else{
		gl.strokeStyle=this.color;
		gl.lineWidth=this.lineWidth;
		gl.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2,true);
		gl.stroke();
		}
		gl.closePath();
		}
	}
}
//cartesian line render
function cline(line_obj,xlower=-1000,xupper=1000){
		//if the line is not vertical
		if(line_obj.def==false){
		
		var vec1=vec(xlower,line_obj.m*xlower+line_obj.c);
		var vec2=vec(xupper,line_obj.m*xupper+line_obj.c);
	
		var l=new line(vec1,vec2,"red");
		return l;
		}
		//if the line is vertical
		else{
		var vec1=vec(line_obj.c,xlower);
		var vec2=vec(line_obj.c,xupper);

		var l=new line(vec1,vec2,"red");
		return l;
		}
}
//rectangle polygon object
var rectangle=function(pos=null,width=50,height=50,color="black",fill=true){
	this.scene=null;
	this.position=null
	
	if(pos!=null){
		this.position=pos;
	}
	else{
		this.position=vec(0,0);
	}
	this.width=width;
	this.height=height;
	this.lineWidth=1;
	this.color=color;
	this.source=null;
	this.img=false;
	this.fill=fill;
	this.visible=true;
	this.rotation=0;
}
rectangle.prototype={
	pre_transform:function(){
		var gl=canvas.gl;
		gl.save();
	
		
	},
	transform:function(){
		
		var gl=canvas.gl;
		gl.translate((this.position.x+this.width/2),(this.position.y+this.height/2));
		gl.rotate(this.rotation*Math.PI/180);
		gl.translate(-(this.position.x+this.width/2),-(this.position.y+this.height/2));
		
		
	},
	post_transform:function(){
		var gl=canvas.gl;
		gl.restore();
		
		
	},
	delete:function(){
		if(this.scene!=null){
			this.scene.polys.splice(this.scene.polys.indexOf(this),1)
		}
		delete(this);
	},
	setImage:function(source){
		this.source=source;
		this.img=true;
	},
	update:function(){
		if(this.visible==true){
		var gl=canvas.gl;
		gl.beginPath();
		if(this.img==false){
		if(this.fill==true){
		gl.fillStyle=this.color;
		
		gl.fillRect(this.position.x-this.width/2,this.position.y-this.height/2,this.width,this.height);
		gl.stroke();
		gl.fill();
		}else{
		gl.strokeStyle=this.color;
		gl.lineWidth=this.lineWidth;
		gl.strokeRect(this.position.x-this.width/2,this.position.y-this.height/2,this.width,this.height);
		gl.stroke();
		}
		}
		else{
		gl.drawImage(this.source,this.position.x-this.width/2,this.position.y-this.height/2,this.width,this.height);
		}
		gl.closePath();
	}
	}
}
//system functions
function center(){
	var v=vec(canvas.width/2,canvas.height/2);
		return v;	
}
function init_assets(){
	assetslive=0;
	assetcount=images.length+sounds.length;
	
	//initialize images
	for (i in images){
		var img=image(images[i]);
		
		imageSet[images[i]]=img;
	}
	//initialize audios
	for (i in sounds){
			var aud=audio(sounds[i]);
			soundSet[sounds[i]]=aud;
	}
	
}
function clear(color=null){
	var col="black";
	if(color!=null){
		col=color;
	}
	var offset=camera.position
	var gl=canvas.gl;
	gl.fillStyle=col;
	gl.fillRect(0-offset.x,0-offset.y,canvas.element.width,canvas.element.height);
	

}
function load(){
	//loading assets
	assetslive+=1;

	progress=assetslive/assetcount;
	
	if(assetslive==assetcount){
		loader.run();
	}
	
	
}
function image(src){
	var img=new Image();
	img.src=src;
	
	img.onload=function (){
		load();
	}
	return img;
}
function audio(src){
	var aud=new Audio();
	aud.src=src;
	
	aud.onload=function (){
		load();
	}
	aud.src=src;
	return aud;
}
//canvas
var canv=function(id="screen"){
	this.id=id;
	//web-gl
	this.gl=null;
	//viewport height and width
	this.width=null;
	this.height=null;
	this.scenes={};
	//screen element
	this.element=null;
	this.currentScene=null;
	//view
	this.dx=0;
	this.dy=0;
	this.scx=1;
	this.scy=1;
	this.initialize();
}
canv.prototype={
	resetViewport:function(width,height){
		this.width=width;
		this.height=height;
	
	},
	processPhysics:function(pair){
		var r1=pair[0].object.components["rigidbody"];
		var r2=pair[1].object.components["rigidbody"];
		if(r1){
			r1.process();
		}
		if(r2){
			r2.process();
		}
	},
	processCol:function(cols){
				for(i in cols){
					var pair=cols[i];
					if(pair[0].active==true&&pair[1].active==true){
						collisionDetect(pair[0],pair[1]);
					}
				}
	},
	pre_process:function(){
		var scn=this.currentScene;
		if(scn!=null){
			var samples=5;
			var i=0;
			var cols=scn.colliders;
			cols=pairOf(cols);
			
			while(i<samples){
				for(a in cols){
					var pair=cols[a];
					this.processPhysics(pair);
				}
				this.processCol(cols);
				i++;
			}
		}
	},
	logic:function(){},
	update:function(){
	
			
		if(this.currentScene!=null){
			eventHandler();
			this.logic();
			this.pre_process();
			this.currentScene.update();
			clearEvents();
	
			
			
		}
		
	},
	addScene:function (scene){
		this.scenes[scene.name]=scene;
	},
	worldCord:function(x,y){
		var scx=1;
		var scy=1;
		var v=vec(x/scx,y/scy);
		return v;
	},
	initialize:function(){
		var element =document.getElementById(this.id);
		this.element=element;
		//adding event handlers
		element.onmousedown=function(){
			var x=event.x-element.offsetLeft;
			var y=event.y-element.offsetTop;
			var cords=canvas.worldCord(x,y);
			mousedown(cords.x,cords.y,event);
		}
		element.onmouseup=function(){
			var x=event.x-element.offsetLeft;
			var y=event.y-element.offsetTop;
			var cords=canvas.worldCord(x,y);
			mouseup(cords.x,cords.y,event);
		}
		element.onmousemove=function(){
			var x=event.x-element.offsetLeft;
			var y=event.y-element.offsetTop;
			var cords=canvas.worldCord(x,y);
			mousemove(cords.x,cords.y,event);
		
		}
		element.onclick=function(){
			var x=event.x-element.offsetLeft;
			var y=event.y-element.offsetTop;
			var cords=canvas.worldCord(x,y);
			mclick(cords.x,cords.y,event);
		}
		element.onmouseout=function(){
			var x=event.x-element.offsetLeft;
			var y=event.y-element.offsetTop;
			var cords=canvas.worldCord(x,y);
			mouseObj.over=false;
		}
		element.onmouseover=function(){
			var x=event.x-element.offsetLeft;
			var y=event.y-element.offsetTop;
			var cords=canvas.worldCord(x,y);
			mouseObj.over=true;
		}
		document.body.addEventListener("keyup",keyup);		
		document.body.addEventListener("keydown",keydown);		
		document.body.addEventListener("keypress",keypress);		
		this.gl=element.getContext("2d");
		
	}
	
	
}
//material 
var matObj=function(obj,name,w=50,h=50){
	this.name=name;
	this.object=obj;
	this.width=w;
	this.height=h;
	this.animated=false;
	this.offset=[0,0]
	this.animation=[];
	this.renderer=new rectangle(obj.position,w,h,color="blue",true);
	
} 
matObj.prototype={
	setSize:function(w,h){
		this.width=w;
		this.height=h;
	},
	loadClip:function(source,clip_w,clip_h,frame){
		this.animation=[source,clip_w,clip_h,frame];
	},
	animate:function(){
		var anim=this.animation;
		if(anim.length>0){
		var img=anim[0].source;
		var cw=anim[0].clip_size[0];
		var ch=anim[0].clip_size[1];
		var dir=anim[0].direction;
		var index=anim[1];
		
		if(dir==0){
		var x0=parseFloat(index*cw);
		var y0=0;
		}else{
		var y0=parseFloat(index*ch);
		var x0=0;	
		}

		var x=this.object.position.x-this.width/2+this.offset[0];
		var y=this.object.position.y-this.height/2+this.offset[1];
		var gl=canvas.gl;
		gl.beginPath();
		//draw animation frame
		gl.drawImage(img,x0,y0,cw,ch,x,y,this.width,this.height);
		gl.closePath();
		}

	},
	update:function(){
		this.renderer.position=this.object.position;
		if(this.animated==false){
		this.renderer.update();
		}
		else{
			this.animate();
		}
	}
}
//constructors
function material(obj,name,w=50,h=50){
	var m=new matObj(obj,name,w,h);
	return m;
}
function selector(vector){
	var v=new selector2D(vector);
	return v;
}
function scene(name){
	var v=new scen(name);
	return v;
}
//instance of canvas
const canvas=new canv("screen");
//cursor
cursor=new curObj()
//camera
const camera=new viewObj();