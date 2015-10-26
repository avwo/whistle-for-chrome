var win = chrome.extension.getBackgroundPage();
var proxy = win.proxy;
var proxyName = $('#proxyName');
var proxyHost = $('#proxyHost');
var proxyPort = $('#proxyPort');

function existsName(name) {
	return proxyList.find('a[data-name="' + name.replace(/(["\\])/g, '\\$1') +'"]').length;
}

proxyName.blur(function() {
	var name = proxyName.val().trim();
	var elem = proxyList.find('a.selected');
	var oldName = elem.attr('data-name');
	if (!name) {
		alert('名称不能为空');
		proxyName.select().focus();
		return;
	}
	
	if (name == oldName) {
		return;
	}
	if (existsName(name)) {
		alert('`' + name + '`已经存在');
		proxyName.select().focus();
		return;
	}
	proxy.renameProxy(oldName, name);
	elem.attr('data-name', name);
	elem.text(name);
	if (localStorage.activeProxyName == oldName) {
		localStorage.activeProxyName = name;
	}
});

proxyHost.blur(function() {
	var elem = proxyList.find('a.selected');
	var host = proxyHost.val().trim();
	elem.attr('data-host', host);
	proxy.saveProxy(elem.attr('data-name'), host, elem.attr('data-port'));
});

proxyPort.blur(function() {
	var port = proxyPort.val().trim();
	port = parseInt(port) || 0;
	var elem = proxyList.find('a.selected');
	elem.attr('data-port', port);
	proxy.saveProxy(elem.attr('data-name'), elem.attr('data-host'), port);
});


var proxyList = $('#proxyList').on('click', 'a', function(e) {
	var self = $(this);
	if (!self.hasClass('selected')) {
		proxyList.find('a').removeClass('selected');
		var name = self.attr('data-name');
		localStorage.activeProxyName = name;
		proxyName.val(name || '');
		proxyHost.val(self.attr('data-host') || '');
		proxyPort.val(self.attr('data-port') || '');
		self.addClass('selected');
		if (name == 'whistle') {
			$('#removeProxy').hide();
			proxyName.prop('disabled', true);
		} else {
			$('#removeProxy').show();
			proxyName.prop('disabled', false);
		}
		setTimeout(function() {
			proxyName.select().focus();
		}, 0);
	}
	
	return false;
}).on('mousedown', 'a', function() {
	var self = $(this);
	if (self.hasClass('selected')) {
		return false;
	}
});

var proxyList = $('#proxyList');
$('#createProxy').click(function() {
	var name = $.trim(prompt('请输入不超过36个字符的代理名称：'));
	if (!name || !(name = name.trim())) {
		return false;
	}
	name = name.substring(0, 36);
	if (proxy.getProxy(name)) {
		alert('`' + name + '`已经存在，请重新创建');
		return false;
	}
	proxy.setProxy(name);
	createProxyElem(name).appendTo(proxyList).trigger('click');
	return false;
});

function createProxyElem(name, host, port) {
	var item = $('<a href="javascript:;">whistle</a>');
	item.attr({
		'data-name': name,
		'data-host': host,
		'data-port': port
	});
	
	item.text(name);
	return item;
}

function init() {
	proxy.getProxyConfig().list.forEach(function(item) {
		createProxyElem(item.name, item.host, item.port).appendTo(proxyList);
	});
	
	var activeName = localStorage.activeProxyName || 'whistle';
	proxyList.find('a[data-name="' + activeName.replace(/(["\\])/g, '\\$1') +'"]').trigger('click');
}

init();
