var Menu = {


    preload: function () {
        game.load.image('menu', './images/intro.jpg');
        
    },

    create: function () {
        menu = game.add.button(0,0,'menu', Menu.startGame, game.Menu);
        menu.height = game.height;
        menu.width = game.width;

    },

    startGame: function () {
        game.state.start('Game');
    }

};


