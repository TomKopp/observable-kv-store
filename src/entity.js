/**
 * Internal mutation tracking class
 *
 * @module observable-kv-store/Entity
 * @typedef {import('./observable-kv-store.js').PropertyKey} PropertyKey
 * @class Entity
 */
export class Entity {

	/**
	 * Constructor
	 *
	 * @param  {PropertyKey} key identifier, like a property key
	 * @param  {*} oldValue value that was accociated with the key
	 * @param  {*} value current value associated with the key
	 * @memberof Entity
	 */
	constructor(key, oldValue, value) {
		this.key = key;
		this.oldValue = oldValue;
		this.value = value;
	}
}
