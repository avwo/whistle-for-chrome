$(window).on('hashchange', function() {
	chrome.runtime.sendMessage({
		eventType: 'hashchange', 
		value: location.hash.substring(1)
	});
});