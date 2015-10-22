var bgWin = chrome.extension.getBackgroundPage();
var PAGE_URL = 'http://local.whistlejs.com/from-chrome-plugins'

$('#menu').on('click', 'li', function() {
	var self = $(this);
	if (self.hasClass('network')) {
		bgWin.openWindow(PAGE_URL + '#network', true);
	} else if (self.hasClass('rules')) {
		bgWin.openWindow(PAGE_URL + '#rules', true);
	} else if (self.hasClass('values')) {
		bgWin.openWindow(PAGE_URL + '#values', true);
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