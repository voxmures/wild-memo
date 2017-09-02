import Board from 'objects/Board';

class GameState extends Phaser.State {

	preload() {
		this.game.load.image('frog', 'assets/img/frog.png');
		this.game.load.image('fox', 'assets/img/fox.png');
		this.game.load.image('owl', 'assets/img/owl.png');
		this.game.load.image('shark', 'assets/img/shark.png');
		this.game.load.image('zebra', 'assets/img/zebra.png');		
		this.game.load.image('back', 'assets/img/back.png');

		this.game.load.image('board', 'assets/img/board.png');

		this.game.load.image('btn_streak', 'assets/img/btn_streak.png');
	}

	create() {
		this.game.stage.backgroundColor = '#785a35';
		this.game.add.image(12, 6, 'board');

		let btn = this.game.add.button(0, 0, 'btn_streak');

		this.game.input.mouse.capture = true;

		let board = new Board(this.game, btn);
	}

}

export default GameState;
