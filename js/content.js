
function getIp(index) {
	chrome.runtime.sendMessage({type: 'getIp', index: index}, function(ip) {
		if (typeof ip == 'string') {
			showIp(ip);
		} else {
			setTimeout(function() {
				getIp(ip);
			}, 500);
		}
	});
}

function showIp(ip) {
	
}

if (location.href.indexOf('http://local.whistle.com/') != 0) {
	getIp();
}
