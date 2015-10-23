var bgWin = chrome.extension.getBackgroundPage();
var selectedName = localStorage.selectedProxyName || 'whistle';

var proxyList = $('#proxyList').on('click', 'a', function(e) {
	var self = $(this);
	var name = self.attr('data-name');
	if (name == 'whistle' || name == 'aeproxy') {
		$('#removeProxy').hide();
	} else {
		$('#removeProxy').show();
	}
	localStorage.selectedProxyName = self.attr('data-name');
	proxyList.find('a').removeClass('selected');
	self.addClass('selected');
	return false;
});

$('#createProxy').click(function() {
	var name = $.trim(prompt('请输入不超过36个字符的代理名称：'));
	if (!name) {
		alert('名称不能为空');
		return;
	}
	
	if (name.length > 36) {
		alert('名称不能超过36个字符');
		return;
	}
	
	return false;
});

proxyList.find('a[data-name="' + selectedName.replace(/(["\\])/g, '\\$1') +'"]').trigger('click');