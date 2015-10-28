let game;
import Main from './classes/states/Main';

const init = () => {
	console.log('teerling');
	game = new Phaser.Game(600, 600, Phaser.AUTO); //phaser.auto kijkt automatisch wat je browser aankan bvb webgl
	game.state.add('Main', Main, false); // 1 naam geven, 2 verwijzen(state) 3 autostart
	game.state.start('Main');
};

init();