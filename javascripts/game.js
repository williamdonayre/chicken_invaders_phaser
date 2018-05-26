var player
,starfield
,chickens
,chickenLegs
,eggs
// ,counter
,bullets
// ,bulletTime
// ,firingTimer
// ,livingChickens
,fireKey
,keyboard
,bank
// ,score
// ,scoreString
,scoreText
,stateText    
// ,Velocity
// ,Maxspeed;
var counter = 0;
var bulletTime = 0;
var firingTimer = 0;
var livingChickens = [];
var livingChickens1 = [];
var score = 0;
var scoreString = ' ';     
var Velocity = 400;
var Maxspeed = 400;

var Game = {


 preload: function() {
    game.load.image('starfield', './images/starfield.png');
    // game.load.image('ship', './images/playerShip.png');
    game.load.image('ship', './images/ship2.png');
    game.load.spritesheet('enemy1','./images/main1.png',48.3,47);
    game.load.image('bulletsprite1','./images/bullet20.png');
    game.load.image('bulletsprite2','./images/bullet01.png');
    game.load.image('chickenleg', './images/11.png');
    game.load.image('egg', './images/9.png');
    game.load.audio('egglay', './sounds/egglay.ogg');
    game.load.audio('blasterSound','./sounds/Ionblaster.ogg');
    game.load.audio('foodeat', './sounds/foodeat.ogg');
    game.load.audio('chickhurt','./sounds/chickhurt.ogg');
    game.load.audio('mission1', './sounds/Mission_1.ogg');


}, 



create: function() {

    //sounds
    this.egglay = this.add.audio('egglay');
    this.blaster = this.add.audio('blasterSound');
    this.foodeat = this.add.audio('foodeat');
    this.chickenHit = this.add.audio('chickhurt');
    this.bgmusic = this.add.audio('mission1');

        //bg music
        this.bgmusic.play();
        this.bgmusic.volume = 0.5;



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
        this.createChickens();

     //  Our weapon bullets
     bullets = game.add.group();
     bullets.enableBody = true;
     bullets.physicsBodyType = Phaser.Physics.ARCADE;
     bullets.createMultiple(20, 'bulletsprite1');
     bullets.setAll('anchor.x', .5)
     bullets.setAll('anchor.y', .5);
     bullets.setAll('outOfBoundsKill', true);
     bullets.setAll('checkWorldBounds', true);

     bullets21 = game.add.group();
     bullets21.enableBody = true;
     bullets21.physicsBodyType = Phaser.Physics.ARCADE;
     bullets21.createMultiple(20, 'bulletsprite2');
     bullets21.setAll('anchor.x', .5)
     bullets21.setAll('anchor.y', .5);
     bullets21.setAll('outOfBoundsKill', true);
     bullets21.setAll('checkWorldBounds', true);

     bullets22 = game.add.group();
     bullets22.enableBody = true;
     bullets22.physicsBodyType = Phaser.Physics.ARCADE;
     bullets22.createMultiple(20, 'bulletsprite2');
     bullets22.setAll('anchor.x', .5)
     bullets22.setAll('anchor.y', .5);
     bullets22.setAll('outOfBoundsKill', true);
     bullets22.setAll('checkWorldBounds', true);

    //chickenlegs group
    chickenLegs = game.add.group();
    chickenLegs.enableBody = true;
    chickenLegs.physicsBodyType = Phaser.Physics.ARCADE;
    chickenLegs.createMultiple(10, 'chickenleg')
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
    game.time.events.loop(2000,this.descend,this);
    
    
    //keeping score
    scoreString = 'Score : ';
    scoreText = game.add.text(20,20,scoreString + score, {
        font: '30px Arial', fill: '#fff'});

    // //player lives
    // lives = game.add.group();
    // game.add.text(game.world.width - 100, 10, 'Lives: ', {
    //     font: '30px Arial', fill: '#fff'});  



    //Creating Keyboard controls
    keyboard = game.input.keyboard.createCursorKeys();  
    fireKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
},



update: function() {

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
        this.createBullet();
        this.blaster.play();
    }

    //dropping eggs
    if (game.time.now > firingTimer)
    {
        this.dropEggs();
        this.egglay.play();
    }


    //screen Text
    stateText = game.add.text(game.world.centerX, game.world.centerY,' ', {font: '84px Arial', fill: '#fff',boundsAlignH: "center", boundsAlignV: "middle" });
    stateText.anchor.setTo(0.5,0.5);
    stateText.visible = false;

    //squeezing effect
    bank = player.body.velocity.x / Maxspeed;
    player.scaleX = 1 - Math.abs(bank) / 5;
    player.angle = bank * 10;

    //collision for bullets and chickens 
    game.physics.arcade.overlap(bullets, chickens, this.collisionChickenBullet, null, this);
    //collision for player and chicken legs
    game.physics.arcade.overlap(player, chickenLegs, this.collisionChickenLegs, null, this);
    //collision for player and eggs
    game.physics.arcade.overlap(player, eggs, this.collisionEggs, null, this);
    //collision for player and chicken
    game.physics.arcade.overlap(player, chickens, this.collisionChickenPlayer, null, this);


    if (livingChickens.length < 1) {
            this.createChickens();
    }
        
},


render: function() {

},


//creating bullet for array
createBullet: function(){
    if (game.time.now > bulletTime)
    {
    var bullet = bullets.getFirstExists(false);

    if (bullet)
    {
        //  And fire it
        bullet.reset(player.x, player.y-20);
        bullet.body.velocity.y = -400;
        bulletTime = game.time.now + 200;  
    }
}},

//creating bullet for array
createBullet2: function(){
    if (game.time.now > bulletTime)
    {
    var bullet1 = bullets21.getFirstExists(false);
    var bullet2 = bullets22.getFirstExists(false);


    if (bullet)
    {
        //  And fire it
        bullet1.reset(player.x-12, player.y-20);
        bullet2.reset(player.x+11, player.y-20);

        bullet1.body.velocity.y = -400;
        bullet2.body.velocity.y = -400;

        bulletTime = game.time.now + 200;  
    }
}},

//creating chicken for array
createChickens: function () {

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
        //  Move group of invaders left and right 
        var tween = game.add.tween(chickens).to( { x: 200 }, 800, Phaser.Easing.Linear.None, true, 0, 1000, true);
    },

createChickens1: function () {
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
        //  Move group of invaders left and right 
        var tween = game.add.tween(chickens).to( { x: 300 }, 800, Phaser.Easing.Linear.None, true, 0, 1000, true);
    },


//Make chicken descend
descend: function() {
    chickens.y +=20;
},   



collisionChickenBullet: function(bullet, chicken) {
    this.chickenHit.play();
    //when bullet hits chicken remove chicken from group
    bullet.kill();
    chicken.kill();
    //Increase score each chicken killed
    score += 10;
    scoreText.text = scoreString + score;
    //drop chicken leg
    chickenLegsCheck = chickenLegs.getFirstExists(false);
    if (!chickenLegsCheck == true) {
        console.log('empty');
   
    } else {
        var chickenLeg = chickenLegs.getFirstExists(false)
        chickenLeg.reset(chicken.body.x ,chicken.body.y);   
        chickenLeg.body.velocity.y = +120;
    }

    // //  Grab the first leg we can from the pool
    // chickenLeg = chickenLegs.getFirstExists(false);
    // livingChickens1.length=0;
    // chickens.forEachAlive(function(chicken){
    //     // putting each chicken in the array
    //     livingChickens1.push(chicken);
    // });
    
    
    // if (chickenLeg && livingChickens1.length > 0)
    // {
    //     var random=game.rnd.integerInRange(0,livingChickens1.length-1);
    //     // randomly select one of them
    //     var shooter= livingChickens1[random];
    //     // And drop egg from this chicken
    //     game.physics.arcade.overlap(player, shooter, shooterChickenLeg, null, this);
        
    //     function shooterChickenLeg(player, shooter) {
    //         //when play hits chicken leg
    //         console.log("readi")
    //         chickenLeg = chickenLegs.getFirstExists(false);
    //         chickenLeg.reset(shooter.body.x, shooter.body.y);
    //         chickenLeg.body.velocity.y =+ 120;
    //     }
    
    // }

},



collisionChickenLegs: function (player, chickenLeg) {
    //when play hits chicken leg
    this.foodeat.play();
    chickenLeg.destroy();
    //Increase score each chicken killed
    score += 20;
    scoreText.text = scoreString + score;
},

collisionEggs: function(player, Egg) {
    //when player hits egg
    egg.kill();
    player.kill();
    bullets.kill()
    this.gameOver();
    //gameover
    // stateText.text = 'Game over';
    // stateText.visible=true;
},

collisionChickenPlayer: function(player, Chicken) {
    //when player hits chicken
    player.kill();
    bullets.kill();
    //gameover
    this.gameOver();
},

dropEggs: function () {

    //  Grab the first egg we can from the pool
    egg = eggs.getFirstExists(false);

    livingChickens.length=0;

    chickens.forEachAlive(function(chicken){

        // putting each chicken in the array
        livingChickens.push(chicken);
    });


    if (egg && livingChickens.length > 0)
    {
        
        var random=game.rnd.integerInRange(0,livingChickens.length-1);

        // randomly select one of them
        var shooter= livingChickens[random];
        // And drop egg from this chicken
        egg.reset(shooter.body.x+23, shooter.body.y+20);
        egg.body.velocity.y =+ 150;

        // game.physics.arcade.moveToObject(enemyBullet,player,120);
        firingTimer = game.time.now + 700;
    }

},

gameOver: function() {

        stateText.text= " Game Over\n\nYour score: " + score + " \n\nTap to restart";
        stateText.visible=true;
        game.paused = true;
        game.sound.stopAll();
        game.input.onDown.add(this.restartGame, this);

},


restartGame: function() {
    game.paused = false;
    score=0;
    game.state.start("Game");
},

winningGame: function() {
    game.state.start("Game");
}

};

