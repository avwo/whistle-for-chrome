chrome.extension.sendMessage({type: "getIp"}, function(ip) {
		if (!ip) {
			return;
		}
		
});