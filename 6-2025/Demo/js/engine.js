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
var timeout=0;

/**
 * object stores images generated as HTML Image Elements
 * @constant
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
 * variable sets the directory to the game assets
 * @type {string}
 * @global
 */
var assetDirectory="";
/**
 * array stores images to be used by the game
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


//view object
/**
 * This class is used to control the viewport settings of the game. <br>
@global
 * @class
 */
class viewObj{
		/**
	 * This function creates an instance of viewObj
	 * @param {canv} canvas this is the canvas object to which the viewobj belongs
	 */
	constructor(canvas){

		/**
	 * 
	 * @prop {Object} ctx  This is the 2D rendering context.
	 */
	this.ctx=canvas.ctx;
		/**
	 * 
	 * @prop {canv} canvas This is the canvas object to which the viewobj belongs.
	 */
		this.canvas=canvas;

	//translation vector
	/**
	 * 
	 * @prop {vec2d}  position This is the position of the viewport
	 */
	this.position=vec(0,0),
	//actual position 
	//translation vector
	/**
	 * 
	 * @prop {vec2d} worldposition This is the world position of the viewport
	 */
    this.worldposition=center(canvas)
	
	/**
	 * This is viewport object
	 * @prop {number} width this is the width of the viewport
	 * @prop {number} height this is the height of the viewport
	 */
	this.viewport={
		"width":500,
		"height":500
	}
	
	
	}

	/**
	 * This function sets the position of the viewport
	 * @function
	 * @param {vec2d} position
	 * @memberof viewObj
	 */
	setPosition(vec){
		var offsetx=vec.x-this.position.x;
		var offsety=vec.y-this.position.y;

		this.worldposition.x=vec.x;
		this.worldposition.y=vec.y;

		this.position.x=-offsetx;
		this.position.y=-offsety;

		this.canvas.ctx.translate(-offsetx,-offsety);
	}
	/**
	 * This function sets the position of the viewport
	 * @function
	 * @param {number} width this is the width of the viewport
	 * @param {number} height this is the height of the viewport
	 * @memberof viewObj
	 */
	setViewport(width,height){
		this.viewport.width=width;
		this.viewport.height=height;
		this.canvas.resetViewport(width,height);
		
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
	var ctx=this.scene.canvas.ctx;
	ctx.save();
}
transform(){
	
	var ctx=this.scene.canvas.ctx;
	ctx.translate((this.position.x),(this.position.y));
	ctx.rotate(this.rotation*Math.PI/180);
	ctx.translate(-(this.position.x),-(this.position.y));
	
	
}
post_transform(){
	var ctx=this.scene.canvas.ctx;
	ctx.restore();
	
	
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
		if(this.components[i]){
			this.components[i].update();
		}
		
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
	 * @param {canv} canvas this is the canvas object to which the selector belongs.
	 */
	constructor(vect=null,canvas=null){
	/**
	 * @prop {vec2d} position this is the position of the selector.
	 */
	this.position=vec(0,0);
	/**
	 * @prop {canv} canvas this is the canvas object to which the selector belongs.
	 */
	this.canvas=canvas
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
	this.canvas.event_system.mouseObj.selector=this;
	this.canvas.event_system.mdrag.actions.push(this.dragObj);
	
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
		var ctx=this.canvas.ctx;
		ctx.save();
		var offset=20;
		
		var x0=this.marked.position.x;
		var y0=this.marked.position.y;
		
		ctx.beginPath();
		ctx.lineWidth=2;
	
		
			
		var yn=""+this.marked.position.y;
		var xn=""+this.marked.position.x;
		var name=this.marked.name;
		xn=xn.substr(0,7);
		yn=yn.substr(0,7);
		
		ctx.strokeStyle='#67ff67';
		//y-axis
		ctx.moveTo(x0,y0);
		ctx.lineTo(x0,y0+offset);
		ctx.fillStyle='#aaeeaa';
		ctx.font='10px Arial';
		ctx.fillText('Y '+yn,x0-2,y0+offset+10);
		ctx.fillText(''+name,x0+offset+2,y0+10);
		ctx.fill();
		ctx.stroke();
		//x-axis
		ctx.beginPath();
		ctx.strokeStyle='#ff6767';
		ctx.moveTo(x0,y0);
		ctx.lineTo(x0+offset,y0);
		ctx.fillStyle='#eeaaaa';
		ctx.font='10px Arial';
		ctx.fillText('X '+xn,x0+offset+5,y0-1);
		ctx.fill();
		ctx.stroke();
		ctx.restore();
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
 * @param {scen} scene this is scene that the object belongs to
 * @param {string} name  this is the name of game object
 */
constructor(scene,name="GameObject"){
	/**
	 *@prop {string} name this is name of the game object. 
	 */
this.name=name;
/**
	 *@prop {scen} scene this is  scene for the game object.
	 */
this.scene=scene;
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
this.position=vec(scene.canvas.width/2,scene.canvas.height/2);
/**
 * @property {object} components this a dictionary storing component objects such as colliders.
 */
this.components={};
/**
	 *@prop {Array} materials this is an array the materials on the game object.
	 */
this.materials=[];
this.materials[0]=material(this,"mat0",this.width,this.height);
/**
	 *@prop {number}  rotation  this is the angle of rotation of the game object in degrees
	 */
this.rotation=0;
/**
	 *@prop {boolean} is_active if true, the game object is active. if false, the game object is not updated;
	 */
	 this.is_active=true;

this.active=true;
/**
	 *@prop {boolean} visible if true, the game object is visible and its materials are updated. if false , the render function is not called.
*/
this.visible=true;
this.constraints=[];
this.deleted=false;
this.visuals=[];
this.orientation=null;
}
/**
	 * this function sets the pre render effects to game object. it can be overriden for custom behaviour.this function is called when updating the material.
	 * @function
	 *@memberof GameObject
	 *@param {matObj} material this is current material of the game object being update;
	 * @returns {void}
	 */
	 pre_render(material){
		
	}
	/**
	 * this function sets the post render effects to game object. it can be overriden for custom behaviour. this function is called when updating the material.
	 * @function
	 *@memberof GameObject
	 *@param {matObj} material this is current material of the game object being update;
	 * @returns {void}
	 */
	 post_render(material){
		
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
		for(let i=0;i<this.constraints.length;i++){
			this.constraints[i].update();
	
			
		}
		
	}
	setPositionUpdate(vec,constraint_obj){
		this.position.x=vec.x;
		this.position.y=vec.y;
		this.position.getMagnitude();
		for(let i=0;i<this.constraints.length;i++){
			var c=this.constraints[i];
			if(c!=constraint_obj){
				c.update();
			}
			
		}
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
	 * this function deletes the game object from the scene at the start of the game cycle
	 * @function
	 * @memberof GameObject
	 * @returns {void}
	 */
	delete_later(){
		if(this.scene!=null){
			this.scene.deleted.push(this);
			if(this.components["collider"]){
				this.components["collider"].delete_later();
			}
			if(this.components["rigidbody"]){
				this.components["rigidbody"].delete_later();
			}
		}
		
	}
	/**
	 * this function deletes the game object from the scene immediately
	 * @function
	 * @memberof GameObject
	 * @returns {void}
	 */
	delete(){
		if(this.scene!=null){
			
			if(this.scene.objects.includes(this)){
				this.scene.objects.splice(this.scene.objects.indexOf(this),1);
			}
		
			if(this.components["collider"]){
				this.components["collider"].delete();
			}
			if(this.components["rigidbody"]){
				this.components["rigidbody"].delete();
			}
			
			while(this.constraints.length>0){
				var c=this.constraints.pop(this.constraints.length-1);
				
				c.clean(this);
			
			}
			this.deleted=true;
		    delete(this);
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
		for(let i=0;i<this.materials.length;i++){
		   this.materials[i].setSize(width,height)
		}
	}
	pre_transform(){
		var ctx=this.scene.canvas.ctx;
		ctx.save();
	
		
	}
	transform(){
		
		var ctx=this.scene.canvas.ctx;
		ctx.translate((this.position.x),(this.position.y));
		ctx.rotate(this.rotation*Math.PI/180);
		ctx.translate(-(this.position.x),-(this.position.y));
		
		
	}
	post_transform(){
		var ctx=this.scene.canvas.ctx;
		ctx.restore();
		
		
	}
	addComponent(obj){
		this.components[obj.type]=obj;
		return obj
	}
	render(){
	
		for(let i=0;i<this.materials.length;i++){
			var mat=this.materials[i];
			this.pre_render(mat);
			mat.update();
			this.post_render(mat);
		}
	
	}
	/**
	 * this function returns the orientation of the game object
	 * @function
	 * @memberof GameObject
	 * @param {boolean} visualize visualize if true, the orientation object render on screen as a component of the gameobject.
	 * @returns {orientationObj}
	 */
	getOrientation(visualize=false){
		if(this.orientation==null){
			this.orientation=new orientationObj(this,visualize);
		}

		return this.orientation;
	}
	/**
	 * this function used to set the game logic for the game object. It is automatically called during the logic cycle of the game.
	 * @function
	 * @memberof GameObject
	 * @returns {void}
	 */
	logic(){}
	/**
	 * this function updates and draws the gameObject and its components on every frame.
	 * @function
	 * @memberof GameObject
	 * @returns {void}
	 */
	update(){
		if(this.is_active==true && this.deleted==false){
		var keys=Object.keys(this.components);
		for(let i=0;i<keys.length;i++){
			var comp=this.components[keys[i]];
			comp.update();
		}
		
		this.logic();
		this.pre_transform();
		this.transform();
		if(this.visible==true){
			this.render();
		}
		
		this.post_transform();
		for(let i=0;i<this.visuals.length;i++){
			this.visuals[i].update();
		}
		}
	}	
	
}
//orientation objects
/**
 * this is orientation object class used to give the orientation of a game object based on rotation.
 * @class
 * @global
 */
class orientationObj{
	/**
	 * 
	 * @param {GameObject} object this is the position of the selector.
	 * @param {boolean} visualize if true, the orientation object render on screen as a component of the gameobject.
	 */
	constructor(object,visualize=false){
	/**
	 * @prop {GameObject} object this is the position of the selector.
	 */
	this.type="orientation";
	this.object=object;
	this.visualize=visualize;
	if(visualize==true){
		object.visuals.push(this);
	}


	
}
	/**
	 * this function returns the global up rotation;
	 * @returns {number} 
	 */
	upRotation(){
		return 270;
	}
		/**
	 * this function returns the global up rotation;
	 * @returns {number} 
	 */
		downRotation(){
			return 90;
		}
			/**
	 * this function returns the global up rotation;
	 * @returns {number} 
	 */
	leftRotation(){
		return 180;
	}
		/**
	 * this function returns the global up rotation;
	 * @returns {number} 
	 */
		rightRotation(){
			return 0;
		}
	/**
	 * this function returns the normalized vector of the upward direction based on the orientation of the game object.
	 * @returns {vec2d} 
	 */
	up(){
		var verts=dverts(this.object.position,this.object.width,this.object.height,this.object.rotation);
		var normals=dnormals(verts);	
		return normals[0].normalized();
	}
		/**
	 * this function returns the normalized vector of the downward direction based on the orientation of the game object.
	 * @returns {vec2d} 
	 */
		down(){
			var verts=dverts(this.object.position,this.object.width,this.object.height,this.object.rotation);
			var normals=dnormals(verts);	
			return normals[2].normalized();
		}

			/**
	 * this function returns the normalized vector of the right direction based on the orientation of the game object.
	 * @returns {vec2d} 
	 */
	right(){
		var verts=dverts(this.object.position,this.object.width,this.object.height,this.object.rotation);
		var normals=dnormals(verts);	
		return normals[1].normalized();
	}
		/**
	 * this function returns the normalized vector of the left direction based on the orientation of the game object.
	 * @returns {vec2d} 
	 */
		left(){
			var verts=dverts(this.object.position,this.object.width,this.object.height,this.object.rotation);
			var normals=dnormals(verts);	
			return normals[3].normalized();
		}

	draw(){
		var verts=dverts(this.object.position,this.object.width,this.object.height,this.object.rotation);
		var normals=dnormals(verts);
		var ctx=this.object.scene.canvas.ctx;
		ctx.save();
		var offset=20;
		
		
		var x0=this.object.position.x;
		var y0=this.object.position.y;
		
		ctx.beginPath();
		ctx.lineWidth=2;
	
		
			
		var yn=""+this.object.position.y;
		var xn=""+this.object.position.x;
		var name=this.object.name;
		xn=xn.substr(0,7);
		yn=yn.substr(0,7);
		
		ctx.strokeStyle='#67ff67';
		//y-axis
		var up=normals[0].normalized();
		up=addVec(this.object.position,scaleVec(up,offset));
		ctx.moveTo(x0,y0);
		ctx.lineTo(up.x,up.y);
		ctx.fillStyle='#aaeeaa';
		ctx.font='10px Arial';
		ctx.save()
		ctx.translate((this.object.position.x),(this.object.position.y));
		ctx.rotate(this.object.rotation*Math.PI/180);
		ctx.translate(-(this.object.position.x),-(this.object.position.y));
		ctx.fillText('Y '+yn,x0-2,y0-offset-10);
		ctx.fillText(''+name,x0+offset+2,y0-10);
		ctx.fill();
		ctx.stroke();
		ctx.restore();
		//x-axis
		var right=normals[1].normalized();
		right=addVec(this.object.position,scaleVec(right,offset));

		ctx.beginPath();
		ctx.strokeStyle='#ff6767';
		ctx.moveTo(x0,y0);
		ctx.lineTo(right.x,right.y);
		ctx.fillStyle='#eeaaaa';
		ctx.font='10px Arial';
		ctx.save()
		ctx.translate((this.object.position.x),(this.object.position.y));
		ctx.rotate(this.object.rotation*Math.PI/180);
		ctx.translate(-(this.object.position.x),-(this.object.position.y));
		ctx.fillText('X '+xn,x0+offset+5,y0-1);
		ctx.restore();
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}
	
	update(){
	
		if(this.object!=null){
			

			if(this.visualize==true && this.object.deleted!=true){
				this.draw();
			}
				
		}
	}		
}
/**
 * this is the particle object 
 * @class
 * @global
 */
class particleObj extends GameObject{
	/**
 * 

 * @param {particleSystem} particle_system this is particle system that the object belongs to
 * @param {string} name  this is the name of game object
 */
constructor(particle_system,name="particle"){
super(particle_system.scene,name);
	/**
*@prop {particleSystem} particle_system  this is the particle system to which to particle belongs
*/
this.particle_system=particle_system
	/**
*@prop {object} properties  this object the properties of the particle system
*/
this.properties={
   velocity:vec(0,0),
   acceleration:vec(0,0),
   material:['color','#fff'],
   initial_material:['color','#fff'],
   life:5,
   initial_life:5,
   life_cycle:0.01,// rate  at which life reduces
   size:vec(5,5),
   initial_size:vec(5,5),
   direction:1 // This is the direction of the particles.e.g.1 for local direction, 1 for global direction

}
this.type='particle';
this.setPosition(particle_system.position);
this.setSize(this.properties.size.x,this.properties.size.y);

particle_system.particles.push(this);
}
/**
	 * this function deletes the particle object from the scene at the start of the game cycle
	 * @function
	 * @memberof GameObject
	 * @returns {void}
	 */
delete_later(){
	if(this.scene!=null){
		this.scene.deleted.push(this);
		if(this.components["collider"]){
			this.components["collider"].delete_later();
		}
		if(this.components["rigidbody"]){
			this.components["rigidbody"].delete_later();
		}
	}
	
}
/**
 * this function particle the game object from the scene immediately
 * @function
 * @memberof GameObject
 * @returns {void}
 */
delete(){
	if(this.scene!=null){
		if(this.particle_system){
			if(this.particle_system.particles.includes(this)){
				this.particle_system.particles.splice(this.particle_system.particles.indexOf(this),1);
			}
		}
		
		if(this.scene.objects.includes(this)){
			this.scene.objects.splice(this.scene.objects.indexOf(this),1);
		}
	
		if(this.components["collider"]){
			this.components["collider"].delete();
		}
		if(this.components["rigidbody"]){
			this.components["rigidbody"].delete();
		}
		for(let i=0;i<this.constraints.length;i++){
			this.constraints[i].clean(this);
		}
		this.deleted=true;
		delete(this);
	}
	
}
}
/***
 * function creates new particle
 * @function
 * @param {particleSystem} particle_system this is particle system that the object belongs to
 * @param {string} name  this is the name of game object
 */
function particle(particle_system,name="particle"){
	return new particleObj(particle_system,name);
}
//particle system
/**
 * this is the particle system class. 
 * @class
 * @global
 */
class particleSystem{
	/**
	 * 
	 * @param {scen} scene this is scene that the particle system belongs to
	 * @param {string} name  this is the name of particle system
	 */
	constructor(scene,name="particleSystem"){
		/**
		 *@prop {string} name this is name of the particle system. 
		 */
	this.name=name;
	/**
		 *@prop {scen} scene this is  scene for the particle system.
		 */
	this.scene=scene;

	this.width=50;

	this.height=50;
	/**
		 *@prop {object} properties  this object the properties of the particle system
		 */
	this.properties={
			initial_velocity:vec(0,0),
			acceleration:vec(0,0),
			material: ["color","yellow"],
			life:5,
			life_cycle:0.05, //rate at which life reduces
			count:1,//number of particles to emit per interval
			size:vec(5,5),
			dt:0.001,// time increment,
			dt:0.001,// time increment
			time:0,// time since particle was created;
			delay:0, // in seconds
			interval:2, // in seconds
			direction:0 // This is the direction of the particles.e.g.0 for local direction, 1 for global direction
			//modification function

		 }
	/**
		 *@prop {vec2d} position  this is position  of the particle system. 
		 */
	this.position=vec(scene.canvas.width/2,scene.canvas.height/2);
	
	/**
		 *@prop {number}  rotation  this is the angle of rotation of the particle system in degrees
		 */
	this.rotation=0;
	/**
		 *@prop {boolean} active if true, the particle system is active.
		 */
	this.active=true;
		/**
		 *@prop {Array} particles this array stores particles in the particle system

		 */
	this.particles=[];
	this.constraints=[];
	this.visuals=[];
	this.orientation=null;
	this.active=false;
	this.deleted=false;
	this.emission_ready=true;
	scene.objects.push(this);
	
	}
		/**
		 * this function start particle emission from the particle system
		 * @function
		 *@memberof  particleSystem
		 * @returns {void}
		 */
		 emit(){
				this.active=true;
		
				setTimeout(this.emissionUpdate,this.properties.delay*1000,this);
		}
		emissionUpdate(obj){
			if(obj.emission_ready==true){
				obj.emission();
				if(obj.active==true){
					if(obj.scene.canvas.currentScene==obj.scene){
						setTimeout(obj.emissionUpdate,obj.properties.interval*1000,obj);
					}
					
				}
			}
		
		
		}
	
	   		/**
		 * this function sets the initial size  of the particle. It can be override for custom behaviour.
		 * @function
		 * @param {particleObj} particle_obj this is the particle object to be update
		 *@memberof  particleSystem
		 * @returns {void}
		 */
		 startSizeFunction(particle_obj){
			particle_obj.properties.size=particle_obj.properties.size;
	   }
	   		/**
		 * this function sets the inital size over life of the particle. It can be override for custom behaviour.
		 * @function
		 * @param {particleObj} particle_obj this is the particle object to be update
		 *@memberof  particleSystem
		 * @returns {void}
		 */
		 sizeFunction(particle_obj){
			particle_obj.properties.size=particle_obj.properties.size;
	   }
		/**
		 * this function sets the inital position of the particle. It can be override for custom behaviour.
		 * @function
		 * @param {particleObj} particle_obj this is the particle object to be update
		 *@memberof  particleSystem
		 * @returns {void}
		 */
		
		 startPositionFunction(particle_obj){
			 particle_obj.setPosition(particle_obj.particle_system.position);
		}
		/**
		 * this function sets the inital velocity of the particle. It can be override for custom behaviour.
		 * @function
		 * @param {particleObj} particle_obj this is the particle object to be update
		 *@memberof  particleSystem
		 * @returns {void}
		 */
		 startVelocityFunction(particle_obj){
			var props= particle_obj.particle_system.properties;
			var direction=particle_obj.particle_system.getOrientation();
			if(this.properties.direction==0){
				particle_obj.properties.velocity=rotateAxis(props.initial_velocity,direction.right(),direction.up());
				
				
			}
			else{
				particle_obj.properties.velocity=props.initial_velocity.copy();
			
			}
			
	   }
	   	/**
		 * this function sets the velocity over life of the particle. It can be override for custom behaviour.
		 * @function
		 * @param {particleObj} particle_obj this is the particle object to be update
		 *@memberof  particleSystem
		 * @returns {void}
		 */
		 velocityFunction(particle_obj){
			var props=particle_obj.properties;
			//acceleration
			var acc=props.acceleration;
			props.velocity.x+=acc.x;
			props.velocity.y+=acc.y;
			particle_obj.setPosition(addVec(particle_obj.position,props.velocity));
	    }
	   /**
		 * this function sets the inital acceleration of the particle. It can be override for custom behaviour.
		 * @function
		 * @param {particleObj} particle_obj this is the particle object to be update
		 *@memberof  particleSystem
		 * @returns {void}
		 */
		 startAccelerationFunction(particle_obj){
			var props= particle_obj.particle_system.properties;
			var direction=particle_obj.particle_system.getOrientation();
			if(this.properties.direction==0){
				
				particle_obj.properties.acceleration=rotateAxis(props.acceleration,direction.right(),direction.up());
				
			}
			else{
				
				particle_obj.properties.acceleration=props.acceleration.copy();
			}
			
	   }
	   /**
		 * this function sets the inital material definition of the particle.e.g. ["color","red"] or ["image","HTMLImageElement"] It can be override for custom behaviour.
		 * @function
		 * @param {particleObj} particle_obj this is the particle object to be update
		 *@memberof  particleSystem
		 * @returns {void}
		 */
		 startMaterialFunction(particle_obj){
			particle_obj.properties.material=particle_obj.particle_system.properties.material;
	   }
	   /**
		 * this function sets the  material definition over life of the particle.e.g. ["color","red"] or ["image","HTMLImageElement"] It can be override for custom behaviour.
		 * @function
		 * @param {particleObj} particle_obj this is the particle object to be update
		 *@memberof  particleSystem
		 * @returns {void}
		 */
		 materialFunction(particle_obj){
			return particle_obj.properties.material;
			
	   	}
			/**
		 * this function emits particles from the particle system and triggers its simulation
		 * @function
		 * @param {particleSystem} particle_system this is the particle system from which the emission is made
		 *@memberof  particleSystem
		 * @returns {void}
		 */
		 emission(){
			    var props=this.properties;
				for(let i=0;i<this.properties.count;i++){
					var particle_obj=particle(this);
					
					if(this.properties.direction==0){
					particle_obj.rotation=this.rotation;
					}
					particle_obj.properties.life=props.life;
					particle_obj.properties.initial_life=props.life;
					particle_obj.properties.life_cycle=props.life_cycle;
					particle_obj.properties.dt=props.dt;
					this.startSizeFunction(particle_obj);
					this.startPositionFunction(particle_obj);
					this.startVelocityFunction(particle_obj);
					this.startAccelerationFunction(particle_obj);
					this.startMaterialFunction(particle_obj);
					this.simulateParticle(particle_obj);
					
					particle_obj.properties.initial_material=particle_obj.properties.material;
					particle_obj.properties.initial_size=particle_obj.properties.size;
				}
				
		 }
	/**
		 * this function modifies particles properties
		 * @function
		 * @param {particleObj} particle_obj this is the particle object to simulate
		 *@memberof  particleSystem
		 * @returns {void}
		 */
	   simulateParticle(particle_obj){
					
					particle_obj.logic=function(){
						var props=this.properties;
						//perform simulation function
						this.particle_system.velocityFunction(particle_obj);
						this.particle_system.materialFunction(particle_obj);
						this.particle_system.sizeFunction(particle_obj);
						//set the material for particle
						var mat=this.properties.material;
						if(mat[0]=="color"){
							
							particle_obj.materials[0].renderer.setColor(mat[1]);
						}
						else if(mat[0]=="image"){
							particle_obj.materials[0].renderer.setImage(mat[1]);
						}
						//set size
						var size=this.properties.size;
						this.setSize(size.x,size.y);
						//check
						props.life-=props.life_cycle;
						props.time+=props.dt;
	
						if(props.life<=0){
							
							this.delete();
						}
					}


		}
	/**
		 * this function sets the position of the particle system.
		 * @function
		 * @param {vec2d} vector this is the new position  of the game object
		 *@memberof  particleSystem
		 * @returns {void}
		 */
		 setPosition(vec){
			this.position.x=vec.x;
			this.position.y=vec.y;
			this.position.getMagnitude();
			for(let i=0;i<this.constraints.length;i++){
				this.constraints[i].update();
		
				
			}
			
		}
		setPositionUpdate(vec,constraint_obj){
			this.position.x=vec.x;
			this.position.y=vec.y;
			this.position.getMagnitude();
			for(let i=0;i<this.constraints.length;i++){
				var c=this.constraints[i];
				if(c!=constraint_obj){
					c.update();
				}
				
			}
		}
		
		
		/**
		 * this function deletes the particle system from the scene at the start of the game cycle
		 * @function
		 * @memberof  particleSystem
		 * @returns {void}
		 */
		delete_later(){
			this.emission_ready=false;
			if(this.scene!=null){
				this.scene.deleted.push(this);
			}
			
		}
		/**
		 * this function deletes the particle system from the scene immediately
		 * @function
		 * @memberof  particleSystem
		 * @returns {void}
		 */
		delete(){
			this.emission_ready=false;
			this.active=false;
			if(this.scene!=null){
				
				while(this.particles.length>0){
					this.particles[this.particles.length-1].delete();
				}
				if(this.scene.objects.includes(this)){
					this.scene.objects.splice(this.scene.objects.indexOf(this),1);
		
				}
			
				while(this.constraints.length>0){
					var c=this.constraints.pop(this.constraints.length-1);
					
					c.clean(this);
				
				}
	
				this.deleted=true;
				delete(this);
			}
			
		}
		
		
	
		/**
		 * this function returns the orientation of the particle system
		 * @function
		 * @memberof  particleSystem
		 * @param {boolean} visualize visualize if true, the orientation object render on screen as a component of the particle system.
		 * @returns {orientationObj}
		 */
		getOrientation(visualize=false){
			if(this.orientation==null){
				this.orientation=new orientationObj(this,visualize);
			}
	
			return this.orientation;
		}
		/**
		 * this function used to set the game logic for the particle system. It is automatically called during the logic cycle of the game.
		 * @function
		 * @memberof particleSystem
		 * @returns {void}
		 */
		logic(){}
		/**
		 * this function updates and draws the particle system and its components on every frame.
		 * @function
		 * @memberof particleSystem
		 * @returns {void}
		 */
		update(){
			this.logic();
			if(this.emission_ready==true && this.active ==true && this.deleted==false){
			
			for(let i=0;i<this.particles.length;i++){
				 this.particles[i].update();
			}
			}
			
			for(let i=0;i<this.visuals.length;i++){
				this.visuals[i].update();
			}
		}	
		
	}
//constraint object
/**
 * this is the constraint object class. Constraints are used to set orientation and position constraint between a parent and its children
 * @class
 * @global
 */
class constraintObj{
	/** 
	* @param {GameObject} parent this is the parent game object
	* @param {Array} children this is an array of the child objects
	* @param {number} type this is the type of constraint.e.g. 0 for a local transform constraint, 1 for  fixed rotation-transform constraint, 2 for a position constraint, 3 for a rotation constraint, 4 for a position and rotation constraint
	* @param {boolean} complete_delete if set to true, the children are deleted when the parent is deleted
 */
	constructor(parent,children=[],type=0,complete_delete=false){
	/** 
	* @prop {GameObject} parent this is the parent game object
	*/	
	this.parent=parent;
		/** 
	* @prop {Array} children  this is an array of the child objects
	*/	
	this.children=children;
		/** 
	* @prop {number} type this is the type of constraint.e.g. 0 for a local transform constraint, 1 for fixed rotation-transform constraint, 2 for a position constraint, 3 for a rotation constraint, 4 for a position and rotation constraint
	*/	
	this.type=type

	this.complete_delete=complete_delete;
	
		/** 
	* @prop {scen} scene this is the scene to which the parent belongs
	*/	
	this.scene=parent.scene;
	this.offsets=[];
	
	this.scene.constraints.push(this);
	this.deleted=false;
	this.prev_rotation=null;
	this.initialize();
	if(complete_delete==true){
		
		if(parent){
		
			
			parent.delete=function(){
			
				
				for(let i=0;i<this.constraints.length;i++){
					var cont=this.constraints[i];
					
					var index=0;
					while(index<cont.children.length){
							var child=cont.children[index]
							
							if(child){
							
								child.delete();
							}
						
							index+=1;
					}
				}	
				GameObject.prototype.delete.call(this);

			}
		}
	}
 }
 initialize(){

		var parent=this.parent;
		this.parent.constraints.push(this);
		if(parent){
			for(let i=0;i<this.children.length;i++){
					var child=this.children[i];
					child.constraints.push(this);
					if(child && child!=parent){
							this.offsets.push([subVec(parent.position,child.position),child,child.rotation-parent.rotation]);
							
					}
			}
		}
 }
 //look at object
/**
 * this function makes an gameobject face in the direction of vector or gameobject.
 * @function
 * @param {GameObject} obj this is the gameobject to apply the rotation.
 * @param {object} target this is another gameobject or vector. 
 * @param {vec2d} offset this is offset vector from which the object positions are relative. the defualt value is null;
 * @memberof constraintObj
 * @returns {void} 
 */
 lookAt(obj,target,offset=null){
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
 /**
	 * this function deletes the constraint object from the scene at the start of the game cycle
	 * @function
	 * @memberof constraintObj
	 * @returns {void}
	 */
 delete_later(){
	if(this.scene!=null){
		this.scene.deleted.push(this);
	}
	
}
/**
 * this function deletes the constraint object from the scene immediately
 * @function
 * @memberof constraintObj
 * @returns {void}
 */
delete(){
	if(this.scene!=null){
		
		if(this.scene.constraints.includes(this)){
			this.scene.constraints.splice(this.scene.objects.indexOf(this),1);
		}
		this.deleted=true;
		delete(this);
	}
	
}
clean(obj){
	if(obj==this.parent){
		this.parent=null;
		return 0;
	}
	if(this.children.includes(obj)){
		this.children[this.children.indexOf(obj)]=null;
	}
	for(let i=0;i<this.offsets.length;i++){
		var offset=this.offsets[i];
		if(offset.includes(obj)){
			offset[offset.indexOf(obj)]=null;
		}
	}
}
fixTransform(fixed=false){
	
	var parent=this.parent;
	var rotation=parent.rotation*Math.PI/180;
	if(parent){
		for(let i=0;i<this.offsets.length;i++){
				var offset=this.offsets[i];
				var child=offset[1];
				if(child){
						
						var rx=offset[0].x*cos(rotation) - offset[0].y*sin(rotation)
						var ry=offset[0].x*sin(rotation) + offset[0].y*cos(rotation)
						
						child.setPositionUpdate(vec(rx+parent.position.x,ry+parent.position.y),this);
						if(fixed==true){
							child.rotation=parent.rotation+offset[2];
						}
						else{
							child.rotation=parent.rotation;
						}
					

						}

				}
		}
}

fixPosition(){
	var parent=this.parent;
	if(parent){
		for(let i=0;i<this.offsets.length;i++){
				var offset=this.offsets[i];
				var child=offset[1];
				if(child){
						child.setPositionUpdate(addVec(parent.position,offset[0]),this);	

				}
		}
	}
}
fixRotation(){
	var parent=this.parent;
	if(parent){
		for(let i=0;i<this.offsets.length;i++){
				var offset=this.offsets[i];
				var child=offset[1];
				if(child ){
					 child.rotation=parent.rotation+offset[2];	

				}
		}
	}
}
fixPositionRotation(){
	var parent=this.parent;
	if(parent){
		for(let i=0;i<this.offsets.length;i++){
				var offset=this.offsets[i];
				var child=offset[1];
				if(child){
					 child.rotation=parent.rotation+offset[2];	
					 child.setPositionUpdate(addVec(parent.position,offset[0]),this);
				}
		}
	}
}
is_valid(){
	var check=false;

	if(this.parent && this.parent!=null){
	
		for(let i=0;i<this.offsets.length;i++){
			var offset=this.offsets[i];
			var child=offset[1];
			if(child && child!=null){
				 check=true;
				 return check;
			}
			
	}

	}
	else{
	
		return check;
	}

	return check;
}
 update(){
	if(this.parent && this.parent!=null && this.deleted==false){
		if(this.is_valid()==true){
		if(this.type==0){
			this.fixTransform()
		}
		if(this.type==1){
			this.fixTransform(true)
		}
		else if(this.type==2){
				this.fixPosition();
		}
		else if(this.type==3){
			this.fixRotation();
		}
		else if(this.type==4){
			this.fixPositionRotation();
		}
		}
		else{
			this.delete();
		}
	}
	else{
		this.delete();
	}
 }
}
/**
 * function to create a new constraint
 * @function
 * @param {GameObject} parent this is the parent game object
 * @param {Array} children this is an array of the child objects
 * @param {boolean} offset if true, the constraint also restrict the position of the children based on the parent.
* @param {number} type  this is the type of constraint.e.g. 0 for a local transform constraint, 1 for  fixed rotation-transform constraint, 2 for a position constraint, 3 for a rotation constraint, 4 for a position and rotation constraint
* @param {boolean} complete_delete if set to true, the children are deleted when the parent is deleted
 * @returns {constraintObj}
 */
function constraint(parent,children=[],type=0,complete_delete=false){
	 return new constraintObj(parent,children,type,complete_delete)
}
//scene object
/**
 * this is the scene class. scenes can not have same name.
 * @class
 * @global
 */
class scen{
	/**
	 * 
	 * @param {string } name  this is the name of the scene.
	 * @param {canv} canvas  this is the canvas object to which the scene belongs
	 */
	constructor(name, canvas){
		/**
		 * @prop {string } name  this is the name of the scene.
		 */
	this.name=name;
	/**
		 * @prop {Array} backgrounds this is an array of background objects in the scene. 
		 */
	this.backgrounds=[];
	/**
		 * @prop {canv} canvas this is the canvas object to which the scene belongs
		 */
	this.canvas=canvas
	
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
	/**
		 * @prop {Array} constraints  this is an array of constraints in the scene.
	*/
	this.constraints=[];
		/**
		 * @prop {boolean} acitve if set to false, the scene is not updated.
	*/
	this.active=true
	this.deleted=[];
	canvas.addScene(this);
	this.initialize();
}
clean(){
	for(let i=0;i<this.deleted.length;i++){
		this.deleted[i].delete();
	}
	this.deleted=[];
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
 * this function returns the first  game object with the given name, and returns null if no object is found.
 * @function
 * @param {string} name this is the name of the gameObject
 * @memberof scen
 * @returns {null|GameObject} object
 */
	find(name){
		for(let i=0;i<this.objects.length;i++){
			var obj=this.objects[i];
			if(name===obj.name){
				return obj
				break
			}

		};
		return null;
	}
	/** 
	* this function returns the all  game objects with the given name, and returns null if no object is found.
	* @function
	* @param {string} name this is the name of the gameObject
	* @memberof scen
	* @returns {null|GameObject} object
	*/
	   findAll(name){
		   var objs=[]
		   for(let i=0;i<this.objects.length;i++){
			   var obj=this.objects[i];
			   if(name===obj.name){
				   objs.push(obj);
			   }
   
		   };
		   return objs;
	   }
	/**
 * this function deletes all objects from the scene
 * @function
 * @memberof scen
 * @returns {void}
 */
	clear(){
		while(this.backgrounds.length>0){this.backgrounds[this.backgrounds.length-1].delete()};
		while(this.layouts.length>0){this.layouts[this.layouts.length-1].delete()};
		while(this.guiObjects.length>0){this.guiObjects[this.guiObjects.length-1].delete()};
		while(this.polys.length>0){this.polys[this.polys.length-1].delete()};
		while(this.objects.length>0){this.objects[this.objects.length-1].delete()};
		while(this.constraints.length>0){this.constraints[this.constraints.length-1].delete()};

		}
	/**
 * this function assigns the scene parameter to all objects that belong to this scene.
 * @function
 * @memberof scen
 * @returns {void}
 */
	connect(){
	for(let i=0;i<this.backgrounds.length;i++){this.backgrounds[i].scene=this};
	for(let i=0;i<this.layouts.length;i++){this.layouts[i].scene=this};
	for(let i=0;i<this.guiObjects.length;i++){this.guiObjects[i].scene=this};
	for(let i=0;i<this.polys.length;i++){this.polys[i].scene=this};
	for(let i=0;i<this.objects.length;i++){this.objects[i].scene=this};
	for(let i=0;i<this.constraints.length;i++){this.constraints[i].scene=this};
	}
	/**
	 * this function can used to do the any logic required for the scene. It is called during the logic cycle of the game.
	 * @function
	 */
	logic(){}
	/**
	 * this function updates and draws the scene and its objects on every frame.
	 * @function
	 * @memberof scen
	 * @returns {void}
	 */
	update(){
		var ctx=this.canvas.ctx;
		this.logic();
		for(let i=0;i<this.backgrounds.length;i++){
			
			var bg=this.backgrounds[i];
		
			bg.update();
		}
		
		for(let i=0;i<this.objects.length;i++){
			var obj=this.objects[i];
			
			obj.update();
			
		
		}
		for(let i=0;i<this.constraints.length;i++){
			var obj=this.constraints[i];
			
			obj.update();
			
		
		}
		for(let i=0;i<this.polys.length;i++){
			var obj=this.polys[i];
			
			obj.update();
		
			
			
		}
		for(let i=0;i<this.layouts.length;i++){
			var layout=this.layouts[i];
			layout.update();
		}
		this.canvas.event_system.globalFocus();
		for(let i=0;i<this.guiObjects.length;i++){
			var obj=this.guiObjects[i];

			
			obj.update();
			
			
		}
		for(let i=0;i<this.visuals.length;i++){
			var obj=this.visuals[i];
			obj.update();
			
			
		}
		this.canvas.cursor.update();
		
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
	 * this function adds a particle system to the scene.
	 * @function
	 * @param {string} name this is the name of the particle system
	
	 * @memberof scen
	 * @returns {particleSystem}
	 */
	addParticleSystem(name="particleSystem"){
			var p=new particleSystem(this,name);
			this.objects.push(p);
			return  p;
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
		var layout=new layoutObj(this,pos,align);
		this.layouts.push(layout);
		return layout;
	}
	/**
	 * this function adds a background object to the scene.
	 * @function
	 * @param {string|HTMLImageElement} source this is the source of the background.
	 *@param {string} type this is the type of background.e.g color , image
	 *@memberof scen
	 *@returns {bgObj} background
 	 */
	addBg(source="black",type="color"){
		var bg=new bgObj(this,source,type);
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
		var l=new line(this,vec1,vec2,color,width);
		
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
	 * @memberof scen
	 *@returns {rectangle} rectangle
 	 */
	drawRectangle(vec1,width=50,height=50,color="black",fill=true){
		var rect=new rectangle(this,vec1,width,height,color,fill);
		this.polys.push(rect);
		
		return rect;
	}
	/**
	 * this function creates a poly object which draws a point on the screen. this object is stored in the polys array of the scene object.
	 * @function
	 * @param {vec2d} vec1 this is the center position of the point. 
	 * @param {number} radius this is the radius of the point.
	 * @param {color} color this is the color of the point.e.g. black
	 * @param {boolean} fill sets whether the point is to be filled.
	 * @memberof scen
	 *@returns {rectangle} rectangle
 	 */
	drawPoint(vec1,radius=30,color="black",fill=true){
		var c=new circle(vthis,ec1,radius,color,fill);
		
		this.polys.push(c);
		return c;
	}
	/**
	 * this function adds a progress bar object to the scene. this object is placed in the guiObjects Array.
	 * @function
	 * @param {number} val this is the current value of the progress bar.
	 * @param {vec2d} pos this is the position of the progress bar
	 * @memberof scen
	 *@returns {progBar} progressBar
 	 */
	addProgress(val=0,pos=null){
		var prog=new progBar(this,val,pos);
		
		this.guiObjects.push(prog);
		return prog;
	}
	/**
	 * this function adds a gui image to the scene. this object is placed in the guiObjects Array.
	 * @function
	* @param {HTMLImageElement} source this is the source of the guiImage.
	 * @param {vec2d} pos this is the position of the guiImage.
	 * @param {Array} size this is the size of the imageGui.e.g [width,height]
	 * @memberof scen
	 *@returns {imageGui} guiImage
 	 */
	addImageGui(source=null,pos=null,size=[100,100]){
		var img=new imageGui(this,source,pos,size);
	
		this.guiObjects.push(img);
		return img;
	}
	/**
	 * this function adds a gui text label to the scene. this object is placed in the guiObjects Array.
	 * @function
	* @param {string} text this is the text of the label.
	 * @param {vec2d} pos this is the position of the label.
	 * @memberof scen
	 *@returns {label} label
 	 */
	addText(text="",pos=null){
		var textGui=new label(this,text,pos);
		
		this.guiObjects.push(textGui);
		return textGui;
	}
	/**
	 * this function adds a gui button label to the scene. this object is placed in the guiObjects Array.
	 * @function
	* @param {string} text this is the text of the button.
	 * @param {vec2d} pos this is the position of the button.
	 * @param {Array} size  this is the minimum size of the button.e.g. [width,height]
	 * @memberof scen
	 *@returns {buttonGui} button
 	 */
	addButton(text="",pos=null,size=[0,0]){
		var button=new buttonGui(this,text,pos,size);
	
		this.guiObjects.push(button);
		return button;
	}
	/**
	 * this function adds a game object to the scene. this object is placed in the objects Array.
	 * @function
	* @param {string} name this is the name of the gameObject.
	 * @memberof scen
	 *@returns {GameObject} gameObject
 	 */
addGameObject(name=""){
		var obj=new GameObject(this,name);
		
		this.objects.push(obj);
		return obj;
	}
	/**
	 * this function initializes the scene. it also calls the scene reset function. if the current scene is null, this will also set the scene as current.
	 * @function
	 * @memberof scen
	 *@returns {void}
 	 */
	initialize(){
	this.active=true;
	this.reset();
	if(this.canvas.currentScene==null){
		this.canvas.currentScene=this;
	}
	}
	/**
	 * this function initializes the scene and sets it as the current scene.
	 * @function
	 * @memberof scen
	 *@returns {void}
 	 */
	run(){
		this.initialize();
		this.canvas.currentScene=this;
	}
	
}
//backgrounds
/**
 * This is the background object class.
 * @class
 * @global
 */
class bgObj{
	/**
	 * 
	 * @param {scen} scene this is scene that the object belongs to
	 * @param {string|HTMLImageElement} source this is the source color or image of the background.
	 * @param {string} type  this is the type of source to use for the background.e.g "image" or "color".
	 */
	constructor(scene,source="black",type="color"){
	/**
	 * @prop {vec2d} position this is the position of the background
	 */
	this.position=vec(0,0);
	/**
		 * @prop {scen} scene this is the scene the background belongs to.
		 */	
	this.scene=scene;
	/**
	 * @prop {string} type  this is the type of source to use for the background.e.g "image" or "color".
	 */
	this.type=type;
	/**
	 * @prop {string|HTMLImageElement} source this is the source color or image of the background.
	 */
	this.source=source;
	this.deleted=false;
}
/**
	 * this function deletes the background object from the scene at the start of the game cycle
	 * @function
	 * @memberof bgObj
	 * @returns {void}
	 */
delete_later(){
	if(this.scene!=null){
		this.scene.deleted.push(this);
		
	}
	
}
/**
 * this function deletes the background object from the scene immediately
 * @function
 * @memberof bgObj
 * @returns {void}
 */
delete(){
	if(this.scene!=null){
		if(this.scene.backgrounds.includes(this)){
			this.scene.backgrounds.splice(this.scene.backgrounds.indexOf(this),1)
		
		}
		this.deleted=true;
		delete(this);
	}
	
}
	/**
	 * this function updates and draws the background on every frame.
	 * @function
	 * @memberof bgObj
	 * @returns {void}
	 */
	update(){
		if(this.deleted==false){
		var ctx=this.scene.canvas.ctx;
		if(this.type=="color"){
			
			ctx.fillStyle=this.source;
			ctx.fillRect(this.position.x,this.position.y,canvas.width,canvas.height);
		}
		else{
			
			if(this.type=="image"){
	
			ctx.drawImage(this.source,this.position.x,this.position.y,canvas.width,canvas.height);
			}
		}
		}
	}
	
}
//layout object
//backgrounds
/**
 * This is the layout object class.
 * @class
 * @global
 */
class layoutObj{
	/**
	 * 
	 * @param {scen} scene this is scene that the object belongs to
	 * @param {vec2d} pos  this is the position of the layout.
	 * @param {string} align  this is the alignment of the layout.e.g. center,left,right
	 */
	constructor(scene,pos=null,align="center"){
		/**
		 *@prop {string} alignment  this is the alignment of the layout.e.g. center,left,right
		 */
	this.alignment=align;
	/**
	 * 	/**
		 *@prop {boolean} wrap  if true, the layout will try to move objects in a horizontal layout into the next line.
		 */
	this.wrap=true;
	/**
	 * /**
		 *@prop {string} direction  this is the direction of the layout.e.g. vertical, horizontal. When the horizontal direction is set, the center alignment will be ignored.
		 */
	this.direction="vertical";
	/**
		 * @param {number} top  this is the margin at the top of layout
		 */
	this.top=0;
	/**
		 * @prop {string} scene  this is the scene that layout belongs to.
		 */
	this.scene=scene;
/**
		 * @prop {number} bottom  this is the margin at the bottom of layout
		 */
	this.bottom=0;
	/**
		 *@prop {number} left  this is the margin at the left of layout
		 */
	this.left=0;
	/**
		 * @prop {number} right  this is the margin at the right of layout
		 */
	this.right=0;
	/**
		 * @prop {spacing} spacing  this is the spacing of the elements in the layout.
		 */
	this.spacing=30;

	this.prev_h=0;

	this.prev_y=0;
	
	this.init=false;
	if(pos!=null){
        /**
		 * @prop {vec2d} position this is the position of the layout
		 * @memberof layoutObj
		 */
		this.position=pos;
	}
	else{
	this.position=vec(0,0);
	}
	/**
		 * @prop {number} width  this is the width of the layout
		 */
	this.width=canvas.width;
	/**
		 * @prop {number} height  this is the height of the layout
		 */
	this.height=canvas.height;
	/**
		 * @prop {Array} objects this is an array of the objects in the layout.
		 */
	this.objects=[];
	this.deleted=false;
}
   /**
	 * this function deletes the layout object from the scene at the start of the game cycle
	 * @function
	 * @memberof layoutObj
	 * @returns {void}
	 */
	delete_later(){
		if(this.scene!=null){
			this.scene.deleted.push(this);
			
		}
		
	}
	/**
	 * this function deletes the layout object from the scene immediately
	 * @function
	 * @memberof layoutObj
	 * @returns {void}
	 */
	delete(){
		if(this.scene!=null){
			if(this.scene.layouts.includes(this)){
				this.scene.layouts.splice(this.scene.layouts.indexOf(this),1);
			}
			this.deleted=true;
		    delete(this);
		}
		
	}
	
	/**
	 * this function updates and draws the layout on every frame.
	 * @function
	 * @memberof layoutObj
	 * @returns {void}
	 */
	update(){
		if(this.deleted==false){
		if(this.direction=="vertical"){
		var total_h=0;
		for (let i=0;i<this.objects.length;i++){
			var obj=this.objects[i];
			var size=null;

			if(obj.id=="label"){
				size=obj.getSize(true);
			
			}
			else{
				size=obj.getSize();
			}
			total_h+=size[1]+this.spacing;
			
		}
		
		var y0=0;
		if(canvas.height<total_h){
			y0=this.position.y+this.top;
		}
		else{
			y0=this.position.y+canvas.height/2-total_h/2;
		}
		for (let i=0;i<this.objects.length;i++){
			var obj=this.objects[i];
			var size=null;
			if(obj.id=="label"){
				size=obj.getSize(true);
			
			}
			else{
				size=obj.getSize();
			}
			var width=size[0];
			var height=size[1];
			
			var x=this.position.x+this.width/2-width/2;
			if(this.alignment=="left"){
				var x=this.position.x+this.left;
			}
			else if(this.alignment=="right"){
				
				var x=this.position.x+this.width-width-this.right;
			}
			
			var y=y0;
			y0+=height+this.spacing;
			
			obj.position.x=x
			obj.position.y=y;
			
			
			
		}
		}
		else{
		
		
		var x0=this.position.x+this.left;
		if(this.alignment=="right"){
			x0=this.position.x+this.width-this.right;
		}
		var y0=this.position.y;
		var prev_height=0;
		var wrapping=false;
	
		
		for (let i=0;i<this.objects.length;i++){
			var obj=this.objects[i];
			var size=null;
			if(obj.id=="label"){
				size=obj.getSize(true);
			
			}
			else{
				size=obj.getSize();
			}
			var width=size[0];
			var height=size[1];
			
			var x=x0;
			
			if(this.alignment=="right"){
				x-=width;
			}
			var y=0;
			if(wrapping==false){
				y=y0+this.top;

			}
			else{
			
				y=y0;
			}
			if(obj.id=="label"){
				
				y+=height;
			}
		
			
			if(this.wrap==true){
				if(x>this.width){
				
					x0=this.position.x+this.left;
				
					x=x0
				
					y0=prev_height+this.spacing;
					
					y=y0;
					if(obj.id=="label"){
					 y+=height;
					}
					wrapping=true;
				}
				else if(this.alignment=="right" && x+width<0){
				
					x0=this.position.x+this.width-this.right;
			
					x=x0
			
					x-=width;
					
					y0=prev_height+this.spacing;
					
					y=y0;
					if(obj.id=="label"){
					 y+=height;
					}
					wrapping=true;
				}
				
			}
			
			if(this.alignment=="right"){
				x0-=width+this.spacing;	
			
				
			}
			else{
				x0+=width+this.spacing;
			}
			
			obj.position.x=x
			obj.position.y=y;
			prev_height=height;
		
			
		}

		}
		}
	}
	/**
	 * this function sets the margins of the layout
	 * @function
	 * @memberof layoutObj
	 * @param {number} top this is the top margin of the layout.
	 * @param {number} bottom   this is the bottom margin of the layout.
	 * @param {number} left   this is the left margin of the layout.
	 * @param {number} right   this is the right margin of the layout.
	 */
	setMargins(top,bottom,left,right){
		this.top=top;
		this.bottom=bottom;
		this.left=left;
		this.right=right;

	}
	/**
	 * this function adds an object to the layout
	 * @function
	 * @memberof layoutObj
	 * @param {Object} obj this is the gui object added to the layout
	 */
	addObject(obj){
		if(this.objects.includes(obj)==false){
			this.objects.push(obj);
		}
		
	}

}
//gui objects
/**
 * This is the object class for labels.
 * @class
 * @global
 */
class label{
	/**
	 * @param {scen} scene this is scene that the object belongs to
	 * @param {string} text this is the text for the label
	 * @param {vec2d} pos this is the position of the label
	 * @param {number} size this is the size of the label
	 */
	constructor (scene,text="",pos=null,size=15){
	/**
	 * @prop {string} text this is the text for the label
	 */
	this.text=text;
	/**
	 * @prop {string} type this is the type of fill style for the label.e.g. fill.
	 */
	this.type="fill"
	/**
	 * @prop {number} size this is the font size for the label
	 */
	this.size=size;
	/**
	 * @prop {string} font this is the font for the label.e.g. Arial
	 */
	this.font="Verdana";
	/**
	 * @prop {string} color this is the color for the label.e.g red
	 */
	this.color="white";
	/**
	 * @prop {scen} scene this is the scene the label belongs to.
	 */
	this.scene=scene;
	/**
	 * @prop {id} id this is the gui id of the label.e.g. label
	 */
	this.id="label";
	/**
	 * @prop {number} rotation this is the rotation of the label
	 */
	this.rotation=0;
	if(pos==null){
		/**
	 * @prop {vec2d} position this is the position of the label
	 */
		this.position=vec(canvas.width/2,canvas.height/2);
	}
	else{
		this.position=pos;
	}
	this.deleted=false;
}

	transform(){
		var ctx=this.scene.canvas.ctx;
		ctx.translate(this.position.x,this.position.y);
		ctx.rotate(this.rotation);
	}
	 /**
	 * this function deletes the label object from the scene at the start of the game cycle
	 * @function
	 * @memberof label
	 * @returns {void}
	 */
	 delete_later(){
		if(this.scene!=null){
			this.scene.deleted.push(this);
			
		}
		
	}
	/**
	 * this function deletes the label object from the scene immediately
	 * @function
	 * @memberof label
	 * @returns {void}
	 */
	delete(){
		if(this.scene!=null){
			if(this.scene.guiObjects.includes(this)){
				this.scene.guiObjects.splice(this.scene.guiObjects.indexOf(this),1);
			}
			this.deleted=true;
		    delete(this);
		}
		
	}
	/**
	 * this function returns the size of the label text.
	 * @function
	 * @param {boolean} return_array  if true, functions returns only the size as an array.e.g [width,height], otherwise the function returns an object with text metrics.e.g. object.width
	 * @memberof label
	 * @returns {number} size
	 */
	getSize(return_array=false){
		var ctx=this.scene.canvas.ctx;
		ctx.font=this.getFont();
		var size=ctx.measureText(this.text);
		if(return_array==true){
			
		    return [size.width,size.actualBoundingBoxAscent + size.actualBoundingBoxDescent];
		}
		else{
			return size;
		}
		
	}
	
	getFont(){
		var font=""+this.size+"px "+this.font;
		return font;
	}
	/**
	 * this function sets the style for the label
	 * @function
	 * @param {string} font this is the font for the label
	 * @param {number} size this is the font size for the label
	 * @param {string} type this is the fill type for the label.e.g "fill" or "stroke"
	 * @memberof label
	 * @returns {void}
	 */
	setStyle(font,size=15,type="fill"){
		this.type=type;
		this.size=size;
		this.font=font;
	}
	/**
	 * this function updates and draws the label on every frame.
	 * @function
	 * @memberof label
	 * @returns {void}
	 */
	update(){
		if(this.deleted==false){
		var ctx=this.scene.canvas.ctx;
		ctx.beginPath();
		
		if(this.type=="stroke"){
		ctx.strokeStyle=this.color;
		ctx.font=""+this.size+"px "+this.font;
		ctx.strokeText(this.text,this.position.x,this.position.y);
		ctx.stroke();
		}
		else{
		if(this.type=="fill"){
		ctx.fillStyle=this.color;	
		ctx.font=""+this.size+"px "+this.font;
		ctx.fillText(this.text,this.position.x,this.position.y);
		ctx.fill();
			
		}	
			
		}
		ctx.closePath();
		}
	}
}
//button Gui
/**
 * This is the gui button class.
 * @class
 * @global
 */
class buttonGui{
	/**
	 * @param {scen} scene this is scene that the object belongs to
	 * @param {string} text this is the button text
	 * @param {vec2d} pos  this is the button position
	 * @param {Array} size  this is the minimum size of the button.e.g. [width,height]
	 */
	constructor (scene,text="",pos=null,size=[0,0]){
	/**
		 * @prop {label} label this is the label gui object for the button
		 */	
	this.label=new label(scene,text);
	/**
		 * @prop {string} tcolor this is the text color of the button when inactive.
		 */	
	this.tcolor="white";
	/**
		 * @prop {scen} scene this is the scene the button belongs to.
		 */	
	this.scene=scene;
	/**
		 * @prop {string} tcolor2 this is the text color of the button when active.
		 */	
	this.tcolor2="white";
	/**
		 * @prop {number} padding this is the padding of the button
		 */	
	this.padding=10;
	/**
		 * @prop {number} minWidth this is the minimum width of the button
		 */	
	this.minWidth=size[0];
	/**
		 * @prop {number} minHeight this is the minimum height of the button
		 */	
	this.minHeight=size[1];
	/**
		 * @prop {vec2d} position this is the position of the button
		 */	
	this.position=null;
	/**
		 * @prop {string} color this is the color of the button when inactive.
		 */	
	this.color="red";
	/**
		 * @prop {string} color2 this is the color of the button when active.
		 */	
	this.color2="green";
	/**
		 * @prop {HTMLImageElement} image1 this is the image of the button when inactive.
		 */	
	this.image1=null;
	/**
		 * @prop {HTMLImageElement} image2 this is the image of the button when active.
		 */	
	this.image2=null;
	
	this.img=false;

	this.img2=false;
	/**
		 * @prop {string} id this is the gui id of the button.e.g "button"
		 */	
	this.id="button";
	/**
		 * @prop {boolean} active if true, the button is active.
		 */	
	this.active=false;
	/**
		 * @prop {number} rotation this is the rotation of the button
		 */	
	this.rotation=0;
	/**
		 * @prop {boolean} enabled this property enables the button for mouse events
		 */	
	this.enabled=true;
	if(pos==null){
		
		this.position=vec(canvas.width/2,canvas.height/2);
	}
	else{
		this.position=pos;
	}

	this.deleted=false;
}

	transform(){
		
	}
	 /**
	 * this function deletes the buttonGui object from the scene at the start of the game cycle
	 * @function
	 * @memberof buttonGui
	 * @returns {void}
	 */
	 delete_later(){
		if(this.scene!=null){
			this.scene.deleted.push(this);
			
		}
		
	}
	/**
	 * this function deletes the buttonGui object from the scene immediately
	 * @function
	 * @memberof buttonGui
	 * @returns {void}
	 */
	delete(){
		if(this.scene!=null){
			if(this.scene.guiObjects.includes(this)){
				this.scene.guiObjects.splice(this.scene.guiObjects.indexOf(this),1)
			}
			this.deleted=true;
		    delete(this);
		}
		
	}
	/**
	 * functions is used to draw the button when active.
	 * @function
	 * @memberof buttonGui
	 * @returns {void}
	 */
	active_draw(){
		var ctx=this.scene.canvas.ctx;
		ctx.beginPath();
		this.label.color=this.tcolor2;
		var size=this.getSize();;
		ctx.fillStyle=this.color2;
		if(this.img2==false){
		ctx.fillRect(this.position.x,this.position.y,size[0],size[1]);
		}
		else{
		ctx.drawImage(this.image2,this.position.x,this.position.y,size[0],size[1]);
		}
		ctx.closePath();
	}
	/**
	 * this function sets the minimum size  of the button.
	 * @function
	 * @param {number} width this is the  minimum width of the button
	 * @param {number} height this is the minimum height of the button
	 * @memberof buttonGui
	 * @returns {void}
	 */
	setMinimumSize(width,height){
		this.minWidth=width;
		this.minHeight=height;
	}
	/**
	 * this function sets the active and inactive text color of the button.
	 * @function
	 * @param {string} color1 this is the  color of the button text when not active
	 * @param {string} color2 this is the color of the button text when active
	 * @memberof buttonGui
	 * @returns {void}
	 */
	setTextColor(color,color2="black"){
		this.tcolor=color;
		this.tcolor2=color2;
	}
	/**
	 * this function sets the active and inactive images of the button.
	 * @function
	 * @param {HTMLImageElement} img this is the inactive image of the button
	 * @param {HTMLImageElement} img2 this is the active image of the button
	 * @memberof buttonGui
	 * @returns {void}
	 */
	setImages(img,img2=null){
		this.img=true;
		if(img2!=null){
			this.image2=img2;
			this.img2=true;
		}
		this.image1=img;
	}
	/**
	 * this is function called when the mouse hovers over the button
	 * @function
	 * @memberof buttonGui
	 */
	hover(){
		//what the button should 
		alert("mouse hover this button: "+this.label.text);
		}
	/**
	 * this is function called when the button is clicked. this is can be overriden to execute game logic.
	 * @function
	 * @memberof buttonGui
	 */
	action(){
	//what the button should 
	alert("clicked this button: "+this.label.text);
	}
	/**
	 * this function returns the size of the button including the padding.
	 * @function
	 * @memberof buttonGui
	 * @returns {Array} [width,height]
	 */
	getSize(){
		var ctx=this.scene.canvas.ctx;
		ctx.font=this.label.getFont();
		var size=ctx.measureText(this.label.text);
	
		var width=size.width+this.padding*2;
		if(this.minWidth>width){
			width=this.minWidth
		};
		var height=this.label.size+this.padding*2;
		if(this.minHeight>height){
			height=this.minHeight;
		};
		return [width,height];
	}
	/**
	 * functions is used to draw the button when inactive.
	 * @function
	 * @memberof buttonGui
	 * @returns {void}
	 */
	inactive_draw(){
		var ctx=this.scene.canvas.ctx;
		ctx.beginPath();
		this.label.color=this.tcolor;
		var size=this.getSize();
		ctx.fillStyle=this.color;
		
		if(this.img==false){
		ctx.fillRect(this.position.x,this.position.y,size[0],size[1]);
		}
		else{
		ctx.drawImage(this.image1,this.position.x,this.position.y,size[0],size[1]);
		}
		ctx.closePath();
	}
	/**
	 * this function updates and draws the button on every frame.
	 * @function
	 * @memberof buttonGui
	 * @returns {void}
	 */
	update(){
		if(this.deleted==false){
		if(this.active==false){
			this.inactive_draw();
		}
		else{
			this.active_draw();
		}
		
		this.label.position.x=this.position.x;
		this.label.position.y=this.position.y;
		var size=this.getSize();
		var tsize=this.label.getSize(true);
		
		this.label.position.x+=(size[0]-tsize[0])/2;
		this.label.position.y+=(size[1]-tsize[1])/2+tsize[1];
		this.label.update();
		}
	}
}
//ui image
/**
 * this is the progress bar object class
 * @class
 * @global
 */
class progBar{
	/**
	 * @param {scen} scene this is scene that the object belongs to
	 * @param {number} val this is the current value of the progress bar.this is the fraction of the total.
	 * @param {vec2d} pos  this is the position of the progress bar.
	 */
	constructor(scene,val=0,pos=null){
		/**
		 * @prop {string} color this is the color of the fill of the progress bar
		 */
	this.color="blue";
	/**
		 * @prop {string} color2 this is the color of the track of the progress bar
		 */
	this.color2="green";
	/**
		 * @prop {number} width this is the width of the progress bar
		 */
	this.width=100;
	/**
		 * @prop {number} height this is the height of the progress bar
		 */
	this.height=30;
	/**
		 * @prop {number} progress this is the current value of the progress bar. this is the fraction of the total.
		 */
	this.progress=val;
	/**
		 * @prop {scen} scene this is the scene that the progress bar belongs to.
		 */
	this.scene=scene;
	if(pos==null){
		/**
		 * @prop {string} color this is the color of the fill of the progress bar
		 */
		this.position=vec(canvas.width/2,canvas.height/2);
	}
	else{
		this.position=pos;
	}
	this.deleted=false;
}

	setValue(val){
	/**
		 * @prop {string} color this is the color of the fill of the progress bar
		 */
	this.progress=val;
	
	}
	/**
	 * this function sets the color of the  progress bar
	 * @param {number} color this is the top color of the progress bar
	 * @param {number} color2 this is the  bottom color of the progress bar
	 * @function
	 * @memberof progBar
	 * @returns {void}
	 */
	setColors(color ,color2){
		this.color=color;
		this.color2=color2;
	}
	/**
	 * this function sets the size of the  progress bar
	 * @param {number} width this is the width of the progress bar
	 * @param {number} height this is the height of the progress bar
	 * @function
	 * @memberof progBar
	 * @returns {void}
	 */
	setSize(width,height){
		this.width=width;
		this.height=height;
	}
		/**
 /**
	 * this function deletes the progBar object from the scene at the start of the game cycle
	 * @function
	 * @memberof progBar
	 * @returns {void}
	 */
 delete_later(){
	if(this.scene!=null){
		this.scene.deleted.push(this);
		
	}
	
}
/**
 * this function deletes the progBar object from the scene immediately
 * @function
 * @memberof progBar
 * @returns {void}
 */
delete(){
	if(this.scene!=null){
		if(this.scene.guiObjects.includes(this)){
			this.scene.guiObjects.splice(this.scene.guiObjects.indexOf(this),1)
		}
		this.deleted=true;
		delete(this);
	}
	
}
	/**
	 * this function updates and draws the progBar on every frame.
	 * @function
	 * @memberof progBar
	 * @returns {void}
	 */
	update(){
		if(this.deleted==false){
		var ctx=this.scene.canvas.ctx;
		ctx.beginPath();
		
		ctx.fillStyle=this.color2;
		ctx.fillRect(this.position.x,this.position.y,this.width,this.height);
		ctx.fillStyle=this.color;
		var val=this.progress;
		
		if(val>1){
			val=1;
			
		}
		if(val<0){
			val=0;
			
		}
		ctx.fillRect(this.position.x,this.position.y,this.width*val,this.height);
		ctx.fill();
		ctx.closePath();
		}
	}
}
/**
 * this is cursor object class.
*@class
*@global
 */
class curObj{
	/**
	 * @param {canv} canvas this is the canvas object to which the cursor belongs
	 * @param {HTMLImageElement} source this is image of the cursor 
	 * @param {vec2d} pos  this is the position of the cursor 
	 
	 */
	constructor(canvas,source=null,pos=null){
			/**
		 * @prop {canv} canvas this is the canvas object to which the cursor belongs
		 */
	this.canvas=canvas;
		/**
		 * @prop {HTMLImageElement} source this is image of the cursor 
		 */
	this.source=source;
	/**
	 * @prop {boolean} visible if true, the cursor is visible
	 */
	this.visible=false;

	/**
	 * @prop {number} width this is the width of the cursor
	 */
	this.width=50;
	/**
	 * @prop {number} height this is the height of the cursor
	 */
	this.height=50;
	
}
   /**
	* this function sets the image of the cursor
	* @param {HTMLImageElement} source  this is the image of the cursor
	* @param {Array} size  this is the size of the cursor.e.g [width, height]
	*@function 
	*@memberof curObj
	*@returns {void}
	*/
	setImage(source,size=[50,50]){
		this.source=source;
		this.width=size[0];
		this.height=size[1];
		this.visible=true;

	}
	/**
	 * this function hides default cursor
	 * @function
	 * @memberof curObj
	 * @returns {void}
	 */
	hideDefault(){
		canvas.element.style.cursor="none";
	}
	/**
	 * this function updates and draws the curObj on every frame.
	 * @function
	 * @memberof curObj
	 * @returns {void}
	 */
	update(){
		
		if(this.visible==true){
			
			if(this.source!=null){
				this.hideDefault()
				var ctx=this.canvas.ctx;
				
				ctx.drawImage(this.source,this.canvas.event_system.mouseObj.position.x-this.width/2,this.canvas.event_system.mouseObj.position.y-this.height/2,this.width,this.height);
		
			}
	
		}		
	}
}
/**
 * this is the imageGui object class.
 * @class
 * @global
 */
class imageGui{
	/**
	 * @param {scen} scene this is scene that the object belongs to
	 * @param {HTMLImageElement} source this is the source image of the imageGui to be rendered when inactive
	 * @param {vec2d} pos this is the position of the imageGui
	 * @param {Array} size this is the size of the imageGui.e.g [width,height]
	 */
	constructor (scene,source=null,pos=null,size=[100,100]){
	/**
	 * @prop {vec2d} position this is the position of the imageGui
	 */
	this.position=null;
	/**
	 * @prop {HTMLImageElement} image1 this is the source image of the imageGui to be rendered when inactive
	 */
	this.image1=source;
	/**
	 * @prop {scen} scene this is the scene that the imageGui belongs to.
	 */
	this.scene=scene;
	/**
	 * @prop {HTMLImageElement} image2 this is the source image of the imageGui to be rendered when inactive
	 */
	this.image2=null;
	/**
	 * @prop {number} width this is the width of the imageGui
	 */
	this.width=size[0];
	/**
	 * @prop {number} height this is the height of the imageGui
	 */
	this.height=size[1];
	
	this.img=true;
	
	this.img2=false;
	
	this.dynamic=false;
	/**
	 * @prop {string} id this is the id of the imageGui
	 */
	this.id="imageGui";
	/**
	 * @prop {boolean} active if true, then the imageGui is active.
	 */
	this.active=false;
	/**
	 * @prop {boolean} enabled if true, then the imageGui is clickable.
	 */
	this.enabled=false;
	/**
	 * @prop {number} rotation this is the rotation of the imageGui
	 */
	this.rotation=0;
	if(pos==null){
		this.position=vec(canvas.width/2,canvas.height/2);
	}
	else{
		this.position=pos;
	}
	this.deleted=false;
}

	transform(){
		var ctx=this.scene.canvas.ctx;
		ctx.translate(this.position.x,this.position.y);
		ctx.rotate(this.rotation);
	}
 /**
	 * this function deletes the imageGui object from the scene at the start of the game cycle
	 * @function
	 * @memberof imageGui
	 * @returns {void}
	 */
 delete_later(){
	if(this.scene!=null){
		this.scene.deleted.push(this);
		
	}
	
}
/**
 * this function deletes the imageGui object from the scene immediately
 * @function
 * @memberof imageGui
 * @returns {void}
 */
delete(){
	if(this.scene!=null){
		if(this.scene.guiObjects.includes(this)){
			this.scene.guiObjects.splice(this.scene.guiObjects.indexOf(this),1)
		}
		this.deleted=true;
		delete(this);
	}
	
}
	/**
	 * this function is used to draw the imageGui when active
	 * @function
	 * @memberof imageGui
	 * @returns {void}
	 */
	active_draw(){
		var ctx=this.scene.canvas.ctx;
		ctx.beginPath();
		ctx.fillStyle="black";
		if(this.dynamic==true){
		if(this.img2==false){
		ctx.fillRect(this.position.x,this.position.y,this.width,this.height);
		}
		else{
		ctx.drawImage(this.image2,this.position.x,this.position.y,this.width,this.height);
		}
		}
		ctx.closePath();
	}
	/**
	 * this function sets the images of the imageGui
	 * @function
	 * @memberof imageGui
	 * @param {HTMLImageElement} img this the image showed by the imageGui when inactive.
	 * @param {HTMLImageElement} img2 this the image showed by the imageGui when active.
	 * @returns {void}
	 */
	setImages(img,img2=null){
		this.img=true;
		if(img2!=null){
			this.image2=img2;
			this.img2=true;
		}
		this.image1=img;
	}
		/**
	 * this is function called when the mouse hovers over the imageGui
	 * @function
	 * @memberof buttonGui
	 */
		hover(){
			//what the button should 
			alert("mouse hovered over image");
			}
	/**
	 * this is function called when the imageGui is clicked. this is can be overriden to execute game logic.
	 * @function
	 * @memberof imageGui
	 */
	action(){
	//what the button should 
	if(this.click==true){
	alert("Image clicked");
	}
	}
	/**
	 * this function returns the size of the imageGui
	 * @function
	 * @memberof imageGui
	 * @returns {Array} [width,height]
	 */
	getSize(){
		var width=this.width;
		var height=this.height;
		
		return [width,height];
	}
	/**
	 * this function is used to draw the imageGui when inactive
	 * @function
	 * @memberof imageGui
	 * @returns {void}
	 */
	inactive_draw(){
		var ctx=this.scene.canvas.ctx;
		ctx.beginPath();
	
		ctx.drawImage(this.image1,this.position.x,this.position.y,this.width,this.height);
		
		ctx.closePath();
	}
	/**
	 * this function updates and draws the imageGui on every frame.
	 * @function
	 * @memberof imageGui
	 * @returns {void}
	 */
	update(){
		if(this.deleted==false){
		if(this.active==false){
			this.inactive_draw();
		}
		else{
			this.active_draw();
		}
		}
		
	}
}
//polys
/**
 * this is poly line class object
 * @class
 * @global
 */
class line{
	/**
	 * @param {scen} scene this is scene that the object belongs to
	 * @param {vec2d} vec1 this is the start point of the line
	 * @param {vec2d} vec2  this is the end point of the line
	 * @param {string} color this is the color of the line
	 * @param {number} thickness this is the width of the line
	 */
	constructor(scene,vec1,vec2,color="red",thickness=1){
	/**
	 * @prop {scen} scene this is the scene the poly line belongs to.
	 */
	this.scene=scene;
	/**
	 * @prop {vec2d} origin this is the start point of the line
	 */
	this.origin=vec1;
	/**
	 * @prop {vec2d} target  this is the end point of the line
	 */
	this.target=vec2; 
	/**
	 * @prop {string} color this is the color of the line
	 */
	this.color=color;
	/**
	 * @prop {number} thickness this is the width of the line
	 */
	this.width=thickness;
	/**
	 * @prop {number} rotation this is the rotation of the line
	 */
	this.rotation=0;
	/**
	 * @prop {boolean} visible if true, then the polyline is visible.
	 */
	this.visible=true;
	this.deleted=false;
}

	pre_transform(){
		var ctx=this.scene.canvas.ctx;
		ctx.save();
	
		
	}
	transform(){
		
		var ctx=this.scene.canvas.ctx;
		ctx.translate((this.origin.x),(this.origin.y));
		ctx.rotate(this.rotation*Math.PI/180);
		ctx.translate(-(this.origin.x),-(this.origin.y));
		
		
	}
	post_transform(){
		var ctx=this.scene.canvas.ctx;
		ctx.restore();
		
		
	}
 /**
	 * this function deletes the line object from the scene at the start of the game cycle
	 * @function
	 * @memberof line
	 * @returns {void}
	 */
 delete_later(){
	if(this.scene!=null){
		this.scene.deleted.push(this);
		
	}
	
}
/**
 * this function deletes the line object from the scene immediately
 * @function
 * @memberof line
 * @returns {void}
 */
delete(){
	if(this.scene!=null){
		if(this.scene.polys.includes(this)){
			this.scene.polys.splice(this.scene.polys.indexOf(this),1)
		}
		this.deleted=true;
		delete(this);
	}
	
}
	/**
	 * this function updates and draws the poly line  on every frame.
	 * @function
	 * @memberof line
	 * @returns {void}
	 */
	update(){
		
		if(this.visible==true && this.deleted==false){
		
		var ctx=this.scene.canvas.ctx;
		ctx.beginPath();
		ctx.strokeStyle=this.color;
		ctx.lineWidth=this.width;
		ctx.moveTo(this.origin.x,this.origin.y);
		ctx.lineTo(this.target.x,this.target.y);
		ctx.stroke();
		ctx.closePath();
		}
	}
}
/**
 * this is the poly circle object class.
 * @class
 * @global
 */
class circle{
	/**
	 * @param {scen} scene this is scene that the object belongs to
	 * @param {vec2d} pos this is the center of the circle.
	 * @param {number} radius this is the radius of the circle.
	 * @param {string} color this is the color of the circle.e.g "white"
	 * @param {boolean} fill if true, the circle is filled with color.
	 */
	constructor(scene,pos=null,radius=30,color="white",fill=true){
	/**
	 * @prop {scen} scene this is the scene that the poly circle belongs to.
	 */
	this.scene=scene;
	/**
	 * @prop {vec2d} position this is the center of the circle.
	 */
	this.position=null
	if(pos!=null){
		this.position=pos;
	}
	else{
		this.position=vec(0,0);
	}
	/**
	 * @prop {number} radius this is the radius of the circle.
	 */
	this.radius=radius;
	/**
	 * @prop {number} lineWidth this is the line width of the stroke of the circle.
	 */
	this.lineWidth=1;
	/**
	 * @prop {string} color this is the color of the circle.e.g "white"
	 */
	this.color=color;
	/**
	 * @prop  {boolean} fill if true, the circle is filled with color.
	 */
	this.fill=fill;
	/**
	 * @prop {number} rotation this is the rotation of the circle.
	 */
	this.rotation=0;
	/**
	 * @prop {boolean} visible if true, then the poly circle is visible. 
	 */
	this.visible=true;
	this.deleted=false;
}

	pre_transform(){
		var ctx=this.scene.canvas.ctx;
		ctx.save();
	
		
	}
	transform(){
		
		var ctx=this.scene.canvas.ctx;
		ctx.translate((this.position.x+this.radius/2),(this.position.y+this.radius/2));
		ctx.rotate(this.rotation*Math.PI/180);
		ctx.translate(-(this.position.x+this.radius/2),-(this.position.y+this.radius/2));
		
		
	}
	post_transform(){
		var ctx=this.scene.canvas.ctx;
		ctx.restore();
		
		
	}
	 /**
	 * this function deletes the poly circle object from the scene at the start of the game cycle
	 * @function
	 * @memberof circle
	 * @returns {void}
	 */
	 delete_later(){
		if(this.scene!=null){
			this.scene.deleted.push(this);
			
		}
		
	}
	/**
	 * this function deletes the poly circle object from the scene immediately
	 * @function
	 * @memberof circle
	 * @returns {void}
	 */
	delete(){
		if(this.scene!=null){
			if(this.scene.polys.includes(this)){
				this.scene.polys.splice(this.scene.polys.indexOf(this),1)
			}
			this.deleted=true;
		    delete(this);
		}
		
	}
	/**
	 * this function updates and draws the poly circle  on every frame.
	 * @function
	 * @memberof circle
	 * @returns {void}
	 */
	update(){
		if(this.visible==true && this.deleted==false){
		var ctx=this.scene.canvas.ctx;
		ctx.beginPath();
		if(this.fill==true){
		ctx.fillStyle=this.color;
		ctx.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2,true);
		ctx.fill();
		}else{
		ctx.strokeStyle=this.color;
		ctx.lineWidth=this.lineWidth;
		ctx.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2,true);
		ctx.stroke();
		}
		ctx.closePath();
		}
	}
}
//cartesian line render
/**
 * this is a line using the slope and constant
 * @function
 * @param {Object} line_obj this is an object containing the defintion of the line.e.g line_obj.c for constant, line_obj.m for gradient
 * @param {number} xlower this is the start range for the line.
 * @param {number} xupper this is end range for the line.
 * @returns {line} line object
 */
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
/**
 * this is the rectangle object class
 * @class
 * @global
 */
class rectangle{
	/**
	 * 
	 * @param {scen} scene this is scene that the object belongs to
	 * @param {vec2d} pos this is center of the rectangle
	 * @param {number} width this is the width of the rectangle
	 * @param {number} height this is the height of the rectangle
	 * @param {string} color this is the color of the rectange.e.g "black"
	 * @param {boolean} fill if true, the rectangle is filled with color.
	 */
	constructor(scene,pos=null,width=50,height=50,color="black",fill=true){
	/**
	 * @prop {scen} scene this is the scene that the rectangle belongs to.
	 */
	this.scene=scene;
	/**
	 * @prop {vec2d} position this is center of the rectangle
	 */
	this.position=null
	
	if(pos!=null){
		this.position=pos;
	}
	else{
		this.position=vec(0,0);
	}
	/**
	 * @prop {number} width this is the width of the rectangle.
	 */
	this.width=width;
	/**
	 * @prop {number} height this is the height of the rectangle.
	 */
	this.height=height;
	/**
	 *@prop  {number} lineWidth this is the lineWidth of the stroke of the rectangle
	 */
	this.lineWidth=1;
	/**
	 * @prop {string} color this is the color of the rectange.e.g "black"
	 */
	this.color=color;
	/**
	 * @prop {HTMLImageElement} source this is the source image of the rectangle to be rendered.
	 */
	this.source=null;
	/**
	 * @prop {boolean} img if true, the rectangle is rendered as an image.
	 */
	this.img=false;
	/**
	 * @prop {boolean} fill if true, the rectangle is filled with color.
	 */
	this.fill=fill;
	/**
	 * @prop {boolean} visible if true, the rectangle is visible.
	 */
	this.visible=true;
	/**
	 * @prop {number} rotation this is the rotation of the rectangle.
	 */
	this.rotation=0;
	this.deleted=false;
}

	pre_transform(){
		var ctx=this.scene.canvas.ctx;
		ctx.save();
	
		
	}
	transform(){
		
		var ctx=this.scene.canvas.ctx;
		ctx.translate((this.position.x+this.width/2),(this.position.y+this.height/2));
		ctx.rotate(this.rotation*Math.PI/180);
		ctx.translate(-(this.position.x+this.width/2),-(this.position.y+this.height/2));
		
		
	}
	post_transform(){
		var ctx=this.scene.canvas.ctx;
		ctx.restore();
		
		
	}
 /**
	 * this function deletes the rectangle object from the scene at the start of the game cycle
	 * @function
	 * @memberof rectangle
	 * @returns {void}
	 */
 delete_later(){
	if(this.scene!=null){
		this.scene.deleted.push(this);
		
	}
	
}
/**
 * this function deletes the rectangle object from the scene immediately
 * @function
 * @memberof rectangle
 * @returns {void}
 */
delete(){
	if(this.scene!=null){
		if(this.scene.polys.includes(this)){
			this.scene.polys.splice(this.scene.polys.indexOf(this),1)
		}
		this.deleted=true;
		delete(this);
	}
	
}
	/**
	 * this function sets the size of the rectangle.
	 * @param {number} width this is the width of the rectangle
	 * @param {number} height this is the height of the rectangle
	 * @function
	 * @memberof rectangle
	 * @returns {void}
	 */
	setSize(width,height){
		this.width=width;
		this.height=height;
	}
	/**
	 * this function sets the color of the rectangle.
	 * @param {string} color this is the color of the rectangle
	 * @function
	 * @memberof rectangle
	 * @returns {void}
	 */
	setColor(color){
		this.color=color;
		
		this.img=false;
	}
	/**
	 * this function sets the source image of the rectangle.
	 * @param {HTMLImageElement} source this is the source image of the rectangle
	 * @function
	 * @memberof rectangle
	 * @returns {void}
	 */
	setImage(source){
		this.source=source;
		this.img=true;
	}
	/**
	 * this function updates and draws the poly rectangle  on every frame.
	 * @function
	 * @memberof rectangle
	 * @returns {void}
	 */
	update(){
		
		if(this.visible==true && this.deleted==false){
		var ctx=this.scene.canvas.ctx;
		ctx.beginPath();
		if(this.img==false){
		if(this.fill==true){
		ctx.fillStyle=this.color;

		ctx.fillRect(this.position.x-this.width/2,this.position.y-this.height/2,this.width,this.height);
		ctx.stroke();
		ctx.fill();
		}else{
		ctx.strokeStyle=this.color;
		ctx.lineWidth=this.lineWidth;
		ctx.strokeRect(this.position.x-this.width/2,this.position.y-this.height/2,this.width,this.height);
		ctx.stroke();
		}
		}
		else{
		ctx.drawImage(this.source,this.position.x-this.width/2,this.position.y-this.height/2,this.width,this.height);
		}
		ctx.closePath();
	}
	}
}
//system functions
/**
 * this function returns the center of the canvas as a vector. if not set the function will use the default canvas constant
 * @function
 * @param {canv} canvas this is the current canvas object 
 * @returns {vec2d} center
 */
function center(canvas_object=null){
	var c=null;
	if(canvas_object==null){
		c=canvas;
	}
	else{
		c=canvas_object
	}
	
	var v=vec(c.width/2,c.height/2);
	return v;	
}
/**
 * this function loads images and audio tracks in the images and sounds arrays.
 * @function
 * @param {canv} canvas_obj this is the game canvas
 * @returns {void}
 * @see {@link images}
 * @see {@link sounds}
 */
function init_assets(canvas_obj=null){
	assetslive=0;
	assetcount=images.length+sounds.length;
	
	//initialize images
	for (i in images){
		var img=image(images[i],canvas_obj);
		
		imageSet[images[i]]=img;
	}
	//initialize audios
	for (i in sounds){
			var aud=audio(sounds[i],canvas_obj);
			
			soundSet[sounds[i]]=aud;
	}
	
}
/**
 * this function clears the canvas screen on every frame with a color.
 * @function
 * @param {string} color this the color that the screen is cleared with.e.g "black"
 * @param {canv} canvas_object this the active canvas object to be cleared. if not set, the function will use the default canvas constant
 * @returns {void}
*/
function clear(color=null,canvas_object=null){
	var col="black";
	if(color!=null){
		col=color;
	}

	var c=null;
	if(canvas_object==null){
		c=canvas;
	}
	else{
		c=canvas_object;
	}
	var offset=c.camera.position
	var ctx=c.ctx;

	ctx.fillStyle=col;
	ctx.fillRect(0-offset.x,0-offset.y,canvas.element.width,canvas.element.height);
	ctx.fill();

}
/**
 * this function computes the loading of the image and sound assets.
 * @function
 *@param {canv} canvas_obj this is the game canvas
 * @returns {void}
 */
function load(canvas_obj=null){
	//loading assets
	assetslive+=1;

	progress=assetslive/assetcount;
	
	if(assetslive==assetcount){
		if(canvas_obj==null){
			canvas.event_system.loader.run();
		}
		else{
			canvas_obj.event_system.loader.run();
		}
		
	}
	
	
}
/**
 * this function creates a new image asset.
 * @function
 * @param {string} src this is the path or url of the image
 *@param {canv} canvas_obj this is the game canvas
 * @returns {HTMLImageElement} img
 */
function image(src,canvas_obj=null){
	var img=new Image();
	img.src=assetDirectory+src;
	
	img.onload=function (){
		load(canvas_obj);
	}
	return img;
}
/**
 * this function creates a new sound asset.
 * @function
 * @param {string} src this is the path or url of the sound asset.
 * @param {canv} canvas_obj this is the game canvas
 * @returns {HTMLAudioElement} audio
 */
function audio(src,canvas_obj){
	var aud=new Audio();

	aud.src=assetDirectory+src;
	aud.clone=function(){
		var a=new Audio();
		a.src=this.src;
		return a;
	}
	aud.onload=function (){
		load(canvas_obj);
	}
	
	return aud;
}

//canvas
/**
 * this is the canvas object class.
 * @class
 * @global
 */
class canv{
	/**
	 * 
	 * @param {string} id this is the id of the HTML canvas element to used to render with canvas object.
	 */
	constructor(id="screen"){
		/**
		 * @prop {string} id this is the id of the HTML canvas element to used to render with canvas object.
		 */
	this.id=id;
	//web-gl
	/**
		 * @prop {Object} ctx this is the  2D rendering context.
		 */
	this.ctx=null;
	//viewport height and width
	/**
		 * @prop {number} width this is the width of the canvas based on the viewport.
		 */
	this.width=null;
	/**
		 * @prop {number} height this is the height of the canvas based on the viewport.
		 */
	this.height=null;
	/**
		 * @prop {scen[]} scenes this is an array of the scenes create for the canvas.
		 */
	this.scenes={};
	//screen element
	/**
		 * @prop {number} element this is the HTML canvas element to used to render with canvas object.
		 */
	this.element=null;
	/**
		 * @prop {scen} currentScene this is the current active scene
	*/
	this.currentScene=null;
		/**
	 * 
	 * @prop {number} timeout This refresh rate of the canvas. default value is 0.
	 */
		this.timeout=0;
	//view
	this.dx=0;
	this.dy=0;
	this.scx=1;
	this.scy=1;
	this.init_view=false;
	//cursor
	/**
	 * @prop {curObj} cursor this is the cursor object for the canvas
	 */
this.cursor=new curObj(this)
//camera
	/**
	 * @prop {viewObj} camera this is the viewport camera object for the canvas
	 */
this.camera=new viewObj(this);
		/**
		 * @prop {eventSystem} event_system this is the event system of the canvas;
	*/
	this.event_system=new eventSystem(this);
	this.initialize();
	this.initSize();
}
	initSize(){
		this.width=this.element.width;
		this.height=this.element.height;
	}
	
	resetViewport(width,height){
		this.width=width;
		this.height=height;
		this.init_view=true;
	}
	processPhysics(pair){
		var r1=pair[0].object.components["rigidbody"];
		var r2=pair[1].object.components["rigidbody"];
		if(r1 && r2){
			if(r1){
				r1.process();
			}
			if(r2){
				r2.process();
			}
		}
	
	}
	processCol(cols){
				for(let i=0;i<cols.length;i++){
					var pair=cols[i];
					if(pair[0] && pair[1]){
						if(pair[0].active==true&&pair[1].active==true){
							collisionDetect(pair[0],pair[1]);
						}
					}
				
				}
	}
	pre_process(){
		var scn=this.currentScene;
		if(scn!=null){
			var samples=5;
			var i=0;
			var cols=scn.colliders;
			cols=pairOf(cols);
			
			while(i<samples){
				for(let a=0;a<cols.length;a++){
					var pair=cols[a];
					this.processPhysics(pair);
				}
				this.processCol(cols);
				i++;
			}
		}
	}
		/**
	 * this function returns mouse event object
	 * @function
	 * @memberof canv
	 * @returns {mouseStruct2D}
	 */
	 mouse(){
		return this.event_system.mouseObj;
	}
		/**
 * this function creates a input  object for a keyboard key.
 * @param {string} key this is the keyboard key to checked.
 * @returns {inputObj} input object.
 * @memberof canv
 */
input(key){
	return this.event_system.input(key);
}
	//mouseInput function
/**
 * function checks whether mouse event is active.
 * @param {string} key mouse event state to be checked.e.g   "moved" for moving,0 for LeftButton, 1 for WheelButton,2 for RightButton
 * @returns {inputObj}
 *  * @memberof canv
 */
 mouseInput(key="moved"){
	return this.event_system.mouseInput(key);
}
	/**
	 * this function can be used to run any logic for game at every cycle.
	 * @function
	 * @memberof canv
	 */
	logic(){}
	/**
	 * this function updates canvas and game every frame.
	 * @function
	 * @memberof canv
	 * @returns {void}
	 */
	update(){
		if(this.init_view==true){
			this.camera.setViewport(this.element.width,this.element.height);
		}
			
		if(this.currentScene!=null){
	
				this.currentScene.clean();
				this.event_system.eventHandler();
				this.logic();
				if(this.currentScene.active==true){
				this.pre_process();
				this.currentScene.update();
				}
				this.event_system.clearEvents();
		
	
		
	
			
			
		}
		
	}
	/**
	 * this function adds a scene to the game/canvas. scenes can not have same name.
	 * @function
	 * @param {scen} scene this is the scene to add added
	 * @memberof canv
	 * @returns {void}
	 */
	addScene (scene){
		this.scenes[scene.name]=scene;
		scene.canvas=this;
	}
	worldCord(x,y){
		var scx=1;
		var scy=1;
		var v=vec(x/scx,y/scy);
		return v;
	}
	/**
	 * this function initializes the game/canvas object.
	 * @function
	 * @retuns {void}
	 * @memberof canv
	 */
	initialize(){
		var event_system=this.event_system;
		var element =document.getElementById(this.id);
		this.element=element;
		//adding event handlers
		element.onmousedown=function(event){
			var x=event.x-element.offsetLeft+window.scrollX;
			var y=event.y-element.offsetTop+window.scrollY;
			var cords=canvas.worldCord(x,y);
			event_system.mousedown(cords.x,cords.y,event);
		}
		element.onmouseup=function(event){
			var x=event.x-element.offsetLeft+window.scrollX;
			var y=event.y-element.offsetTop+window.scrollY;
			var cords=canvas.worldCord(x,y);
			event_system.mouseup(cords.x,cords.y,event);
		}
		element.onmousemove=function(event){
			var x=event.x-element.offsetLeft+window.scrollX;
			var y=event.y-element.offsetTop+window.scrollY;
			var cords=canvas.worldCord(x,y);
			event_system.mousemove(cords.x,cords.y,event);
			
		}
		element.onclick=function(){
			var x=event.x-element.offsetLeft+window.scrollX;
			var y=event.y-element.offsetTop+window.scrollY;
			var cords=canvas.worldCord(x,y);
		    event_system.mclick(cords.x,cords.y,event);
		}
		element.onmouseout=function(){
			
			event_system.mouseObj.over=false;
		}
		element.onmouseover=function(){
			
			event_system.mouseObj.over=true;
		}
		element.addEventListener('contextmenu', function(event) {event.preventDefault();})
		document.body.addEventListener("keyup",function(){event_system.keyup(event)});		
		document.body.addEventListener("keydown",function(){event_system.keydown(event)});		
		document.body.addEventListener("keypress",function(){event_system.keypress(event)});
		//setting 2d rendering context
		this.ctx=element.getContext("2d");	
		//reseting view port
		this.resetViewport(element.width,element.height);
		
		this.initSize();	
		
		
	}
	
	
}
//material 
/**
 * this is the material object class.
 * @class
 * @global
 */
class matObj{
	/**
	 * 
	 * @param {GameObject} obj this is the gameobject the material belongs to.
	 * @param {string} name this is the name of the material
	 * @param {number} w this is the width of the material renderer
	 * @param {number} h  this is the height of the material renderer
	 */
	constructor(obj,name,w=50,h=50){
	/**
	 * @prop {string} name this is the name of the material
	 */
	this.name=name;
	/**
	 * @prop {GameObject} object this is the gameobject the material belongs to.
	 */
	this.object=obj;
	/**
	 * @prop {number} width this is the width of the material renderer
	 */
	this.width=w;
	/**
	 * @prop {number} height this is the height of the material renderer
	 */
	this.height=h;
	/**
	 * @prop {boolean} animated if true, the material is rendered as an animated sprite using animation clips.
	 */
	this.animated=false;
	
	this.offset=[0,0]
	/**
	 * @prop {Array} animation this is the array of the sprite animation on the material
	 */
	this.animation=[];
	/**
	 * @prop {Object|rectange} renderer this is the renderer object of the material used when it is not animated.
	 */
	this.renderer=new rectangle(obj.scene,obj.position,w,h,"blue",true);
	
} 
    /**
	 * this function sets the renderer size of the material
	 * @function
	 * @param {number} w this is the width of the material renderer
	 * @param {number} h  this is the height of the material renderer
	 * @memberof matObj
	 * @returns {void}
	 */
	setSize(w,h){
		this.width=w;
		this.height=h;
		this.renderer.setSize(w,h);
	}
	/**
	 * this function loads an animation clip /sprite for the material
	 * @param {clipObj} source this is the clip for the animation
	 * @param {number} index this is the current frame of the animation
	 * @returns {void}
	 * @memberof matObj
	 */
	loadClip(source,index){
		this.animation=[source,index];
	}
	animate(){
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
		var ctx=this.object.scene.canvas.ctx;
		ctx.beginPath();
		//draw animation frame
		ctx.drawImage(img,x0,y0,cw,ch,x,y,this.width,this.height);
		ctx.closePath();
		}

	}
	/**
	 * this function updates the material on every frame
	 * @function
	 * @memberof matObj
	 * @returns {void}
	 */
	update(){
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
/**
 * this function creates a new material
 * @param {GameObject} obj this is the game object the materials belongs
 * @param {string} name this is the name of the material
 * @param {number} w this is the width of the material renderer
  *@param {number} h  this is the height of the material renderer
  @function
 * @returns {matObj} material
 */
function material(obj,name,w=50,h=50){
	var m=new matObj(obj,name,w,h);
	return m;
}
/**
 * this functions creates new selector object
 * @function
 * @param {vec2d} vector this is the default position of the selector
 * @returns {selector2D} selector
 */
function selector(vector){
	var v=new selector2D(vector);
	return v;
}
/**
 * this functions creates scene
 * @function
 * @param {string} name this is the name of the scene
 * @param {canv} canvas this is the canvas object to which the scene belongs
 * @returns {scen} scene
 */
function scene(name,canvas){
	var v=new scen(name,canvas);
	return v;
}
//instance of canvas
/**
 * constant stores the canvas object
 * @constant
 * @global
 * @type {canv}
 */
const canvas=new canv("screen");

