// ==UserScript==
// @name           quick_focus_out
// @namespace      perlnamehoge@gmail.com
// @include        http://*
// ==/UserScript==

new function () {
    document.body.addEventListener("keydown", function (e) {
            if ( e.which == 27 ) {
               if ( e.target.tagName == 'TEXTAREA' || ( e.target.tagName == 'INPUT' && e.target.type == 'text' ) ) {
                   ( e.target.blur && e.target.blur() )
               }
            }
    }, false);
}