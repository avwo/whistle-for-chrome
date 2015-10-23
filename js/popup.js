var bgWin = chrome.extension.getBackgroundPage();

function getWhistlePageUrl(hashname) {
	return 'http://local.whistlejs.com/#' + hashname;
}

var menu = $('#menu').on('click', 'li', function() {
	var self = $(this);
	if (self.hasClass('whistle')) {
		if (self.hasClass('network')) {
			bgWin.openWhistlePage('network');
		} else if (self.hasClass('rules')) {
			bgWin.openWhistlePage('rules');
		} else if (self.hasClass('values')) {
			bgWin.openWhistlePage('values');
		}
		
		menu.find('.whistle').removeClass('checked');
		self.addClass('checked');
	} else if (self.hasClass('proxy')) {
		if (self.hasClass('direct')) {
			bgWin.setDirect();
		} else if (self.hasClass('system')) {
			bgWin.setSystem();
		} else if (self.hasClass('proxy-config')) {
			bgWin.setProxy();
		}
		
		menu.find('.proxy').removeClass('checked');
		self.addClass('checked');
	} else if (self.hasClass('set-proxy')) {
		bgWin.openOptions();
	} else if (self.hasClass('about')) {
		bgWin.openAbout();
	}
	
	window.close();
});