var webClient = require('slack-terminalize').getWebClient();

var postMessage = function (channel, response, format) {
	console.log('channel', channel);

	format = format || true;
	response = (format && '```' + response + '```') || response;

	webClient.chat.postMessage(channel, response, {
		as_user: true
	});

};

exports.postMessage = postMessage;