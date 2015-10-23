var curProxy;
var proxies = {
		whistle: {
			host: '127.0.0.1',
			port: 8899
		},
		aeproxy: {
			host: '127.0.0.1',
			port: 9527
		}
};

function detectProxyChange() {
	getProxy(function(config) {
		curProxy = config;
		setTimeout(detectProxyChange, 1000);
	});
}

setTimeout(detectProxyChange, 1000);

function setProxy(host, port) {
	if (typeof port == 'function') {
		callback = port;
		port = null;
	} if (typeof host == 'function') {
		callback = host;
		host = null;
	}
	
	var proxyConfig = {
            scheme: 'http',
            host: host || '127.0.0.1',
            port: port || 8899
        };

	curProxy = {
		    mode: 'fixed_servers',
		    rules: {
		        proxyForHttp: proxyConfig,
		        proxyForHttps: proxyConfig
		    }
		};
	
	chrome.proxy.settings.set({value: curProxy});
}

function getProxy(callback) {
	chrome.proxy.settings.get({}, function(config) {
		callback(config && config.value);
	});
}

function setDirect() {
	chrome.proxy.settings.set({value: {mode: 'direct'}});
}

function setSystem() {
	chrome.proxy.settings.set({value: {mode: 'system'}});
}

function openWhistlePage(name) {
	openWindow(getWhistlePageUrl(name), true);
}

function getWhistlePageUrl(name) {
	return 'http://local.whistlejs.com/#' + name;
}

function openOptions() {
    openWindow(chrome.extension.getURL('options.html'));
}

function openAbout() {
	openWindow(chrome.extension.getURL('about.html'));
}

function openWindow(url, pinned) {
	chrome.tabs.getAllInWindow(null, function (tabs) {
        for (var i = 0, len = tabs.length; i < len; i++) {
        	var tab = tabs[i];
            if (getUrl(tab.url) == getUrl(url)) {
            	var options = {selected: true};
            	if (tab.url != url) {
            		options.url = url;
            	}
                chrome.tabs.update(tab.id, options);
                return;
            }
        }
        
        chrome.tabs.query({active: true}, function(tabs){
		    var tab = tabs[0];
		    chrome.tabs.create({
			    index: tab ? tab.index + 1 : 100,
			    url: url,
			    active: true,
			    pinned: !!pinned
			});
		});
    });
}

function getUrl(url) {
	
	return url && url.replace(/#.*$/, '');
}

function init() {
	setProxy();
}

init();
