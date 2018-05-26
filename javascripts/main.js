var game;
var game = new Phaser.Game(
    800, 600,
    Phaser.AUTO,
    'ironHack spaceinvaders');

game.state.add('Menu', Menu);

game.state.add('Game', Game);

game.state.start('Menu');

