//### EXAMPLE: BASIC SCENE SETUP ###
//create first scene  and add it to the default canvas. By default the object is placed at the center of the screen
var myScene=scene("MyFirstScene",canvas)

//now lets add a game object
var myGameObject=myScene.addGameObject("MyFirstGameObject");

//lets get some information on game object like its position and name
myGameObject.getOrientation(true);

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