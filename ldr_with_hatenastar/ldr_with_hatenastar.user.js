// ==UserScript==
// @name           LDR with HatenaStar
// @namespace      http://ma.la/
// @description    add HatenaStar to LDR
// @include        http://reader.livedoor.com/reader/
// ==/UserScript==

(function(){
	var w = typeof unsafeWindow != "undefined" ? unsafeWindow : window;
	var initialized = false;
	var s = document.createElement('script');
	s.src = 'http://s.hatena.ne.jp/js/HatenaStar.js';
	s.charset = 'utf-8';
	document.body.appendChild(s);
	var t = setInterval(function(){
		if(w.Hatena){
			init();
			initialized = true;
			clearInterval(t);
		}
	}, 100);
	function init(){
		w.Hatena.Star.EntryLoader.headerTagAndClassName = ['h2', 'item_title'];
		w.Keybind.add('H', function(){
			new w.Hatena.Star.EntryLoader();
		});
	}
})();

