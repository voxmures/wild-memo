class Card extends Phaser.Sprite {
	
	constructor(game, x, y, key, id, cb_onInputDown) {
		super(game, x, y, key);

		this._frontKey = key;
		this._id = id;

		this._isMatch = false;

		//this.inputEnabled = true;
		this.events.onInputDown.add(cb_onInputDown, this);
	}

	flip() {
		if (this.key === 'back') {
			this.loadTexture(this._frontKey, 0, false);
		}
		else {
			this.loadTexture('back', 0, false);
		}
	}

	get id() { return this._id; }

	get frontKey() { return this._frontKey; }

	get isMatch() {	return this._matched; }
	
}

export default Card;