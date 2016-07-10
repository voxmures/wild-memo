var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var availableCards = ['frog', 'fox', 'zebra', 'shark'];

function preload() {
	game.load.image('frog', 'src/assets/img/frog_card_front.png');
	game.load.image('fox', 'src/assets/img/fox_card_front.png');
	game.load.image('zebra', 'src/assets/img/zebra_card_front.png');
	game.load.image('shark', 'src/assets/img/shark_card_front.png');

	game.load.image('back', 'src/assets/img/card_back.png');
};

var cards, faceDownCards;
var selectedCard = null,
	auxSelected = null;

var errors = 0,
	success = 0;

/*
 Shuffle function extracted from https://bost.ocks.org/mike/shuffle/ 
 It implements the Fisher-Yates shuffle algorithm, O(n) performance
*/
function shuffle(array) {
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
};

function spawn() {

	var CARD_WIDTH = 125,
		CARD_HEIGHT = 200;
	var BOARD_ROWS = 2,
		BOARD_COLS = 4;
	var MARGIN_LEFT = (game.width - (CARD_WIDTH * BOARD_COLS)) / 2,
		MARGIN_TOP = (game.height - (CARD_HEIGHT * BOARD_ROWS)) / 2;

	// Prepare the array of available cards to play.
	deck = availableCards.concat(availableCards);
	deck = shuffle(deck);

	faceDownCards = game.add.group(); // Layer of face down cards.
	cards = game.add.group();

	var k = 0;
	for (var i = 0; i < BOARD_ROWS; i++) {
		for (var j = 0; j < BOARD_COLS; j++) {
			var pos_x = MARGIN_LEFT + (CARD_WIDTH + 1) * j,
				pos_y = MARGIN_TOP + (CARD_HEIGHT + 1) * i;

			faceDownCards.create(pos_x, pos_y, 'back');	// Creates the back of the card.
			var card = cards.create(pos_x, pos_y, deck[k]);

			card.boardPos = { x: i, y: j }; // Set card position in board.
			card.matched = false;

			// Draws the clickable area.
			var g = game.add.graphics(0, 0);
			//g.lineStyle(2, 0x0000FF, 0.5); // Colour the lines of the rectangle to debug purposes.
			g.beginFill(0xFFFFFF, 0);
			g.drawRect(pos_x, pos_y, CARD_WIDTH, CARD_HEIGHT);
			g.endFill();

			g.card = card; // Assigns the current card to the clickable area.
			g.inputEnabled = true;
			g.events.onInputDown.add(selectCard, this);

			k++;
		}
	}
};

function create() {
	game.stage.backgroundColor = '#F5F5DC';
	game.input.mouse.capture = true;

	spawn();

	// Set timer to reverse the cards.
	game.time.events.add(Phaser.Timer.SECOND * 3, function() { 
		cards.setAll('visible', false) 
	}, this);
};

function selectCard (clickableArea) {
	var card = clickableArea.card;
	if (!card.matched) {
		card.visible = true;
		if (selectedCard == null) {
			selectedCard = card;
			selectedCard.visible = true;
		}
		else if (hasSamePosition(card)) {
			selectedCard.visible = false;
			selectedCard = null;
		}
		else if (checkMatch(card)) {
			success++;
			selectedCard.matched = card.matched = true;
			selectedCard = null;
		}
		else {
			errors++;
			auxSelected = card;
			game.time.events.add(Phaser.Timer.QUARTER, function() {
				selectedCard.visible = auxSelected.visible = false;
				selectedCard = auxSelected = null;
			}, this);
		}
	}
};

// Check if the card passed as parameter has the same position in board as the selected one.
function hasSamePosition (card) {
	return (selectedCard.boardPos.x == card.boardPos.x && selectedCard.boardPos.y == card.boardPos.y);
};

// Check if the card passed as parameter matches with the selected one (both have same key).
function checkMatch (card) {
	if (selectedCard.key != card.key)
		return false;
	return true;
};

function update() {
	var selectedCardName = (selectedCard == null ? 'none' : selectedCard.key);
	game.debug.text('Card selected: ' + selectedCardName, 400, 20);
	game.debug.text('Errors: ' + errors, 400, 40);
	game.debug.text('Success: ' + success, 400, 60);
};