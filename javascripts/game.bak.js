var game = new Phaser.Game(
    800, 600,
    Phaser.AUTO,
    'ironHack spaceinvaders',
    { preload: preload, create: create, update: update });


var player;
var lives;
var starfield;
var chickens;
var chickenLegs;
var eggs;
var counter = 0;
var bullets;
var bulletTime = 0;
var firingTimer = 0;
var livingChickens = [];
var fireKey;
var keyboard;
var bank;
var score = 0;
var scoreString = ' ';
var scoreText;
var stateText;       
var Velocity = 400;
var Maxspeed = 400;



function preload() {
    game.load.image('starfield', './images/starfield.png');
    // game.load.image('ship', './images/playerShip.png');
    game.load.image('ship', './images/ship2.png');
    game.load.spritesheet('enemy1','./images/main1.png',48.3,47);
    game.load.image('bulletsprite1','./images/bullet20.png');
    game.load.image('chickenleg', './images/11.png');
    game.load.image('egg', './images/9.png');

} 



function create() {
    //  Scrolling background
    starfield = game.add.tileSprite(0,0,800, 600, 'starfield');

    //  current player ship 
    player = game.add.sprite(400, 520, 'ship');
    player.anchor.setTo(0.5, 0.5)
    player.scale.setTo(0.5,0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    // player.setCol    lideWorldBounds(true);
    player.body.maxVelocity.setTo(Maxspeed, Maxspeed);  

    //regular chickens
    chickens = game.add.group();
    chickens.enableBody = true;
    chickens.physicsBodyType = Phaser.Physics.ARCADE;
    chickens.setAll('outOfBoundsKill', true);
    chickens.setAll('checkWorldBounds', true);
        createChickens();

     //  Our weapon bullets
     bullets = game.add.group();
     bullets.enableBody = true;
     bullets.physicsBodyType = Phaser.Physics.ARCADE;
     bullets.createMultiple(10, 'bulletsprite1');
     bullets.setAll('anchor.x', .5)
     bullets.setAll('anchor.y', .5);
     bullets.setAll('outOfBoundsKill', true);
     bullets.setAll('checkWorldBounds', true);

    //chickenlegs group
    chickenLegs = game.add.group();
    chickenLegs.enableBody = true;
    chickenLegs.physicsBodyType = Phaser.Physics.ARCADE;
    chickenLegs.createMultiple(5, 'chickenleg')
    chickenLegs.setAll('anchor.x', 0.5)
    chickenLegs.setAll('anchor.y', 0.5);
    chickenLegs.setAll('checkWorldBounds', true);

    // //chicken egg drop
    // eggs = game.add.group();
    // eggs.createMultiple(50, 'eggs');
    // egggs.forEach(setupInvader, this);

    //chicken egg bomb group
    eggs = game.add.group();
    eggs.enableBody = true;
    eggs.physicsBodyType = Phaser.Physics.ARCADE;
    eggs.createMultiple(30, 'egg');
    eggs.setAll('anchor.x', 0.5);
    eggs.setAll('anchor.y', 1);
    eggs.setAll('outOfBoundsKill', true);
    eggs.setAll('checkWorldBounds', true);



    //chickens decending through map
    game.time.events.loop(2000,descend,this);
    
    
    //keeping score
    scoreString = 'Score : ';
    scoreText = game.add.text(20,20,scoreString + score, {
        font: '30px Arial', fill: '#fff'});

    //player lives
    lives = game.add.group();
    game.add.text(game.world.width - 100, 10, 'Lives: ', {
        font: '30px Arial', fill: '#fff'});  



    //Creating Keyboard controls
    keyboard = game.input.keyboard.createCursorKeys();  
    fireKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
};



function update() {
    //  Scroll the background
    starfield.tilePosition.y -= 2;

    //Setting Keyboard keys with velocity & not off map
    player.body.velocity.setTo(0, 0);
    player.body.collideWorldBounds=true;

    
    if (keyboard.left.isDown)
    {
        player.body.velocity.x = -300;
    }
    else if (keyboard.right.isDown)
    {
        player.body.velocity.x = 300;
    }


    //Setting Keyboard for shooting
    if (fireKey.isDown)
    { 
        createBullet();
    }

    //dropping eggs
    if (game.time.now > firingTimer)
    {
        dropEggs();
    }

    //screen Text
    stateText = game.add.text(game.world.centerX, game.world.centerY,' ', {font: '84px Arial', fill: '#fff'});
    stateText.anchor.setTo(0.5,0.5);
    stateText.visible = false;

    //squeezing effect
    bank = player.body.velocity.x / Maxspeed;
    player.scaleX = 1 - Math.abs(bank) / 5;
    player.angle = bank * 10;

    //collision for bullets and chickens 
    game.physics.arcade.overlap(bullets, chickens, collisionChickenBullet, null, this);
    //collision for player and chicken legs
    game.physics.arcade.overlap(player, chickenLegs, collisionChickenLegs, null, this);
    //collision for player and eggs
    game.physics.arcade.overlap(player, eggs, collisionEggs, null, this);
    //collision for player and chicken
    game.physics.arcade.overlap(player, chickens, collisionChickenPlayer, null, this);



}


function render() {

}


//creating bullet for array
function createBullet(){
    if (game.time.now > bulletTime)
    {
    var bullet = bullets.getFirstExists(false);

    if (bullet)
    {
        //  And fire it
        bullet.reset(player.x-6, player.y-10);
        bullet.body.velocity.y = -400;
        bulletTime = game.time.now + 200;  
    }
}};

//creating chicken for array
function createChickens () {

    for (var y = 0; y < 3; y++)
    {
        for (var x = 0; x < 8; x++)
        {
            var chicken = chickens.create(x * 70, y * 50, 'enemy1');
            chicken.anchor.setTo(0.5, 0.5);
            chicken.animations.add('flap', [ 0, 1, 2, 3,], 5, true);
            chicken.play('flap');
            chicken.body.moves = false;
        }
    }
        chickens.x = 160;
        chickens.y = 100;
        //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
        var tween = game.add.tween(chickens).to( { x: 200 }, 800, Phaser.Easing.Linear.None, true, 0, 1000, true);
    };


//Make chicken descend
function descend() {
    chickens.y +=20;
};    



function collisionChickenBullet(bullet, chicken) {
    //when bullet hits chicken remove chicken from group
    bullet.kill();
    chicken.kill();
    //Increase score each chicken killed
    score += 10;
    scoreText.text = scoreString + score;
    //drop chicken leg
    let chickenLegsCheck = chickenLegs.getFirstExists(false);
    
    if (!chickenLegsCheck == true) {
        console.log('maxed');
   
    } else {
        var chickenLeg = chickenLegs.getFirstExists(false)
        chickenLeg.reset(chicken.body.x ,chicken.body.y);   
        chickenLeg.body.velocity.y = +100;
    }

};

function collisionChickenLegs(player, chickenLeg) {
    //when play hits chicken leg
    chickenLeg.destroy();
    //Increase score each chicken killed
    score += 20;
    scoreText.text = scoreString + score;
};

function collisionEggs(player, Egg) {
    //when player hits egg
    egg.kill();
    player.kill();
    bullets.kill()
    //gameover
    stateText.text = 'Game over';
    stateText.visible=true;
};

function collisionChickenPlayer(player, Chicken) {
    //when player hits chicken
    player.kill();
    bullets.kill();
    //gameover
    stateText.text = 'Game over';
    stateText.visible=true;
};

function dropEggs () {

    //  Grab the first bullet we can from the pool
    egg = eggs.getFirstExists(false);

    livingChickens.length=0;

    chickens.forEachAlive(function(chicken){

        // put every living enemy in an array
        livingChickens.push(chicken);
    });


    if (egg && livingChickens.length > 0)
    {
        
        var random=game.rnd.integerInRange(0,livingChickens.length-1);

        // randomly select one of them
        var shooter= livingChickens[random];
        // And fire the bullet from this enemy
        egg.reset(shooter.body.x+23, shooter.body.y+20);
        egg.body.velocity.y =+ 150;

        // game.physics.arcade.moveToObject(enemyBullet,player,120);
        firingTimer = game.time.now + 700;
    }

}

// function setupEggs (chicken) {

//     invader.anchor.x = 0.5;
//     invader.anchor.y = 0.5;
//     invader.animations.add('');

// }
