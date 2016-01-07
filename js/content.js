
function getIp(index) {
	chrome.runtime.sendMessage({type: 'getIp', index: index}, function(ip) {
		if (typeof ip == 'string') {
			alert(ip);
		} else {
			setTimeout(function() {
				getIp(ip);
			}, 500);
		}
	});
}

getIp();