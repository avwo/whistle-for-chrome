var LOCALHOST = '127.0.0.1';
var dnsCache = {};
var tunnelDnsCache = {};
var count = 1;
var isShowIp = localStorage.showIp;
var hasShowIpMenu;

function checkWhistleVersion() {
	var xhr = new XMLHttpRequest();
	index = count++;
	xhr.timeout = 10000;
	xhr.open('GET', 'http://local.whistlejs.com/cgi-bin/server-info', true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4) {
			return;
		}
		hasShowIpMenu = false;
		try {
			var version = JSON.parse(xhr.responseText).server.version.split('.');
			hasShowIpMenu = version[0] >= 0 && version[1] >= 7;
		} catch(e) {}
	};
	xhr.send();
}
checkWhistleVersion();

var util = (function() {
	
	return {
		parseJSON: function(str) {
			try {
				return JSON.parse(str) || {};
			} catch(e) {}
			
			return {};
		}
	};
})();

var proxy = (function() {
	var proxyConfig = util.parseJSON(localStorage.proxyConfig);
	var proxies = {};
	var list;
	
	if (!$.isArray(proxyConfig.list)) {
		list = proxyConfig.list = [];
	}
	
	if (!localStorage.init) {
		list.push({
			name: 'whistle',
			host: LOCALHOST,
			port: 8899,
			active: true
		}, {
			name: 'aeproxy',
			host: LOCALHOST,
			port: 9527
		});
		localStorage.init = true;
		store();
	}
	
	list = proxyConfig.list = proxyConfig.list.filter(function(item) {
		if (!item || !item.name) {
			return false;
		}
		proxies[item.name] = item;
		return true;
	});
	
	function store() {
		localStorage.proxyConfig = JSON.stringify(proxyConfig);
		showHostIpInResHeaders(isShowIp);
		checkWhistleVersion();
	}
	
	function cleartSelection() {
		proxyConfig.system = false;
		proxyConfig.direct = false;
		list.forEach(function(item) {
			item.active = false;
		});
	}
	
	function active(host, port, callback) {
		host = host || LOCALHOST;
		port = parseInt(port) || 8899;
		chrome.proxy.settings.set({value: {
		    mode: 'fixed_servers',
		    rules: {
		        proxyForHttp: {
		            scheme: 'http',
		            host: host,
		            port: port
		        },
		        proxyForHttps: {
		            scheme: 'http',
		            host: host,
		            port: port
		        }
		    }
		}}, callback);

	}
	
	function enable(name, callback) {
		var item = proxies[name];
		if (!item) {
			return;
		}
		cleartSelection();
		item.active = true;
		active(item.host, item.port, callback);
		chrome.browserAction.setTitle({
			title: name + '(' + (item.host || LOCALHOST) + ':' + (item.port || 8899) + ')'
		});
		store();
	}
	
	function save(name, host, port) {
		if (!name) {
			return;
		}
		
		var item = proxies[name];
		if (item) {
			item.host = host;
			item.port = port;
		} else {
			proxies[name] = item = {
					name: name,
					host: host,
					port: port
			};
			list.push(item);
		}
		store();
	}
	
	function rename(name, newName) {
		if (!name || !newName || !proxies[name] || name == newName) {
			return;
		}
		var item = proxies[name];
		delete proxies[name];
		item.name = newName;
		proxies[newName] = item;
		store();
	}
	
	return {
		setDirect: function(callback) {
			chrome.proxy.settings.set({value: {mode: 'direct'}}, callback);
			cleartSelection();
			proxyConfig.direct = true;
			store();
			chrome.browserAction.setTitle({
				title: '直接请求'
			});
		},
		setSystem: function(callback) {
			chrome.proxy.settings.set({value: {mode: 'system'}}, callback);
			cleartSelection();
			proxyConfig.system = true;
			store();
			chrome.browserAction.setTitle({
				title: '系统代理'
			});
		},
		removeProxy: function(name) {
			var item = proxies[name];
			if (!item) {
				return false;
			}
			
			list.splice(list.indexOf(item), 1);
			store();
			return true;
		},
		saveProxy: save,
		setProxy: function(name, host, port) {
			save(name);
			enable(name);
		},
		renameProxy: rename,
		enableProxy: enable,
		getProxy: function(name) {
			return proxies[name];
		},
		getProxyConfig: function() {
			return proxyConfig; //只是内部使用，不用副本
		}
	};
})();

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

function hideIp() {
	isShowIp = null;
	localStorage.removeItem('showIp');
	dnsCache = {};
	tunnelDnsCache = {};
	showHostIpInResHeaders();
}

function showIp() {
	isShowIp = true;
	localStorage.showIp = 1;
	showHostIpInResHeaders(true);
}

function showHostIpInResHeaders(show) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'http://local.whistlejs.com/cgi-bin/show-host-ip-in-res-headers', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.send('showHostIpInResHeaders=' + (show ? 1 : 0));
}

chrome.webRequest.onHeadersReceived.addListener(
	  function(info) {
		  if (!isShowIp) {
			  return;
		  }
		  var headers = info.responseHeaders || [];
		  for (var i = 0, len = headers.length; i < len; i++) {
			  var header = headers[i];
			  if (header.name == 'x-host-ip') {
				  if (header.value) {
					  dnsCache[info.url] = header.value;
				  }
				  return;
			  }
		  }
	  }, {urls: [], types: []}, ['responseHeaders']
);

chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			var type = request && request.type;
			if (!isShowIp || type != 'getIp') {
				return;
			}
			var url = sender.url;
			var ip = dnsCache[url];
			if (ip) {
				sendResponse(ip);
			} else if (/^https:\/\//i.test(url)) {
				var index = request.index;
				if (!index) {
					var xhr = new XMLHttpRequest();
					index = count++;
					xhr.timeout = 10000;
					xhr.open('GET', 'http://local.whistlejs.com/cgi-bin/lookup-tunnel-dns?url=' + encodeURIComponent(url.substring(0, 512)), true);
					xhr.onreadystatechange = function() {
						if (xhr.readyState != 4) {
							return;
						}
						try {
							if (ip = JSON.parse(xhr.responseText).host) {
								tunnelDnsCache[index] = ip;
								return;
							}
						} catch(e) {}
						tunnelDnsCache[index] = -1;
					};
					xhr.send();
					sendResponse(index);
				} else if (tunnelDnsCache[index]) {
					sendResponse(tunnelDnsCache[index]);
					delete tunnelDnsCache[index];
				} else {
					sendResponse(index);
				}
			}
		}
);

function getUrl(url) {
	
	return url && url.replace(/#.*$/, '');
}

function init() {
	var config = proxy.getProxyConfig();
	if (config.direct) {
		proxy.setDirect();
	} else if(config.system) {
		proxy.setSystem();
	} else {
		config.list.forEach(function(item) {
			item.active && proxy.enableProxy(item.name);
		});
	}
}

init();
