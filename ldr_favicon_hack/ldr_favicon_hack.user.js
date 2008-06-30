// ==UserScript==
// @name           LDR favicon hack
// @namespace      http://d.hatena.ne.jp/javascripter/
// @include        http://reader.livedoor.com/reader/
// ==/UserScript==

(function() {
  unsafeWindow.document.watch('title',
  function(id, before, after) {
    updateFavicon();
    return after
  });
  var favicon = document.evaluate('//head/link[@rel="shortcut icon"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  var canvas = document.createElement('canvas');
 var head = document.getElementsByTagName('head')[0];

  function updateFavicon() {
    var unread = unsafeWindow.subs.model.get_unread_count();
    canvas.width = canvas.height = 16;
    with(canvas.getContext('2d')) {
      clearRect(0, 0, 16, 16);
      mozTextStyle = 22 + (unread.toString().length) * -4 + "px sans-serif";
      translate(0, 14);
      mozDrawText(unread);
    }
    favicon.href = canvas.toDataURL();
    head.appendChild(favicon);

  }
})();
