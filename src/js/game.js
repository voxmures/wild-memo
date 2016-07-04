var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('frog', 'src/assets/img/frog_card_front.png');
	game.load.image('fox', 'src/assets/img/fox_card_front.png');
	game.load.image('zebra', 'src/assets/img/zebra_card_front.png');
};

var cards;
var selectedCard = null;

var errors = 0,
	success = 0;

function spawn() {

	var CARD_WIDTH = 125,
		CARD_HEIGHT = 200;
	var BOARD_ROWS = 2,
		BOARD_COLS = 3;
	var MARGIN_LEFT = (game.width - (CARD_WIDTH * BOARD_COLS)) / 2,
		MARGIN_TOP = (game.height - (CARD_HEIGHT * BOARD_ROWS)) / 2;

	debugger;

	var availableCards = game.cache.getKeys(Phaser.Cache.IMAGE);
	cards = game.add.group();

	for (var i = 0; i < BOARD_ROWS; i++) {
		for (var j = 0; j < BOARD_COLS; j++) {
			var pos_x = MARGIN_LEFT + (CARD_WIDTH + 1) * j,
				pos_y = MARGIN_TOP + (CARD_HEIGHT + 1) * i;

			var card = cards.create(pos_x, pos_y, availableCards[j]);
			card.inputEnabled = true;
			card.events.onInputDown.add(selectCard, this);

			card.boardPos = { x: i, y: j }; // Set card position in board.
		}
	}
};

function create() {
	game.stage.backgroundColor = '#F5F5DC';
	game.input.mouse.capture = true;

	spawn();
};

function selectCard (card) {
	if (selectedCard == null)
		selectedCard = card;
	else if (hasSamePosition(card))
		selectedCard = null;
	else if (checkMatch(card)) {
		success++;
		selectedCard = null;
	}
	else {
		errors++;
		selectedCard = null;
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