var $ = require('jquery');
var instance = null;

/**
 * Core Class for Website
 * @class Core
 */
var Core = function() {
    
    /**
     * jQuery window reference
     *
     * @type {jQuery.Element}
     */
    this.$window = $(window);

    /**
     * jQuery document reference
     *
     * @type {jQuery.Element}
     */
    this.$document = $(document);
};

/**
 * returns a singletone instance of Core-Class
 * @method getInstance
 */
var getInstance = function() {
    if (!instance) {
        instance = window.core = new Core();
    }

    return instance;
};

module.exports = getInstance();
