// ==UserScript==
// @name           Hatena Star Everywhere
// @namespace      http://s.hatena.ne.jp/
// @include        *
// ==/UserScript==
// version: 20070927
// merged with http://rails2u.com/misc/greasemonkey/hatenastareverywhere_for_fub.user.js

var VERSION        = '20070927';

var SITECONFIG_URL = 'http://s.hatena.ne.jp/siteconfig.json';
var SCRIPT_URL     = 'http://s.hatena.ne.jp/js/HatenaStar.js';
var CACHE_EXPIRE   = 24 * 60 * 60 * 1000;

var localConfig = { };
/*
var localConfig = {
    '*.g.hatena.ne.jp': [
        {
            path: '^/bbs/\\d+',
            entryNodes: {
                'div.day': {
                    uri: 'h2 a:nth-child(1)',
                    title: 'h2',
                    container: 'h2'
                }
            }
        }
    ]
};
*/

var isFirefox = navigator.userAgent.indexOf('Firefox') != -1;

if (isFirefox) {
    var documentLoaded = false;
    window.addEventListener('load', function() { documentLoaded = true }, true);
}

function ensure(object, prop, value) {
    if (typeof object[prop] == 'undefined')
        object[prop] = value || { };
}

function loadHatenaStar(siteConfig) {
    var host = location.hostname;
    var config = siteConfig[host];
    if (!config && host.match(/^[\w-]+(\..+)$/))
        config = siteConfig['*' + RegExp.$1];
    if (config) {
        for (var i = 0; i < config.length; i++) {
            if (location.pathname.match(new RegExp(config[i].path))) {
                ensure(unsafeWindow, 'Hatena');
                ensure(unsafeWindow.Hatena, 'Star');
                unsafeWindow.Hatena.Star.SiteConfig = config[i];
                var script = document.createElement('script');
                script.charset = 'utf-8';
                script.src = SCRIPT_URL;
                if (isFirefox) {
                    if (documentLoaded)
                        script.addEventListener('load', loadEntryLoader, true);
                } else {
                    loadEntryLoader();
                }
                document.getElementsByTagName('head')[0].appendChild(script);
                break;
            }
        }
    }
}

function loadEntryLoader() {
    var EntryLoader = unsafeWindow.Hatena.Star.EntryLoader;
    if (typeof EntryLoader == 'undefined')
        return setTimeout(loadEntryLoader, 200);

    if (EntryLoader && !EntryLoader.entries)
        new EntryLoader();
}

function configLoaded(siteConfig) {
    siteConfig = siteConfig || { };
    for (var h in localConfig)
        siteConfig[h] = localConfig[h];
    if (isFirefox)
        window.Hatena.Star.SiteConfig = siteConfig;
    loadHatenaStar(siteConfig);
}

if (isFirefox) {
    ensure(window, 'Hatena');
    ensure(window.Hatena, 'Star');
}

if (typeof unsafeWindow.Hatena == 'undefined'
        || typeof unsafeWindow.Hatena.Star == 'undefined'
        || !unsafeWindow.Hatena.Star.loaded) {
    if (isFirefox) {
        var config = eval(GM_getValue('config')) || { };
    } else {
        var config = { };
        if (GM_getValue('configSiteConfig')) {
            config.siteConfig = eval('(' + GM_getValue('configSiteConfig') + ')');
            config.expire = eval('(' + GM_getValue('configExpire') + ')');
        }
    }

    if (!config.expire || config.expire < (new Date()).getTime()) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: SITECONFIG_URL,
            onload: function(res) {
                config.siteConfig = eval('(' + res.responseText + ')');
                config.expire = (new Date()).getTime() + CACHE_EXPIRE;
                if (isFirefox) {
                    GM_setValue('config', config.toSource());
                } else {
                    GM_setValue('configSiteConfig', res.responseText);
                    GM_setValue('configExpire', config.expire + 0);
                }
                configLoaded(config.siteConfig);
            },
            onerror: function() {
                configLoaded(config.siteConfig);
            }
        });
    } else {
        configLoaded(config.siteConfig);
    }
}

if (typeof GM_registerMenuCommand != 'undefined') {
    GM_registerMenuCommand('Hatena Star Everywhere - clear cache', function() { 
        if (isFirefox) {
            GM_setValue('config', '');
        } else {
            GM_setValue('configSiteConfig', ''); 
            GM_setValue('configExpire', ''); 
        }
    });
}
