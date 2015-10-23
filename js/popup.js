var bgWin = chrome.extension.getBackgroundPage();

function getWhistlePageUrl(hashname) {
	return 'http://local.whistlejs.com/#' + hashname;
}

var menu = $('#menu').on('click', 'li', function(e, initing) {
	var self = $(this);
	if (self.hasClass('network')) {
		bgWin.openWhistlePage('network');
	} else if (self.hasClass('rules')) {
		bgWin.openWhistlePage('rules');
	} else if (self.hasClass('values')) {
		bgWin.openWhistlePage('values');
	} else if (self.hasClass('proxy')) {
		if (self.hasClass('direct')) {
			bgWin.setDirect();
		} else if (self.hasClass('system')) {
			bgWin.setSystem();
		} else if (self.hasClass('proxy-config')) {
			bgWin.setProxy(self.attr('data-name'));
		}
		menu.find('.proxy').removeClass('checked');
		self.addClass('checked');
	} else if (self.hasClass('set-proxy')) {
		bgWin.openOptions();
	} else if (self.hasClass('about')) {
		bgWin.openAbout();
	}
	
	!initing && window.close();
});


function init() {
	var system = menu.find('.system');
	var selected;
	bgWin.proxyList.forEach(function(item) {
		var elem = $('<li class="item proxy proxy-config"></li>');
		elem.attr('data-name', item.name);
		elem.text(item.name);
		elem.insertBefore(system);
		if (!selected && item.selected) {
			selected = true;
			elem.trigger('click', true);
		}
	});
	
	if (!selected) {
		if (bgWin.directProxy) {
			system.trigger('click', true);
		} else if (bgWin.systemProxy) {
			menu.find('.direct').trigger('click', true);
		}
	}
	
}

init();