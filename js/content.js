$(window).on('hashchange', function() {
	var hash = location.hash.substring(1);
	chrome.runtime.onMessage.sendMessage();
});