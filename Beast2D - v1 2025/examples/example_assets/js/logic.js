//### EXAMPLE: BASIC ASSET MANAGEMENT ###
//lets selects some assets for scene
images=["bg.jpg","cursor.png"]
//set the directory to the assets
var assetDirectory="imgs/"
//lets load the image asset
init_assets();
//create first scene  and add it to the default canvas. 
var myScene=scene("MyFirstScene",canvas)

//now lets  background image to the scene
var myBackground=myScene.addBg(imageSet["bg.jpg"],"image")

//set the cursor for the canvas when assets are loaded
canvas.event_system.loader.actions.push(
        function(){
                canvas.cursor.setImage(imageSet["cursor.png"])
        }
)
//
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