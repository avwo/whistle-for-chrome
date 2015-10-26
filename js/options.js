var win = chrome.extension.getBackgroundPage();
var proxy = win.proxy;
var activeName = localStorage.activeProxyName || 'whistle';

var proxyList = $('#proxyList').on('click', 'a', function(e) {
	var self = $(this);
	if (!self.hasClass('selected')) {
		proxyList.find('a').removeClass('selected');
		localStorage.activeProxyName = self.attr('data-name');
		self.addClass('selected');
		$('#proxyName').select().focus();
	}
	
	return false;
}).on('mousedown', 'a', function() {
	var self = $(this);
	if (self.hasClass('selected')) {
		return false;
	}
});

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
	createProxyElem(name).appendTo('#proxyList').trigger('click');
	return false;
});

function createProxyElem(name) {
	var item = $('<a href="javascript:;">whistle</a>');
	item.attr('data-name', name);
	item.text(name);
	return item;
}

proxyList.find('a[data-name="' + activeName.replace(/(["\\])/g, '\\$1') +'"]').trigger('click');