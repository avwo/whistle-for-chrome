
function getIp() {
	chrome.extension.sendMessage({type: "getIp"}, function(ip) {
		if (ip) {
			alert(ip);
		} else {
			setTimeout(getIp, 200);
		}
	});
}

getIp();