var bgWin = chrome.extension.getBackgroundPage();

$('#menu').on('click', 'li', function() {
	var self = $(this);
	if (self.hasClass('network')) {
		bgWin.openWindow('http://local.whistlejs.com/#network');
	} else if (self.hasClass('rules')) {
		bgWin.openWindow('http://local.whistlejs.com/#rules');
	} else if (self.hasClass('values')) {
		bgWin.openWindow('http://local.whistlejs.com/#values');
	} else if (self.hasClass('direct')) {
		bgWin.setDirect();
	} else if (self.hasClass('proxy-config')) {
		
	} else if (self.hasClass('set-proxy')) {
		bgWin.openOptions();
	} else if (self.hasClass('about')) {
		bgWin.openAbout();
	}
});