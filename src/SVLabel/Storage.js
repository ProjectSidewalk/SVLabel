var svl = svl || {};

/**
 * LocalStorage class constructor
 * @param JSON
 * @param params
 */
function Storage(JSON, params) {
    var self = {'className': 'Storage'};

    if (params && 'storage' in params && params.storage == 'session') {
        self.storage = window.sessionStorage;
    } else {
        self.storage = window.localStorage;
    }

    /**
     * Returns the item specified by the key
     * @param key
     */
    function get(key) {
        return JSON.parse(self.storage.getItem(key));
    }

    /**
     * Stores a key value pair
     * @param key
     * @param value
     */
    function set(key, value) {
        self.storage.setItem(key, JSON.stringify(value));
    }

    // Create an array to store staged submission data (if there hasn't been one)
    if (!get("staged")) {
        set("staged", []);
    }

    self.get = get;
    self.set = set;
    return self;
}