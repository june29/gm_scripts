// ==UserScript==
// @name           InterestCloud
// @namespace      http://june29.jp/
// @include        http://*
// @include        https://*
// ==/UserScript==

(function() {
  var INTERVAL = 60 * 60 * 1000;
  var NUM_TAGS = 10;

  var counter;
  loadCounter();
  var timestamp;
  loadTimestamp();

  var hb_url = 'http://b.hatena.ne.jp/entry/json/?url=';
  var tw_url = 'http://twitter.com/statuses/update.json';

  function loaded(response) {
    if(response) {
      var total = response.count;
      if(parseInt(total) < 100) {
        var bookmarks = response.bookmarks;
        for(var i = 0; i < bookmarks.length; i++) {
          var tags = bookmarks[i].tags;
          for(var j = 0; j < tags.length; j++) {
            var tag = tags[j].toLowerCase();
            if(tag in counter) {
              counter[tag] += 1.0 / total;
            } else {
              counter[tag] = 1.0 / total;
            }
          }
        }
        setTimeout(saveCounter, 0);
        var timediff = new Date().getTime() - timestamp;
        if(timediff > INTERVAL) {
          alert(timediff);
          setTimeout(twitCounter, 5000);
        }
      }
    }
  }

  function twitCounter() {
    var ary = [];
    for(var tag in counter) {
      ary.push({tag : tag, count : counter[i]});
    }

    if(ary.length > NUM_TAGS) {
      var topTags = [];
      ary.sort(function(a, b) {return b.count - a.count;});
      for(var i = 0; i < 10; i++) {
        topTags.push(ary[i].tag);
      }
      var status = encodeURIComponent(topTags.join(', ') + ' [InterestCloud]');
      alert(status);

      GM_xmlhttpRequest({
        method: 'POST',
        url: tw_url,
        data: 'status=' + status + '&source=InterestCloud',
        headers: {
          "Content-Type":"application/x-www-form-urlencoded",
          "X-Twitter-Client": "InterestCloud",
          "X-Twitter-Client-Version": "0.1"
        },
        onload: function(res) {
          alert('posted: ' + res.status);
          if(res.status == '200') {
            alert('reset Couner');
            setTimeout(saveTimestamp, 0);
            resetCounter();
          }
        }
      });
    }
  }

  function loadCounter() {
    counter = eval('(' + GM_getValue('counter') + ')') || {};
  }
  function saveCounter() {
    GM_setValue('counter', counter.toSource());
  }
  function resetCounter() {
    GM_setValue('counter', '({})');
  }
  function loadTimestamp() {
    timestamp = GM_getValue('timestamp', '0');
  }
  function saveTimestamp() {
    GM_setValue('timestamp', new Date().getTime().toString());
  }

  function getTags() {
    GM_xmlhttpRequest({
      method: 'GET',
      url: hb_url + encodeURIComponent(location.href.replace(/%23/g, '#')) + '&callback=loaded',
      onload: function(res) {
        eval(res.responseText);
      }
    });
  }

  setTimeout(getTags, Math.random()*10000);
  GM_registerMenuCommand('InterestCloud - reset Counter', resetCounter);
}());
