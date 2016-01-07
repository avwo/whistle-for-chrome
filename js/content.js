
function getIp(index) {
	chrome.runtime.sendMessage({type: 'getIp', index: index}, function(ip) {
		if (typeof ip == 'string') {
			showIp(ip);
		} else {
			setTimeout(function() {
				getIp(ip);
			}, 500);
		}
	});
}

function showIp(ip) {
	var elem = $('<span style="position: fixed; z-index: 999999999; right: 10px; bottom: 3px; line-height: 14px; padding-left: 16px; overflow: hidden; height: 14px; display: inline-block; font-size: 12px!important; color: #555; font-family: Helvetica Neue,Helvetica,Arial,sans-serif;">'
			+ '<i title="close" style="font-family: Helvetica Neue,Helvetica,Arial,sans-serif; font-style: normal; position: absolute; left: 0; top: 0; font-size: 12px!important; line-height: 12px; overflow: hidden; height: 14px; margin-right: 3px; background: rgb(243,243,243); width: 14px; text-align: center; color: rgb(63,63,63); cursor: pointer; display: none; border-radius: 14px;">&times;</i>' + ip + '</span>')
			.appendTo(document.body);
	elem.on('mouseenter', function() {
		elem.find('i').css('display', 'inline-block');
	}).on('mouseleave', function() {
		elem.find('i').hide();
	}).on('click', 'i', function() {
		elem.hide();
	});
}

if (location.href.indexOf('http://local.whistle.com/') != 0) {
	getIp();
}
