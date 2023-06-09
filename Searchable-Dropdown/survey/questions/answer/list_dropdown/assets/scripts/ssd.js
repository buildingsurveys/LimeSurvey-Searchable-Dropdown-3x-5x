

function initSSD(sgq, searchMode, dropdownWidth) {
	var sgqArr = sgq.split('X');
	var qID = sgqArr[2];
	var thisQuestion = $('#question'+qID);

	// Set default values for the parameter
	searchMode = searchMode || 'contains';
	config = {};
	if (searchMode == 'starts') config.matcher = matchStart;
	if (dropdownWidth > 0) config.width = `${dropdownWidth}%`

	// Initiate select2
	$('select.form-control', thisQuestion).select2(config);
}

function stripDiacritics (text) {
	// Used 'uni range + named function' from http://jsperf.com/diacritics/18
	function match(a) {
	  return DIACRITICS[a] || a;
	}

	return text.replace(/[^\u0000-\u007E]/g, match);
}

function matchStart (params, data) {
	// Always return the object if there is nothing to compare
	if ($.trim(params.term) === '') {
	  return data;
	}

	// Do a recursive check for options with children
	if (data.children && data.children.length > 0) {
	  // Clone the data object if there are children
	  // This is required as we modify the object to remove any non-matches
	  var match = $.extend(true, {}, data);

	  // Check each child of the option
	  for (var c = data.children.length - 1; c >= 0; c--) {
		var child = data.children[c];

		var matches = matchStart(params, child);

		// If there wasn't a match, remove the object in the array
		if (matches == null) {
		  match.children.splice(c, 1);
		}
	  }

	  // If any children matched, return the new object
	  if (match.children.length > 0) {
		return match;
	  }

	  // If there were no matching children, check just the plain object
	  return matchStart(params, match);
	}

	var original = stripDiacritics(data.text).toUpperCase();
	var term = stripDiacritics(params.term).toUpperCase();

	// Check if the text starts with the term
	if (original.indexOf(term) == 0) {
	  return data;
	}

	// If it doesn't contain the term, don't return anything
	return null;
}

$(document).on('ready pjax:scriptcomplete',function(){
});