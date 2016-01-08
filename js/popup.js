var win = chrome.extension.getBackgroundPage();
var proxy = win.proxy;
var proxyConfig = proxy.getProxyConfig();

function getWhistlePageUrl(hashname) {
	return 'http://local.whistlejs.com/#' + hashname;
}

var menu = $('#menu').on('click', 'li', function(e, initing) {
	var self = $(this);
	if (self.hasClass('network')) {
		win.openWhistlePage('network');
	} else if (self.hasClass('rules')) {
		win.openWhistlePage('rules');
	} else if (self.hasClass('values')) {
		win.openWhistlePage('values');
	} else if (self.hasClass('proxy')) {
		if (self.hasClass('direct')) {
			proxy.setDirect();
		} else if (self.hasClass('system')) {
			proxy.setSystem();
		} else if (self.hasClass('proxy-config')) {
			var name = self.attr('data-name');
			proxy.enableProxy(name);
		}
		menu.find('.proxy').removeClass('checked');
		self.addClass('checked');
	} else if (self.hasClass('set-proxy')) {
		win.openOptions();
	} else if (self.hasClass('about')) {
		win.openAbout();
	} else if (self.hasClass('show-ip')) {
		if (self.hasClass('checked')) {
			win.hideIp();
		} else {
			win.showIp();
			self.addClass('checked');
		}
	}
	
	!initing && window.close();
});


function init() {
	var system = menu.find('.system');
	proxyConfig.list.forEach(function(item) {
		var elem = $('<li class="item proxy proxy-config"></li>');
		elem.attr('data-name', item.name);
		elem.attr('title', (item.host || '127.0.0.1') + ':' + (item.port || 8899));
		elem.text(item.name);
		elem.insertBefore(system);
		item.active && elem.trigger('click', true);
	});
	
	if (proxyConfig.direct) {
		menu.find('.direct').trigger('click', true);
	} else if (proxyConfig.system) {
		system.trigger('click', true);
	}
	var showIpMenu = menu.find('.show-ip');
	if (win.hasShowIpMenu) {
		win.isShowIp && showIpMenu.trigger('click', true);
	} else {
		showIpMenu.hide();
	}
}

init();