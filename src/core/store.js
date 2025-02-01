// Source:
//
// A store is a collection of data that can be accessed by name. It is a
// simple key-value store that can be used to store data that needs to be
// shared between components. The store should have the following methods:
// - create(name): create a new key-value pair in the store
// - read(name): read the value of a key from the store
// - update(name, value): update the value of a key in the store
// - delete(name): delete a key from the store
// - list(): return a list of all the keys in the store
// The store should be initialized with an optional initial state object.
// If an initial state object is provided, the store should be initialized with
// the values from the state object.

// The store should also support subscriptions. Subscriptions allow components to listen for changes to the store and update themselves when the store changes. The store should have the following subscription methods:
// - subscribe(name, callback): subscribe to changes to a specific key in the store
// - unsubscribe(name, callback): unsubscribe from changes to a specific key in the store


class Store {
  constructor() {
    this.store = {};
    this.subscribers = {};
  }

  create(name, value = null) {
    if (!this.store[name]) {
      this.store[name] = value;
      // this.store[`${name}_type`] = typeof value;
    } else {
      throw new Error(`"${name}" already exists in store, maybe you want to update it instead?`);
    }

  }

  /**
   * Update a key in the store with a new value.
   * If the key does not exist, an error will be thrown.
   * If the type of the new value does not match the type of the existing value, an error will be thrown.
   * If the new value is an array, it will be concatenated with the existing array.
   * If the new value is an object, it will be merged with the existing object.
   * @param {string} name The name of the key to update.
   * @param {*} value The new value for the key.
   * @returns {*} The new value of the key.
   */
  update(name, value) {
    var types = ["string", "number", "boolean", "undefined"];

    if (this.store[name]) {
      console.log("Store.update() called with name:", name);
      console.log("Store.update() called with value:", value);
      console.log(`${name} is typeof ${typeof name}`);
      console.log(`${value} is typeof ${typeof value}`);

      if (Array.isArray(value) && Array.isArray(this.store[name])) {
        console.log("Array detected for both");
        this.store[name] = [...this.store[name], ...value];
      } else if (typeof value === "object" && !Array.isArray(value)) {
        // Merge objects instead of overwriting
        console.log("Object detected for both");
        this.store[name] = Object.assign({}, this.store[name], value);
      } else if (types.includes(typeof value) && types.includes(typeof this.store[name])) {
        // Directly update for primitive types
        console.log("Primitive detected for both");
        this.store[name] = value;
      } else {
        throw new Error(
          `Type mismatch: cannot update "${name}" with a different type. Received ${Array.isArray(value) ? "array" : typeof value}, expected ${Array.isArray(this.store[name]) ? "array" : typeof this.store[name]}`
        );
      }

      if (this.subscribers[name]) {
        this.subscribers[name].forEach(callback => callback(this.store[name]));
      }


    } else {
      throw new Error(`Property "${name}" does not exist in the store.`);
    }
  }
  
  /**
   * Flush update a key in the store with a new value. Similar to update, but
   * does not merge the new value with the existing value. If the key does not
   * exist, an error will be thrown.
   * @param {string} name The name of the key to update.
   * @param {*} value The new value for the key.
   * @returns {*} The new value of the key.
   */
  flushUpdate(name, value) {
    if (this.store[name]) {
      if (typeof value !== typeof this.store[name]) {
        throw new Error(`Type mismatch: cannot update "${name}" with a different type`, typeof value, typeof this.store[name]);
      }
      
      this.store[name] = value;

      if (this.subscribers[name]) {
        this.subscribers[name].forEach(callback => callback(value));
      }

      return this.store[name];
    }
    throw new Error(`"${name}" does not exist in store, maybe create it first?`);
  }

  subscribe(name, callback) {
    if (this.store[name]) {
      if (!this.subscribers[name]) {
        this.subscribers[name] = [];
      }
      this.subscribers[name].push(callback);
    } else {
      throw new Error(`"${name}" does not exist in store, maybe create it first?`);
    }
  }

  unsubscribe(name, callback) {
    if (this.store[name]) {
      if (this.subscribers[name]) {
        this.subscribers[name] = this.subscribers[name].filter(cb => cb !== callback);
      } else {
        throw new Error(`Subscription to "${name}" not found`);
      }
    } else {
      throw new Error(`"${name}" does not exist in store, maybe create it first?`);
    }
  }

  read() {
    return this.store;
  }

  get(name) {
    console.log("Store.get() called with name:", name);
    console.log(`${name}: `, this.store[name]);
    return this.store[name];
  }

  getState() {
    return this.store;
  }

  delete(name) {
    if (this.store[name]) {
      delete this.store[name];
    } else {
      throw new Error(`Cannot delete "${name}" as it does not exist in store`);
    }
  }

  clear() {
    this.store = {};
    this.subscribers = {};
  }

  flush(name) {
    if (this.store[name]) {
      this.store[name] = null;
    } else {
      throw new Error(`"${name}" does not exist in store, maybe create it first?`);
    }
  }
}

export default Store;
