
function getIp() {
	chrome.runtime.sendMessage({type: "getIp"}, function(ip) {
		if (ip) {
			alert(ip);
		} else {
			setTimeout(getIp, 500);
		}
	});
}

getIp();