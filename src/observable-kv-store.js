// State store for e.g. class properties

const store = Symbol('store');
const observers = Symbol('observers');

/**
 * Internal mutation tracking class
 *
 * @class Entity
 */
class Entity {
	constructor(key, value, newValue) {
		this.key = key;
		this.value = value;
		this.newValue = newValue;
	}
}


/**
 * kvStore class
 *
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
	 * @param {(string|number|symbol)} key identifier like a property key
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
	 * @param {(string|number|symbol)} key identifier like a property key
	 * @param {*} newValue new value associated with the key
	 * @returns {Promise} resolves undefined if successful, rejects if error
	 * @memberof kvStore
	 */
	set(key, newValue) {
		const entity = new Entity(key, this[store].get(key), newValue);

		return new Promise((resolve, reject) => {
			if (typeof entity.newValue === 'undefined') {
				if (this[store].delete(entity.key)) {
					resolve();
				}
				else {
					reject(new Error('Key was not found'));
				}
			}
			else {
				this[store].set(entity.key, entity.newValue);
				resolve();
			}

		}).then(this.notify(entity));
	}

	/**
	 * Deletes a value with a key in the store.
	 *
	 * @param {(string|number|symbol)} key identifier like a property key
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
				reject(new Error('Key was not found'));
			}
		}).then(this.notify(entity));
	}

	/**
	 * Subscibe to be notified if the store was mutated.
	 *
	 * @param {Function} callback will be invoked upon mution
	 * @returns {Error|null} error if the provied callback is not a function
	 * @memberof kvStore
	 */
	observe(callback) {
		if (typeof callback !== 'function') { return new Error('Callback should be of type \'function\''); }

		this[observers].add(callback);

		return null;
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
