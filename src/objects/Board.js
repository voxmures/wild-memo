import Card from './Card';

const CARD_WIDTH = 75,
	  CARD_HEIGHT = 120;
const BOARD_ROWS = 4,
	  BOARD_COLS = 6;

class Board extends Phaser.Group {
	
	constructor(game, btn) {
		super(game);

		this._score = 0;
		this._streaks = [];
		this._streakIdx = 0;
		this._onStreak = false;

		this._totalScore = 0;

		this._spawn();

		this.game.time.events.add(Phaser.Timer.SECOND * 3, () => {
			this.getAll('exists', true).forEach((card) => {
				card.flip();
				this.setAll('inputEnabled', true)
			});
		}, this);

		btn.onInputDown.add(this._addStreak, this);
	}

	_spawn() {
		let availableCards = ['frog', 'fox', 'zebra', 'shark', 'owl'];
		let deck = [] // Min of two cards of every kind

		// Add new random cards to the deck from available cards
		for (let i = 0; i < 24; i++) {
			let idx = Math.floor(Math.random() * availableCards.length);
			deck.push(availableCards[idx]);
		}

		deck = this._shuffle(deck);
		
		//let leftMargin = (this.game.width - (CARD_WIDTH * BOARD_COLS)) / 2,
		//	topMargin = (this.game.height - (CARD_HEIGHT * BOARD_ROWS)) / 2;
		let leftMargin = 110,
			topMargin = 46;
		let wPadding = 24,
			hPadding = 8; 

		let k = 0;
		for (let i = 0; i < BOARD_ROWS; i++) {
			for (let j = 0; j < BOARD_COLS; j++) {

				let xPos = leftMargin + wPadding * j + (CARD_WIDTH + 1) * j,
					yPos = topMargin + hPadding * i + (CARD_HEIGHT + 1) * i;

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

	_addStreak() {
		if (this._streaks[this._streakIdx].qty >= 2) {
			this._onStreak = false;
			this._streakIdx += 1;
		}
	}


	_selectCard(card) {
		if (!card.isFlip) {
			card.flip();

			if (!this._onStreak) {
				// First card of streak
				this._streaks[this._streakIdx] = { key: card.frontKey, qty: 1, finished: false };
				this._onStreak = true;
				this._score += 10;
			}
			// else if (this._selectedCard == card.id) {
			// 	this._selectedCard = null;
			// }
			else if (this._checkMatch(card)) {
				this._streaks[this._streakIdx].qty += 1;
				this._score += 10;
			}
			else {
				this.setAll('inputEnabled', false);

				let streakScore = this._streaks.slice(0, this._streakIdx).reduce((total, streak) => { 
					return total + streak.qty }, 0);
				streakScore *=  this._streakIdx < 2 ? 1 : Math.min(this._streakIdx, 5);
				this._totalScore += this._score + streakScore;

				// Reset streaks info
				this._score = 0;
				this._streaks = [];
				this._onStreak = false;
				this._streakIdx = 0;

				this.callAll('kill');

				this._spawn();

				this.game.time.events.add(Phaser.Timer.SECOND * 3, () => {
					this.getAll('exists', true).forEach((card) => {
						card.flip();
						this.setAll('inputEnabled', true)
					});
				}, this);
			}

			console.log('Score', this._score, '. Total score:', this._totalScore);
		}
	}

	_checkMatch(card) {
		return this._streaks[this._streakIdx].key == card.frontKey;
	}
}

export default Board;