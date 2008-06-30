// ==UserScript==
// @name        Scroll like the LDR
// @namespace   http://d.hatena.ne.jp/nagaton/
// @include     http*://*
// @version     0.0.5
// ==/UserScript==

(function () {
        var OFFSET = 100; // pixel

        var formElement = { 'input':true, 'button':true, 'select':true, 'textarea':true };

        window.addEventListener('keypress',
                function(e) {
                        if (e.charCode == 32 && ! formElement[e.target.tagName.toLowerCase()]) {
                                scrollBy(0, (e.shiftKey? OFFSET * -1 : OFFSET));
                                e.preventDefault();
                                e.stopPropagation();
                        }
                }, false);

        // ignore inner frame
        if (window.frameElement == null ||
                String(window.frameElement).indexOf('HTMLIFrameElement') < 0) {
                focus();
        }
})();
