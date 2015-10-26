var bgWin = chrome.extension.getBackgroundPage();
var proxy = bgWin.proxy;

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
			proxy.setDirect();
		} else if (self.hasClass('system')) {
			proxy.setSystem();
		} else if (self.hasClass('proxy-config')) {
			proxy.setProxy(self.attr('data-name'));
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
	proxy.list.forEach(function(item) {
		var elem = $('<li class="item proxy proxy-config"></li>');
		elem.attr('data-name', item.name);
		elem.text(item.name);
		elem.insertBefore(system);
		item.active && elem.trigger('click', true);
	});
	
	if (proxy.direct) {
		menu.find('.direct').trigger('click', true);
	} else if (proxy.system) {
		system.trigger('click', true);
	}
}

init();