import Board from 'objects/Board';

class GameState extends Phaser.State {

	preload() {
		this.game.load.image('frog', 'assets/img/frog.png');
		this.game.load.image('fox', 'assets/img/fox.png');
		this.game.load.image('owl', 'assets/img/owl.png');
		this.game.load.image('shark', 'assets/img/shark.png');
		this.game.load.image('zebra', 'assets/img/zebra.png');		
		this.game.load.image('back', 'assets/img/back.png');		
	}

	create() {
		this.game.stage.backgroundColor = '#F5F5DC';
		this.game.input.mouse.capture = true;

		let board = new Board(this.game);
	}

}

export default GameState;
