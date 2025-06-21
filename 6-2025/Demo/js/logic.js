//###ASTERIOID GAME CREATED USING BEAST2D###
//game assets
//set asset directory
var assetDirectory="assets/";
//images
images=[
    "asteroid.png",
    "bar_h.png",
    "bar.png",
    "bg.jpg",
    "bg1.jpg",
    "cur.png",
    "cursor.png",
    "filter.png",
    "plane.png",
    "player1.png",
    "rocket.png",
    "title.png",
    "tracker.png",
    "logo.png"
];
//sounds
sounds=[
    "select.mp3",
    "shoot.mp3",
    "spark.mp3",
];
//load images
init_assets();
//menu scene
var menu=scene("menu",canvas);

var background=menu.addBg(imageSet["bg.jpg"],"image");

canvas.addScene(menu);

var title=menu.addImageGui(imageSet["title.png"],center(),[200,60])


var button_layout=menu.addLayout(vec(0,0),"center");
var button_size=[150,50]
var play_button=menu.addButton("PLAY",center(),button_size);
play_button.label.setStyle("Impact",18,"fill");
play_button.setImages(imageSet["bar.png"],imageSet["bar_h.png"])
play_button.hover=function(){soundSet["select.mp3"].play()};
//play the game
play_button.action=function(){
    game.clear();
    game.run()
    game.canvas.cursor.setImage(imageSet["cursor.png"],[25,25]);
};

var instructions_button=menu.addButton("INSTRUCTIONS",center(),button_size);
instructions_button.label.setStyle("Impact",18,"fill");
instructions_button.setImages(imageSet["bar.png"],imageSet["bar_h.png"])
instructions_button.hover=function(){soundSet["select.mp3"].clone().play()};
//go to instructions menu
instructions_button.action=function(){
    instructions.run()
    game.canvas.cursor.setImage(imageSet["cur.png"],[25,25]);
};
var quit_button=menu.addButton("QUIT",center(),button_size);
quit_button.label.setStyle("Impact",18,"fill");
quit_button.setImages(imageSet["bar.png"],imageSet["bar_h.png"])
quit_button.hover=function(){soundSet["select.mp3"].clone().play()};

button_layout.addObject(title);
button_layout.addObject(play_button);
button_layout.addObject(instructions_button);
button_layout.addObject(quit_button);


//instructions scene
var instructions=scene("instructions",canvas);
var background2=instructions.addBg(imageSet["bg.jpg"],"image");
canvas.addScene(instructions);

var button_layout2=instructions.addLayout(vec(0,0),"center");
button_layout2.setMargins(0,0,0,0);
button_layout2.spacing=20;  

var background3=instructions.addGameObject("background");
background3.materials[0].renderer.setImage(imageSet["plane.png"]);
background3.materials[0].setSize(canvas.width*0.8,canvas.height*0.8);
background3.pos=vec(canvas.width*0.2/2,canvas.height*0.2/2);


var back_button=instructions.addButton("Back",center(),button_size);
back_button.label.setStyle("Impact",18,"fill");
back_button.setImages(imageSet["bar.png"],imageSet["bar_h.png"]);
back_button.hover=function(){soundSet["select.mp3"].clone().play()};
//go to menu
back_button.action=function(){
    menu.run()
    game.canvas.cursor.setImage(imageSet["cur.png"],[25,25]);
};

//instructions
var instruct1=instructions.addText(">Target an asteroid and click to lock on it.",center());
var instruct2=instructions.addText(">Press Escape key to go to menu.",center());
var instruct3=instructions.addText(">Use W,A,S,D keys to move the spaceship.",center());
var instruct4=instructions.addText(">Use mouse to change direction.",center());




button_layout2.addObject(instruct1);
button_layout2.addObject(instruct2);
button_layout2.addObject(instruct3);
button_layout2.addObject(instruct4);
button_layout2.addObject(back_button);
//game scene
var game=scene("game",canvas);
game.reset=function(){
game.addBg(imageSet["bg1.jpg"],"image");
var filter_background=game.addBg(imageSet["filter.png"],"image");
var explosions=[]
filter_background.render=filter_background.update
filter_background.update=function(){
        for(let i=0;i<explosions.length;i++){
            explosions[i].update()
        }
        filter_background.render();
}



game.canvas.cursor.setImage(imageSet["cursor.png"],[25,25]);


var player=game.addGameObject("player");
var player_life=50;
var player_current_life=50;
var player_energy=200;
var player_current_energy=200;
var player_damage=10;
var or=player.getOrientation();
player.rotation=or.upRotation();
player.materials[0].renderer.setImage(imageSet["player1.png"]);
player.addComponent(collider(player,rectangular));
player.setSize(50,40);
player.components["collider"].setBounds([50,40]);
player.components["collider"].static=true;
player.components["collider"].trigger=function(col){

    if(col.object.name=="asteroid"){
        player_current_life-=player_damage;
        life_bar.setValue(player_current_life/player_life);

     
        if(player_current_life<=0){
            addExplosion(player.position);
            player.delete()
            end_game();
        }
    }

}





/*particle system
function to add trail*/
function addTrail(obj,offset,size=5){
var p=game.addParticleSystem();

p.setPosition(subVec(offset,obj.position))
constraint(obj,[p],0,true);
p.setPosition(center());
p.properties.interval=0.01;
p.properties.life=0.5;
p.properties.size=vec(size,size);
p.properties.life_cycle=0.005;
p.properties.velocity=vec(0,50);
p.properties.material=["color",200];
p.properties.acceleration=vec(0,+0.005);


//lets set start size of the particle
p.startSizeFunction=function(particle_obj){
    var particle_system=particle_obj.particle_system;
    var size=particle_system.properties.size;
    var scale=Math.random()*(1.5-0.5)+0.5;
    particle_obj.properties.size=vec(size.x*scale,size.y*scale)
}

//set the color of the particles over life
p.materialFunction=function(particle_obj){
var life=particle_obj.properties.life;
var total=particle_obj.properties.initial_life;
var mat=particle_obj.properties.initial_material;
var color='hsla('+mat[1]+',100%,'+life*100/total+'%,'+life/total+')';
particle_obj.properties.material=['color',color];

}
p.emit()

}
//add particle trail to player
addTrail(player,vec(player.width/2,-6))
addTrail(player,vec(player.width/2,6))
//lets tracker to track targets based on mouse position
var tracker=game.addGameObject("tracker");
tracker.materials[0].renderer.setImage(imageSet["tracker.png"]);
tracker.setPosition(center());
tracker.setSize(60,60);
tracker.target=null;
tracker.logic=function(){
    var event_system=this.scene.canvas.event_system;
    var active_collider=event_system.mouseObj.active_collider;
    
    if(active_collider!=null && active_collider.object.name=="asteroid" && player_current_life>0){
        var obj=active_collider.object;
        this.rotation=obj.rotation;
        this.visible=true;
        this.setPosition(obj.position);
        this.target=obj;
    }
    else{
        this.visible=false;
        this.target=null;
    }
}
//create spawn points for shots
var p1=game.addGameObject('spawnpoint');
var p2=game.addGameObject('spawnpoint');
p1.visible=false;
p2.visible=false;
p1.setSize(5,5);
p2.setSize(5,5);
p1.setPosition(addVec(vec(player.width/40,player.height/4),player.position))
p2.setPosition(addVec(vec(player.width/40,-player.height/4),player.position))
constraint(player,[p1,p2],0,true);
var last_pt=0;
//function to shoot at the asteroid
function shoot(){
        if(player_current_energy<=0){
            return 0;
        }
        var point=[p1,p2];
        if(last_pt==0){
            point=point[0]
            last_pt=1;
        }
        else{
            point=point[1]
            last_pt=0;
        }
        var life=3000;
        player_current_energy-=1;
        soundSet["shoot.mp3"].clone().play();
        var shot=game.addGameObject("shot");
        shot.setSize(8,2.5);
        shot.materials[0].renderer.setColor("#0ecfff");

        shot.addComponent(collider(shot,rectangular));
   
        shot.components["collider"].ghost=true;
        shot.components["collider"].setBounds([8,2.5]);
        shot.components["collider"].trigger=function(col){
          
            if(col.object.name=="asteroid"){
     
                current_score+=1;
                
                addExplosion(col.object.position);
                var sound=soundSet["spark.mp3"];
                sound.volume=0.2; 
                sound.play();
                col.object.delete();
                this.object.delete();
            }
        }
        shot.setPosition(point.position);
        addTrail(shot,vec(shot.width,0),3)

        shot.target=tracker.target;
        shot.direction=player.getOrientation().right();
    
        shot.logic=function(){
                
                var speed=1;
                if(this.target){
                    this.targetPosition=this.target.position.copy();
                    var dir=this.direction;
                    if(this.scene.objects.includes(this.target)==true){
                        var dir=subVec(this.position,this.target.position).normalized();
                    }
                  
                  
                    var vel=scaleVec(dir,speed);
                    var pos=addVec(this.position,vel);
                    lookAt(this,pos);
                    this.setPosition(pos);
                    this.direction=dir;
                }
                else{
                    var dir=this.direction.normalized() 
                    var vel=scaleVec(dir,speed);
                    var pos=addVec(this.position,vel);
                    lookAt(this,pos);
                    this.setPosition(pos);
                }
        }
        setTimeout(function(){shot.delete()},life);
}
//game logic
game.logic=function(){
    var canvas=game.canvas;
    var mouse=canvas.mouse();
    if(player_current_life>0){

    score.text=`    SCORE: ${current_score}  `;
    energy_bar.setValue(player_current_energy/player_energy)
    var orientation=player.getOrientation();
    lookAt(player,mouse.position,center());

    if(canvas.mouseInput(0).up()){
            
            shoot();
    }   
    if(canvas.input("w").down()  ){
        move=scaleVec(orientation.right(),1);
        player.setPosition(addVec(player.position,move));
    }
    if(canvas.input("s").down()){
        player.position.y+=1;
    }
    if(canvas.input("a").down()){
        player.position.x-=1;
    }
    if(canvas.input("d").down()){
        player.position.x+=1;
    }
    //lets restrict the player with the canvas
    var distance=subVec(center(),player.position);
    if(distance>=game.canvas.width-100){
            player.setPosition(scaleVec(distance.normalized(),game.canvas.width-100));
    }
    }
    //quit action
    if(canvas.input("escape").up()){
        menu.run();
        canvas.cursor.setImage(imageSet["cur.png"],[25,25]);
    }
}

//game ui
//game score
var current_score=0;
var score=game.addText(`    SCORE: ${current_score}  `,vec(25,50))
score.color="cyan";
score.setStyle("IMPACT",12,"fill");
var score_size=score.getSize(true);
var border=game.drawRectangle(vec(35+score_size[0]/2,50-score_size[1]/2),score_size[0]+20,score_size[1]+5,"cyan",false);
//progress
var life_bar=game.addProgress(1,vec(score_size[0]+10+40,50-5));
life_bar.setColors('rgb(0,255,10)','rgba(0,0,0,0)')
life_bar.setSize(80,4);
var energy_bar=game.addProgress(1,vec(score_size[0]+10+40,50-10));
energy_bar.setColors('rgb(0,150,255)','rgba(0,0,0,0)')
energy_bar.setSize(80,4);
//add time
var total_time=6;
var time=get_time(total_time);
var timer_text=game.addText(`  ${time.min.toString().padStart(2,"0")}:${time.sec.toString().padStart(2,"0")}   `,vec(200,50))
timer_text.setStyle("IMPACT",12,"fill");
timer_text.color="cyan";
//score timer function
function get_time(total_time){
    var total=total_time*60.0;
    var sec=parseInt((total)%60);
    var min=Math.floor(total/60)

    return {"min":min,"sec":sec};
}
Timer(1000,function(){
    var time=get_time(total_time);
    timer_text.text=`  ${time.min.toString().padStart(2,"0")}:${time.sec.toString().padStart(2,"0")}   `
    total_time-=1/60;
if(game.canvas.currentScene!=game){
    this.stop();
}
if(total_time<=0){
    
    end_game();
}
}).start()
//function to end game
function end_game(){

    var game_over=game.addText("Game Over");
    game_over.setStyle("IMPACT",24,'fill');
    game_over.color="red";
    var size=game_over.getSize();
    game_over.position=subVec(vec(size.width/2,0),center());
    game_over.update()
    game.active=false;
    this.stop();
    setTimeout(function(){menu.run(); menu.canvas.cursor.setImage(imageSet["cur.png"],[25,25])},3000);

}
//addExplosion
function addExplosion(position,color='#0ecfff'){
    
    var explosion = new GameObject(game,"explosion");
   
    explosion.setPosition(position);
    explosion.radius_factor=0;
    explosion.initial_radius=10*Math.random()+40;
    explosion.initial_color=color;

    explosion.update=function(){
    
        var radius=this.initial_radius;
        var f=this.radius_factor;
        var color=this.initial_color;
        var ctx=this.scene.canvas.ctx;
        ctx.save();
        
        ctx.beginPath();
     
        var grad=ctx.createRadialGradient(this.position.x,this.position.y,radius*f,this.position.x,this.position.y,radius);
        grad.addColorStop(0,'rgba(0,0,0,0)');
      
        grad.addColorStop(0.2,color);
      
        grad.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=grad;
      
        ctx.arc(this.position.x,this.position.y,radius,0,2*Math.PI,true);
        ctx.lineWidth=5;
        ctx.fill();
   
        ctx.closePath();
        ctx.restore();
        this.radius_factor+=0.005;
      
        if(this.radius_factor>=1){
            if(explosions.includes(this)){
                explosions.splice(explosions.indexOf(this),1);
            }
        }
    }
    
   

    explosions.push(explosion);
}

//add asteroids
function addRandomAsteroid(){
    var count=game.findAll("asteroid").length;
    //lets limit the number of asteroids to 50
    if(count<50){
        var spawn_direction=360*Math.random()*Math.PI/180;
    var spawn_radius=(game.canvas.width+100)/2;
    var asteroid=game.addGameObject("asteroid");
    asteroid.setPosition(addVec(vec(spawn_radius*sin(spawn_direction),spawn_radius*cos(spawn_direction)),center()));
    direction=360*Math.random()*Math.PI/180;
    asteroid.addComponent(collider(asteroid,circular));
    //asteroid.components["collider"].visualize=true;
    asteroid.components["collider"].setBounds([20]);
    asteroid.components["collider"].bounce=0.8;
    asteroid.components["collider"].trigger=function(col){
       
        if(col.object.name=="player"){

            addExplosion(this.object.position,'#ff4800');
            var sound=soundSet["spark.mp3"].clone();
            sound.volume=0.2; 
            sound.play();
            this.object.delete();
     
           
        }
        else{
            
            this.object.physics.dx*=-1;
            this.object.physics.dy*=-1;
        }
    }
    
   
    var direction=subVec(asteroid.position,player.position).normalized();
    var offset_direction=360*Math.random()*Math.PI/180;
    asteroid.physics={
            dx:direction.x+0.5*cos(offset_direction),
            dy:direction.y+0.5*sin(offset_direction),
            rotationSpeed:0.5,
            speed:Math.random()*(1-0.1)+0.1


    }
    asteroid.logic=function(){
    
         this.rotation+=this.physics.rotationSpeed;
          this.position.x+=this.physics.speed*this.physics.dx;
         this.position.y+=this.physics.speed*this.physics.dy;
         if(subVec(center(),this.position).getMagnitude()>(canvas.width+300)){
            this.delete();
         }
    }
    asteroid.materials[0].renderer.setImage(imageSet["asteroid.png"]);
    

    }
    
    
}

Timer(2000,addRandomAsteroid).start();
//add beast logo
var logo=game.addImageGui(imageSet["logo.png"],vec(game.canvas.width-90,game.canvas.height-90),[90,90]);

}

//start game
menu.run();

 // Global update function 
 canvas.timeout=0;
 function update() { 
    // Clear screen with black color each frame 
    if(canvas.currentScene.active==true){
        clear("black",canvas);
    }
    
    // Update the canvas object
    canvas.update();
    // Set the update to repeat
    setTimeout(update, canvas.timeout); 
  } 
  update();