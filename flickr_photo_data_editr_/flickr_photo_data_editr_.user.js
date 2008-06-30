// ==UserScript==
// @name           Flickr Photo Data Editr for AutoPagerize
// @namespace      http://d.hatena.ne.jp/Meguu
// @include        http://www.flickr.com/photos/*
// @version        0.3
// @last_modified  2008/6/17
// ==/UserScript==

(function (){
	//Script Element
	var scriptElementXPath = ".//script";

	/* addFilter version */
	window.AutoPagerize.addFilter(function(docs) {
		var scripts = document.evaluate(
			scriptElementXPath, docs[0], null,
			XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		
		//Evalute Scripts
		for(var i=0; i<scripts.snapshotLength; i++) {
			try {
				var scrstr = scripts.snapshotItem(i).textContent;
				//enable title
				if(scrstr.match(/insitu_init_page_photos_user_title_div\('([0-9]+)', 240\);/)) {
					var pid = RegExp.$1;
					unsafeWindow.insitu_init_page_photos_user_title_div("" + pid, 240);
				}
				//enable description
				else if(scrstr.match(/insitu_init_page_photos_user_description_div\('([0-9]+)', 240\);/)) {
					var pid = RegExp.$1;
					unsafeWindow.insitu_init_page_photos_user_description_div("" + pid, 240);
				}
				//create hash
				else if(scrstr.match(/global_photos\[/)) {
					var scrstr = scrstr.split("\n");
					scrstr[1].match(/global_photos\['([0-9]+)'\] = new Object\(\);/);
					var pid = RegExp.$1;
					unsafeWindow.global_photos["" + pid] = new Object();
					scrstr[2].match(/global_photos\['[0-9]+'\]\.title = '(.*)';$/);
					var title = RegExp.$1;
					unsafeWindow.global_photos["" + pid].title = title;
					scrstr[3].match(/global_photos\['[0-9]+'\]\.description = '(.*)';$/);
					var description = RegExp.$1;
					unsafeWindow.global_photos["" + pid].description = description;
				}
			}
			catch(error) {
			}
		}
	});
})();
