class Card extends Phaser.Sprite {
	
	constructor(game, x, y, key, id, cb_onInputDown) {
		super(game, x, y, key);
		this.angle += (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 2 + 1);

		this._frontKey = key;
		this._id = id;

		this._isFlip = false;

		//this.inputEnabled = true;
		this.events.onInputDown.add(cb_onInputDown, this);
	}

	flip() {
		if (this.key === 'back') {
			this._isFlip = true;
			this.loadTexture(this._frontKey, 0, false);
		}
		else {
			this.loadTexture('back', 0, false);
		}
	}

	get id() { return this._id; }

	get frontKey() { return this._frontKey; }

	get isFlip() {	return this._isFlip; }
	
}

export default Card;