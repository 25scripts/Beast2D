//### EXAMPLE: PHYSICS & COLLISIONS ###

//create first scene  and add it to the default canvas.
var myScene = scene("MyScene", canvas);

//now lets  background image to the scene
var myBackground = myScene.addBg("black");

var particle_system = myScene.addParticleSystem("ParticleSystem");
particle_system.properties.interval = 0.1;
particle_system.properties.life = 2;
var size = 5;
particle_system.properties.size = vec(size, size);
particle_system.properties.life_cycle = 0.005;
particle_system.properties.velocity = vec(0, 0);
particle_system.properties.material = ["color", 800];
particle_system.properties.count = 100;

particle_system.startPositionFunction = function (particle_obj) {
  var particle_system2 = particle_obj.particle_system;
  var size = particle_system2.properties.size;
  var scale = Math.random() * (1.5 - 0.5) + 0.5;
  particle_obj.properties.size = vec(size.x * scale, size.y * scale);
};
particle_system.materialFunction = function (particle_obj) {
  var life = particle_obj.properties.life;
  var total = particle_obj.properties.initial_life;
  var mat = particle_obj.properties.initial_material;
  var color =
    "hsla(" +
    mat[1] +
    ",100%," +
    (life * 100) / total +
    "%," +
    life / total +
    ")";
  particle_obj.properties.material = ["color", color];
};
particle_system.startAccelerationFunction = function (particle_obj) {
  acc = vec(0.005 * (Math.random() * 2 - 1), 0.005 * (Math.random() * 2 - 1));
  particle_obj.properties.acceleration = acc;
};

particle_system.emit();

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
