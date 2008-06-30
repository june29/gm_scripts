// ==UserScript==
// @name           foko3
// @namespace      http://june29.jp/
// @include        *
// @author         june29
// @version        0.20080430
// ==/UserScript==

// 20080430 - release

(function() {
    var BIND_KEY = "C-m";

    var debug = false;

    var tako3url = 'http://tako3.com/json/likely/';
    var fooourl  = 'http://fooo.name/tako3/json/likely/';
    var apiurls = [tako3url, fooourl];

    var loadedCount = 0;
    var displayed = false;
    var started = false;

    var urls = [];

    var urlsPanel = document.createElement('div');
    urlsPanel.setAttribute('id', 'urlsPanel');

    urlsPanel.style.display = 'none';

    GM_addStyle(<><![CDATA[
        div#urlsPanel {
            background-color:white !important;
            background-image:none !important;
            border-left-color:#666666 !important;
            border-left-style:solid !important;
            border-left-width:1px !important;
            border-top-color:#666666 !important;
            border-top-style:solid !important;
            border-top-width:1px !important;
            bottom:0px !important;
            color:#333333 !important;
            font-size:100% !important;
            opacity:0.9 !important;
            overflow-x:auto !important;
            overflow-y:auto !important;
            padding-left:0px !important;
            padding-right:0px !important;
            position:fixed !important;
            right:0px !important;
            text-align:left !important;
            z-index:1000 !important;
        }
        div#urlsPanel ul {
            padding: 0 20px !important;
            list-style: none !important;
            list-style-position: outside !important;
        }
        div#urlsPanel ul li a {
            padding: 2px !important;
            color: #000 !important;
            text-decoration: none !important;
        }
        div#urlsPanel ul li a:hover {
            color: #fff !important;
            background-color: #000 !important;
        }
        p.loadingMessage {
            padding: 0 20px !important;
        }
    ]]></>);

    document.body.appendChild(urlsPanel);

    Array.prototype.inArray = function (value) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return true;
            }
        }
        return false;
    };

    tako3 = function(array) {
        for(var i = 0; i< array.length; i++) {
            url1 = array[i];
            url2 = url1.match(/\/$/) ? url1.replace(/\/$/, '') : url1 + '/';
            if(!urls.inArray(url1) && !urls.inArray(url2)) {
                urls.push(array[i]);
            }
        }
    }

    load = function(url) {
        GM_xmlhttpRequest({
            method: "GET",
            url:    url,
            onload: function(res){
                eval(res.responseText);
                loadedCount++;
                if(loaded()) createList();
            }
        });
    }

    loaded = function() {
        return (loadedCount == apiurls.length*2) ? true : false;
    }

    start = function() {
        for(var i = 0; i < apiurls.length; i++) {
            href1 = location.href;
            href2 = href1.match(/\/$/) ? href1.replace(/\/$/, '') : href1 + '/'
            load(apiurls[i] + href1);
            load(apiurls[i] + href2);
        }
    }

    var skipEl = {'input': true, 'button': true, 'select': true, 'textarea': true, 'password': true};
    window.addEventListener('keypress', function(e) {
        if (skipEl[e.target.tagName.toLowerCase()]) return;
        var key = ''
            + ((e.ctrlKey)  ? 'C' : '')
            + ((e.shiftKey) ? 'S' : '')
            + ((e.altKey || e.metaKey)   ? 'A' : '')
            + '-';
        key += String.fromCharCode(e.charCode).toLowerCase();
        if (key == BIND_KEY) toggle();
    }, false);

    function createList() {
        if(loaded() && !displayed) {
            if(urlsPanel.hasChildNodes()) {
                if(urlsPanel.firstChild.className == 'loadingMessage') {
                    if(debug) console.log("remove message");
                    urlsPanel.removeChild(urlsPanel.firstChild);
                }
            }
            ul = document.createElement('ul');
            if(urls.length > 0 ) ul.setAttribute('style', 'height: 600px');
            urlsPanel.appendChild(ul);
            for(var i=0; i<urls.length; i++) {
                li = document.createElement('li');
                a  = document.createElement('a');
                a.appendChild(document.createTextNode(urls[i]));
                a.setAttribute('href', urls[i]);
                li.appendChild(a);
                ul.appendChild(li);
            }
            if(loaded() && urls.length == 0) {
                if(debug) console.log("can't find related page");
                li = document.createElement('li');
                li.appendChild(document.createTextNode("can't find related page"));
                ul.appendChild(li);
            }
            displayed = true;
        }
    }

    function toggle() {
        if(debug) console.log("toggle");
        if(!started) {
            start();
            started = true;
        }
        if(!loaded() && !urlsPanel.hasChildNodes()) {
            if(debug) console.log("show loading message");
            p = document.createElement('p');
            p.setAttribute('class', 'loadingMessage');
            message = document.createTextNode("now loading...");
            p.appendChild(message);
            urlsPanel.appendChild(p);
        } else if(!loaded() && urlsPanel.hasChildNodes()) {
            if(debug) console.log("stop pushing");
            return;
        }
        urlsPanel.style.display = urlsPanel.style.display ? '' : 'none';
    }
}());
