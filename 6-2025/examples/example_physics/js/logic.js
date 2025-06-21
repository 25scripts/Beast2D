//### EXAMPLE: PHYSICS & COLLISIONS ###

//create first scene  and add it to the default canvas. 
var myScene=scene("PhysicScene",canvas)

//now lets  background image to the scene
var myBackground=myScene.addBg("black")


var has_collided=false;

//let add the box to the scene
var box=myScene.addGameObject("box");

box.materials[0].renderer.fill=false
box.materials[0].renderer.color="yellow";
box_collider=collider(box,rectangular);
box_collider.bounce=0;

box_rig=rigidbody(box);
box_rig.gravity=true;

//let change the gravity
gravity.y=0.0001;


//let a game object for the ground
var ground = myScene.addGameObject("ground");
ground.materials[0].renderer.color="#aaa";
ground.setSize(400,20)
ground.setPosition(vec(250,400))
ground_collider=collider(ground,rectangular);
ground_collider.visualize=true;
ground_collider.color="yellow";
ground_collider.setBounds([400,20])



//lets detect the collision
box_collider.trigger=function(col){
        if(col.object.name=="ground" && has_collided==false){
                 has_collided=true;
                 timer=Timer(1000,function(game_object){
                        game_object.setPosition(center());
                        has_collided=false;
                 },box);
                 timer.start(true);
        }
}


//lets run the scene
myScene.run();
// global update function 
function update() { 
        // Clear screen with black color
        clear("black");
        // Update the canvas object
        canvas.update();
        // Set the update to repeat
        setTimeout(update, canvas.timeout); 
} 
update();