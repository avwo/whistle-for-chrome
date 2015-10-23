var bgWin = chrome.extension.getBackgroundPage();

function getWhistlePageUrl(hashname) {
	return 'http://local.whistlejs.com/#' + hashname;
}

$('#menu').on('click', 'li', function() {
	var self = $(this);
	if (self.hasClass('network')) {
		bgWin.openWindow(getWhistlePageUrl('network'));
	} else if (self.hasClass('rules')) {
		bgWin.openWindow(getWhistlePageUrl('rules'));
	} else if (self.hasClass('values')) {
		bgWin.openWindow(getWhistlePageUrl('values'));
	} else if (self.hasClass('direct')) {
		bgWin.setDirect();
	} else if (self.hasClass('proxy-config')) {
		bgWin.setProxy();
	} else if (self.hasClass('set-proxy')) {
		bgWin.openOptions();
	} else if (self.hasClass('system')) {
		bgWin.setSystem();
	} else if (self.hasClass('about')) {
		bgWin.openAbout();
	}
	window.close();
});