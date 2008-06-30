// ==UserScript==
// @name          Focus Field
// @namespace     http://libelabo.jp/
// @description   Focus on Field in turn
// @include       *
// @version       0.1
// ==/UserScript==

(function() {
	
	var BIND_KEY = '/';

	var firefox;
	if(typeof unsafeWindow != 'undefined'){
		// firefox
		firefox = true;
	}else {
		// not firefox
		firefox = false;
	}

	var currentField = 0;
	var fields = null;
	function FocusFirstField() {
		if (!window.content.document) return;
		fields = (fields==null) ? document.evaluate('//input[@type="text"] | //textarea',document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null) : fields ;
		if (!fields.snapshotLength) return;
		if (currentField >= fields.snapshotLength){
			currentField = 0;
		}
		fields.snapshotItem(currentField).focus();
		fields.snapshotItem(currentField).select();
		currentField++;
	}

	// Thanks to SBMCommentViewer
	var skipEl = {'input': false, 'button': true, 'select': true, 'textarea': false, 'password': false};
	window.addEventListener('keypress', function(e) {
		if (skipEl[e.target.tagName.toLowerCase()]) {return;}
		var key = ''
		  + ((e.ctrlKey)  ? 'C' : '')
			+ ((e.shiftKey) ? 'S' : '')
			  + ((e.altKey || e.metaKey)   ? 'A' : '')
				+ '-';
		if(firefox){
			key += String.fromCharCode(e.charCode).toLowerCase();
		}else{
			key += String.fromCharCode(e.keyCode).toLowerCase();
		}
		if (key == "C-"+BIND_KEY){
			FocusFirstField();
		}
	}, false);

})();
