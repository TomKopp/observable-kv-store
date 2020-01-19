import { Entity } from './entity';
// State store for e.g. class properties

const store = Symbol('store');
const observers = Symbol('observers');

/**
 * kvStore class
 *
 * @module observable-kv-store/kvStore
 * @typedef {(string|number|symbol)} PropertyKey
 * @exports
 * @class kvStore
 */
const kvStore = Object.seal(class kvStore {

	/**
	 * Creates an instance of kvStore.
	 *
	 * @memberof kvStore
	 */
	constructor() {
		this[store] = new Map();
		this[observers] = new Set();
	}

	/**
	 * Get the stored value.
	 *
	 * @param {PropertyKey} key identifier, like a property key
	 * @returns {Promise} resolves with value for the associated key, or undefined
	 * @memberof kvStore
	 */
	get(key) {
		return Promise.resolve(this[store].get(key));
	}

	/**
	 * Sets a value with a key in the store.
	 * If value is undefined it is deleted.
	 *
	 * @param {PropertyKey} key identifier, like a property key
	 * @param {*} value new value associated with the key
	 * @returns {Promise} resolves undefined if successful, rejects if error
	 * @memberof kvStore
	 */
	set(key, value) {
		const entity = new Entity(key, this[store].get(key), value);

		return new Promise((resolve, reject) => {
			if (typeof entity.value === 'undefined') {
				if (this[store].delete(entity.key)) {
					resolve();
				}
				else {
					reject(new Error('Key was not found.'));
				}
			}
			else {
				this[store].set(entity.key, entity.value);
				resolve();
			}

		}).then(this.notify(entity));
	}

	/**
	 * Deletes a value with a key in the store.
	 *
	 * @param {PropertyKey} key identifier, like a property key
	 * @returns {Promise} resolves undefined if successful, rejects if error
	 * @memberof kvStore
	 */
	delete(key) {
		const entity = new Entity(key, this[store].get(key));

		return new Promise((resolve, reject) => {
			if (this[store].delete(entity.key)) {
				resolve();
			}
			else {
				reject(new Error('Key was not found.'));
			}
		}).then(this.notify(entity));
	}

	/**
	 * Subscibe to be notified if the store was mutated.
	 *
	 * @param {Function} callback will be invoked upon mutation
	 * @returns {Promise} resolves undefined if successful, rejects if error
	 * @memberof kvStore
	 */
	observe(callback) {
		return new Promise((resolve, reject) => {
			if (typeof callback === 'function') {
				this[observers].add(callback);
				resolve();
			}
			else {
				reject(new TypeError('Callback should be of type \'function\'.'));
			}
		});
	}

	/**
	 * Subscibe to be notified if the store was mutated.
	 *
	 * @param {Function} callback will be invoked upon mutation
	 * @returns {Promise} resolves undefined if successful, rejects if error
	 * @memberof kvStore
	 */
	disconnect(callback) {
		return new Promise((resolve, reject) => {
			if (this[observers].delete(callback)) {
				resolve();
			}
			else {
				reject(new Error('Callback was not registered.'));
			}
		});
	}

	/**
	 * Notifies subscribers by calling them in order of insertion.
	 *
	 * @private
	 * @param {Entity} entity Entity obj
	 * @memberof kvStore
	 */
	notify(entity) {
		this[observers].forEach((observer) => observer(entity));
	}
});

export { kvStore };
