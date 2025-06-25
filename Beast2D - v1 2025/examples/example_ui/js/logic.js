//### EXAMPLE: UI ELEMENTS ###




//lets create first menu scene and add it to the default canvas. 
var menuScene=scene("MenuScene",canvas)
var menuBackground=menuScene.addBg("#3aa");


//lets add ui buttons
var play_button=menuScene.addButton("PLAY GAME",center());
play_button.set
play_button.color="#00f";
play_button.color2="#00a";
play_button.label.font="Consolas";
play_button.label.size=24;
size=play_button.getSize();
play_button.position=addVec(play_button.position,vec(-size[0]/2,0));
play_button.tcolor="yellow";
play_button.tcolor2="white";


//lets add text instructions
var text=menuScene.addText("Click the Button",center());
text.font="Georgia";
text.size=24;
var size2=text.getSize();
text.position=addVec(text.position,vec(-size2.width/2+10,-50));

//lets create a game scene
var myScene=scene("MyScene",canvas)



//lets add text instructions to scene also
var text2=myScene.addText('Press "E" to go back!',center());
text2.font="Georgia";
text2.size=24;
var size3=text.getSize();
text2.position=addVec(text2.position,vec(-size3.width/2+10,-100));
//now lets  background image to the scene
var myBackground=myScene.addBg("black")


var has_collided=false;

//let add the box to the scene
var box=myScene.addGameObject("box");

box.materials[0].renderer.fill=false
box.materials[0].renderer.color="yellow";


//let add an action to the button
play_button.action=function(){
    myScene.run();
}

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

if(canvas.input("E").down()){
   menuScene.run();
}
}


//lets run the menu scene
menuScene.run();
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