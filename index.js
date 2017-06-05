var slackTerminal = require('slack-terminalize');

slackTerminal.init('', {
}, {
	CONFIG_DIR: __dirname + '/config',
	COMMAND_DIR: __dirname + '/commands'
});