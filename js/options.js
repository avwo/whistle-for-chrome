var bgWin = chrome.extension.getBackgroundPage();
var selectedName = localStorage.selectedProxyName || 'whistle';
var WARN = '\n(不要勾选下面可能出现的`禁止此页再显示对话框`)';

var proxyList = $('#proxyList').on('click', 'a', function(e) {
	var self = $(this);
	if (self.hasClass('selected')) {
		return false;
	}
	var name = self.attr('data-name');
	if (name == 'whistle' || name == 'aeproxy') {
		$('#removeProxy').hide();
	} else {
		$('#removeProxy').show();
	}
	localStorage.selectedProxyName = self.attr('data-name');
	proxyList.find('a').removeClass('selected');
	self.addClass('selected');
	$('#proxyName').select().focus();
	return false;
}).on('mousedown', 'a', function() {
	var self = $(this);
	if (self.hasClass('selected')) {
		return false;
	}
});

$('#createProxy').click(function() {
	var name = $.trim(prompt('请输入不超过36个字符的代理名称：' + WARN));
	if (!name) {
		alert('名称不能为空' + WARN);
		return false;
	}
	
	if (name.length > 36) {
		alert('名称不能超过36个字符' + WARN);
		return false;
	}
	
	
	
	var item = createProxyItem(name).appendTo('#proxyList');
	item.trigger('click');
	return false;
});

function createProxyItem(name) {
	var item = $('<a href="javascript:;">whistle</a>');
	item.attr('data-name', name);
	item.text(name);
	return item;
}

proxyList.find('a[data-name="' + selectedName.replace(/(["\\])/g, '\\$1') +'"]').trigger('click');