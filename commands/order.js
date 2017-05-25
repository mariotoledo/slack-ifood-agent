var request = require('request');
var util 	= require('../util');

var orders_service = require('../service/orders_service')

module.exports = function (param) {
	console.log(param);

	var	channel	= param.channel;
		
	console.log('param', param);
	if(param.args.length > 0)
		util.postMessage(channel, orders_service.add(param.user_id, param.args[0]).message);
};