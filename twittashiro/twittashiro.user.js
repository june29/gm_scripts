// ==UserScript==
// @name           Twittashiro
// @namespace      http://22century.cute.bz/
// @description    Twitter TimeLine asynchronous reload
// @include        http://twitter.com/home
// ==/UserScript==

( function () 
{
	// setting
	var __interval = 1; // minutes
	var __reloadvalue   = "\u66F4\u65B0\u3059\u308B"; // button value
	
	var __d = document;
	var table_timeline = __d.getElementById("timeline");
	var input_update   = __d.getElementById("update-submit");
	var input_reload   = __d.createElement("input");
	
	var dval = {
		timer  : null,
		unread : 0,
		title  : String(__d.title),
		disfocus : false
	};
	
	with ( input_reload ) {
		type = "button";
		className = "update-button";
		style.marginLeft = "1em";
		value = __reloadvalue;
		addEventListener("click", LordOfTashiro ,false);
	}
	
	var input_lamp = input_reload.cloneNode(true);
	input_lamp.style.width = "4em";
	setLampDisable(true);
	
	input_lamp.addEventListener("click", function(){
		if ( dval.timer != null ) {
			setLampDisable(true);
			clearInterval(dval.timer);
			dval.timer = null;
		} else {
			setLampDisable(false);
			dval.timer = setInterval( LordOfTashiro, __interval * 60 * 1000 );
		}
	}, false);
	
	input_update.parentNode.appendChild(input_reload);
	input_update.parentNode.appendChild(input_lamp);
	
	window.addEventListener("focus", function(){
		dval.disfocus = false;
		dval.unread = 0;
		__d.title = dval.title;
	} ,false);
	
	window.addEventListener("blur" , function(){
		dval.disfocus = true;
	} ,false);
	
	
	function setReloadDisable ( dis ) {
		input_reload.disabled = dis ? true : false;
		input_reload.style.opacity = dis ? 0.5 : 1;
	}
	
	function setLampDisable ( dis ) {
		if ( dis ) {
			input_lamp.style.background = "#808080";
			input_lamp.style.border = "outset 1px";
			input_lamp.style.opacity = 0.5;
			input_lamp.value = "OFF";
		} else {
			input_lamp.style.background = "#3cb371";
			input_lamp.style.border = "inset 1px";
			input_lamp.style.opacity = 1;
			input_lamp.value = "ON";
		}
	}
	
	function LordOfTashiro () 
	{
		var req = new XMLHttpRequest();
		var lastid = __d.evaluate('//tr', table_timeline, null, 9, null).singleNodeValue.id;
		setReloadDisable(true);
		req.open( 'GET', "http://twitter.com/home", true );
		req.onreadystatechange = function ()
		{
			if ( req.readyState == 4) 
			{
				if( req.status == 200 ) {
					var res = req.responseText;
					res = res.substring( res.indexOf("<table"), res.length );
					res = res.substring( 0, res.lastIndexOf("</table>") );
					res = res.replace(/<\/?table[^>]+>/,'');
					table_timeline.innerHTML = res;
					
					var tr_timeline = __d.evaluate('//tr', table_timeline, null, 5, null);
					var tr_this;
					
					while ( tr_this = tr_timeline.iterateNext() ) {
						if ( lastid == tr_this.id ) break;
						if ( dval.unread < 20 ) ++dval.unread;
					}
					
					if ( dval.disfocus && dval.unread > 0 ) {
						__d.title = [dval.title,"[",dval.unread,"]"].join("");
					}
				}
				setReloadDisable(false);
			}
		};
		req.send(null);
		return null;
	}
} )();
