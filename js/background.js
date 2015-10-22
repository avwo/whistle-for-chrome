
function setProxy(host, port, callback) {
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
	var config = {
		    mode: 'fixed_servers',
		    rules: {
		        proxyForHttp: proxyConfig,
		        proxyForHttps: proxyConfig
		    }
		};

	chrome.proxy.settings.set({value: config}, function() {
		$.ajax({
			url: 'http://' + config.host + ':' + config.port + '/cgi-bin/server-info',
			cache: false,
			timeout: 3000,
			success: function() {
				callback(true);
			},
			error: function() {
				callback(false);
			}
		});
	});
}

function setDirect() {
	chrome.proxy.settings.set({value: {mode: 'direct'}});
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
                chrome.tabs.update(tab.id, { selected:true, url: url});
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
	
}

init();
