var retryCount = 0;
var id = '_whistle-' + Date.now() + '_';

function getIp(index) {
	chrome.runtime.sendMessage({type: 'getIp', index: index}, function(ip) {
		if (typeof ip == 'string') {
			showIp(ip);
			setInterval(function() {
				showIp(ip);
			}, 2000);
		} else if (ip > 0 && retryCount < 3) {
			setTimeout(function() {
				retryCount++;
				getIp(ip);
			}, 500 + retryCount * 500);
		}
	});
}

function showIp(ip) {
	if ($('#' + id).length) {
		return;
	}
	var elem = $('<span id="' + id + '" style="position: fixed; z-index: 2147483647; right: 10px; bottom: 3px; line-height: 14px; padding-left: 16px; overflow: hidden; height: 14px; display: inline-block; font-size: 12px!important; color: #555; font-family: Helvetica Neue,Helvetica,Arial,sans-serif;">'
			+ '<i title="close" style="font-family: Helvetica Neue,Helvetica,Arial,sans-serif; font-style: normal; position: absolute; left: 0; top: 0; font-size: 12px!important; line-height: 12px; overflow: hidden; height: 14px; margin-right: 3px; background: rgb(243,243,243); width: 14px; text-align: center; color: rgb(63,63,63); cursor: pointer; display: none; border-radius: 14px;">&times;</i><span style="display: inline-block; line-height: 14px; overflow: hidden; height: 14px;">' + ip + '</span></span>')
			.appendTo(document.body);
	elem.on('mouseenter', function() {
		elem.find('i').css('display', 'inline-block');
		elem.find('span').css('background', 'rgb(243,243,243)');
	}).on('mouseleave', function() {
		elem.find('i').hide();
		elem.find('span').css('background', '');
	}).on('click', 'i', function() {
		elem.hide();
	});
}

if (location.href.indexOf('http://local.whistle.com/') != 0) {
	getIp();
}
