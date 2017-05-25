var slackTerminal = require('slack-terminalize');

slackTerminal.init('xoxb-187134790194-VOwZshMN1qT4ObQvkFTppTRv', {
}, {
	CONFIG_DIR: __dirname + '/config',
	COMMAND_DIR: __dirname + '/commands'
});