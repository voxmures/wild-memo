import Card from './Card';

const CARD_WIDTH = 125,
	  CARD_HEIGHT = 200;
const BOARD_ROWS = 2,
	  BOARD_COLS = 5;

class Board extends Phaser.Group {
	
	constructor(game) {
		super(game);

		this._selectedCard = null;

		this._spawn();

		this.game.time.events.add(Phaser.Timer.SECOND * 3, () => {
			this.getAll('exists', true).forEach((card) => {
				card.flip();
				this.setAll('inputEnabled', true)
			});
		}, this);
	}

	_spawn() {
		let availableCards = ['frog', 'fox', 'zebra', 'shark', 'owl'];

		let deck = this._shuffle(availableCards.concat(availableCards));
		
		let leftMargin = (this.game.width - (CARD_WIDTH * BOARD_COLS)) / 2,
			topMargin = (this.game.height - (CARD_HEIGHT * BOARD_ROWS)) / 2;

		let k = 0;
		for (let i = 0; i < BOARD_ROWS; i++) {
			for (let j = 0; j < BOARD_COLS; j++) {

				let xPos = leftMargin + (CARD_WIDTH + 1) * j,
					yPos = topMargin + (CARD_HEIGHT + 1) * i;

				this.add(new Card(this.game, xPos, yPos, deck[k], k, (card) => { this._selectCard(card); }));
				
				k++;
			}
		}
	}

	/*
	 Shuffle function extracted from https://bost.ocks.org/mike/shuffle/ 
	 It implements the Fisher-Yates shuffle algorithm, O(n) performance
	*/
	_shuffle(array) {
		var m = array.length, t, i;

		// While there remain elements to shuffle…
		while (m) {

			// Pick a remaining element…
			i = Math.floor(Math.random() * m--);

			// And swap it with the current element.
			t = array[m];
			array[m] = array[i];
			array[i] = t;
		}

		return array;
	}


	_selectCard(card) {
		if (!card.isMatch) {
			card.flip();

			console.log(this);
			if (this._selectedCard == null) {
				console.log('Caso 1');
				this._selectedCard = card.id;
			}
			else if (this._selectedCard == card.id) {
				console.log('Caso 2');
				this._selectedCard = null;
			}
			else if (this._checkMatch(card)) {
				console.log('Caso 3');
				//success++;
				this.getChildAt(this._selectedCard)._matched = card._matched = true;
				this._selectedCard = null;
			}
			else {
				console.log('Caso 4');
				//errors++;
				this.setAll('inputEnabled', false);
				this.game.time.events.add(Phaser.Timer.QUARTER, () => {
					this.getChildAt(this._selectedCard).flip();
					card.flip();
					this._selectedCard = null;
					this.setAll('inputEnabled', true);
				});
			}
		}
	}

	_checkMatch(card) {
		return this.getChildAt(this._selectedCard).frontKey == card.frontKey
	}
}

export default Board;