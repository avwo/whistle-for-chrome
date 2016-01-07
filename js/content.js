
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
	$(document.body).append('<span style="position: fixed; z-index: 999999999; right: 10px; bottom: 3px; font-size: 12px; color: #555; font-family: Helvetica Neue,Helvetica,Arial,sans-serif;">' + ip + '</span>')
}

if (location.href.indexOf('http://local.whistle.com/') != 0) {
	getIp();
}
