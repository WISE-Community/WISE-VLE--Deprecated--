
/**
 * Registers new i18n prototype to VLEView
 */
View.prototype.i18n = {
		locales:[]
};

/**
 * Returns translated value of the given key.
 * Uses locale that was specified in config. To specify
 * locale, use View.prototype.i18n.getString(key,locale) directly instead.
 * @param key
 * @return
 */
View.prototype.getI18NString = function(key) {
	return this.i18n.getString(key,this.config.getConfigParam("locale"));	
};

/**
 * Injects provided params into the translated string
 * key is the key used to lookup the value in i18n_XX.js file
 * params is an array of values to replace in the translated string.
 * the translated string should have the same number of replaceable elements as in the params
 * ex. params: ['goodbye', 'hello']
 * translated string: 'You say {0}, I say {1}'
 * 
 * Uses locale that was specified in config. To specify
 * locale, use View.prototype.i18n.getStringWithParam(key,locale,params) directly instead.
 */
View.prototype.getStringWithParams = function(key,params) {
	return this.i18n.getStringWithParams(key,this.config.getConfigParam("locale"),params);		
};

View.prototype.i18n.defaultLocale = "en_US";

//"ja","zh_TW",
View.prototype.i18n.supportedLocales = [
                                        "en_US","ja","zh_TW","nl_NL"
                                        ];

/**
 * key is the key used to lookup the value in i18n_XX.js file
 * locale is which locale to use. will be appended in i18n_[locale].js
 * if local does not exist, use defaultLocale
 * if key is not found, use defaultLocale's values
 */
View.prototype.i18n.getString = function(key,locale) {
	// if specified locale does not exist, use default locale
	if (View.prototype.i18n.supportedLocales.indexOf(locale) == -1) {
		locale = View.prototype.i18n.defaultLocale;
	}
	if (this[locale][key] !== undefined) {
		return this[locale][key].value;
	} else {
		return this[View.prototype.i18n.defaultLocale][key].value;		
	}
};


/**
 * Injects provided params into the translated string
 * key is the key used to lookup the value in i18n_XX.js file
 * locale is which locale to use. will be appended in i18n_[locale].js
 * params is an array of values to replace in the translated string.
 * the translated string should have the same number of replaceable elements as in the params
 * ex. params: ['goodbye', 'hello']
 * translated string: 'You say {0}, I say {1}'
 * if local does not exist, use defaultLocale
 * if key is not found, use defaultLocale's values
 */
View.prototype.i18n.getStringWithParams = function(key,locale,params) {
	// first get translated string
	var translatedString = this.getString(key,locale);
	
	// then go through the string and replace {0} with paramas[0], {1} with params[1], etc.
	for (var i=0; i< params.length; i++) {
		var lookupString = "{"+i+"}";
		var replaceString = params[i];
		translatedString = translatedString.replace(lookupString,replaceString);
	}
	return translatedString;
};

/**
 * Synchronously retrieves specified locale json mapping file
 */
View.prototype.retrieveLocale = function(locale) {
	var localePath = "view/i18n/i18n_" + locale + ".json";
	$.ajax({"url":localePath,
		    async:false,
		    dataType:"json",
			success:function(obj){
				View.prototype.i18n[locale] = obj;
			},
			error:function(){}
	});	
};

/**
 *  retrieve i18n file based on VLE config. 
 *  first retrieves default locale and then retrieves user's locale.
 */
View.prototype.retrieveLocales = function() {
	// retrieve default locale
	this.retrieveLocale(View.prototype.i18n.defaultLocale);
	
	// retrieve user locale, if exists
	var userLocale = this.config.getConfigParam("locale");		
	if (userLocale != View.prototype.i18n.defaultLocale) {
		for (var i=0; i < View.prototype.i18n.supportedLocales.length; i++) {
			var locale = View.prototype.i18n.supportedLocales[i];
			if (locale == userLocale) {
				View.prototype.i18n[locale] = {};
				this.retrieveLocale(locale);
			}
		};
	};
	eventManager.fire('retrieveLocalesComplete');
};

/* used to notify scriptloader that this script has finished loading */
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/i18n/view_i18n.js');
};
