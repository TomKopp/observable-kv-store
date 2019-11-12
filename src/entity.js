/**
 * Internal mutation tracking class
 *
 * @class Entity
 */
export class Entity {

	/**
	 * Constructor
	 *
	 * @param  {(string|number|symbol)} key key identifier, like a property key
	 * @param  {*} oldValue value that is accociated with the key
	 * @param  {*} value current value associated with the key
	 * @returns {Entity} constructed Entity
	 * @memberof Entity
	 */
	constructor(key, oldValue, value) {
		this.key = key;
		this.oldValue = oldValue;
		this.value = value;
	}
}
