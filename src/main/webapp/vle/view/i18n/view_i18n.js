
/**
 * Registers new i18n prototype to VLEView
 */
View.prototype.i18n = {
		locales:[]
};

// default locale, in case all else fails...this guy will save the day.
View.prototype.i18n.defaultLocale = "en_US";

/**
 * Map dictionary of supportedLocales and their equivalent locale codes that WISE knows about.
 * For example, nl_NL and nl_BG are both nederlands, and should map to locale "nl", which WISE knows about.
 * WISE doesn't know about nl_NL and nl_BG translations (yet).
 * This saves us from having to write out two translation files 
 * (unless we want to translate to nl_NL and nl_BG...we can certainly do this also, but probably unlikely. "nl" should
 * be sufficient for both parties)
 */  
View.prototype.i18n.supportedLocales = {
		"en_US":"en_US",
		"ja":"ja",
		"zh_TW":"zh_TW",
		"nl":"nl",
		"nl_NL":"nl",
		"nl_BG":"nl"
};

/**
 * Given a locale, like "nl_NL" or "nl_BG", returns a canonical, supported locale, if exists, like "nl", in this case.
 * If it doesn't exist, return locale.
 */
View.prototype.i18n.convertToSupportedLocale = function(locale) {
	console.log("converting");
	if (this.localeConversions[locale] != null) {
		return this.localeConversions[locale];
	} else {
		return locale;
	}
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

/**
 * key is the key used to lookup the value in i18n_XX.js file
 * locale is which locale to use. will be appended in i18n_[locale].js
 * if local does not exist, use defaultLocale
 * if key is not found, use defaultLocale's values
 */
View.prototype.i18n.getString = function(key,locale) {
	if (View.prototype.i18n.supportedLocales[locale] != null) {
		// convert locale to a locale that WISE knows about
		locale = View.prototype.i18n.supportedLocales[locale];
	} else {
		// if specified locale does not exist, use default locale
		locale = View.prototype.i18n.defaultLocale;
	}
	if (this[locale][key] !== undefined) {
		return this[locale][key].value;
	} else if (this[View.prototype.i18n.defaultLocale][key] !== undefined) {
		return this[View.prototype.i18n.defaultLocale][key].value;		
	} else {
		return "N/A";
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
		if (View.prototype.i18n.supportedLocales[userLocale] != null) {
			var locale = View.prototype.i18n.supportedLocales[userLocale];
			View.prototype.i18n[locale] = {};
			this.retrieveLocale(locale);
		}
	}
	eventManager.fire('retrieveLocalesComplete');
};

/**
 * Finds any DOM elements with i18n and i18n-title attributes and inserts
 * translation text as the inner html and/or title for each element.
 * @param onComplete Callback function to run when i18n insertion is complete.
 */
View.prototype.insertTranslations = function(onComplete){
	var view = this;
	// process and insert i18n text
	var count = $('[i18n], [i18n-title]').length;
	$('[i18n], [i18n-title]').each(function(){
		// get i18n and i18n-title attributes from elements
		var i18n = $(this).attr('i18n'), i18nTitle = $(this).attr('i18n-title');
		
		// insert i18n translations
		if (typeof i18n !== 'undefined' && i18n !== false) {
			$(this).html(view.getI18NString(i18n));
		}
		if (typeof i18nTitle !== 'undefined' && i18nTitle !== false) {
			$(this).attr('title',view.getI18NString(i18nTitle));
		}
		// remove i18n attributes from DOM element
		$(this).removeAttr('18n').removeAttr('i18n-title');
		// when all i18n text has been inserted, run the callback function
		if(--count == 0){
			if(typeof onComplete === 'function'){
				onComplete();
			}
		}
	});
};


/* used to notify scriptloader that this script has finished loading */
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/i18n/view_i18n.js');
};
