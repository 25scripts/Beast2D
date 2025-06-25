//### EXAMPLE: INPUT & EVENTS ###

//create first scene  and add it to the default canvas. 
var myScene=scene("PhysicScene",canvas)

//now lets  background image to the scene
var myBackground=myScene.addBg("black")


var has_collided=false;

//let add the box to the scene
var box=myScene.addGameObject("box");

box.materials[0].renderer.fill=false
box.materials[0].renderer.color="yellow";



canvas.logic=function(){

if(canvas.input("D").down()){
    box.position.x+=1;
   
}
if(canvas.input("A").down()){
    box.position.x-=1;
}
if(canvas.input("W").down()){
    box.position.y-=1;
}
if(canvas.input("S").down()){
    box.position.y+=1;
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