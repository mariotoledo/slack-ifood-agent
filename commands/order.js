var request = require('request');
var util 	= require('../util');

var orders_service = require('../service/orders_service')

module.exports = function (param) {
	if(param.args.length > 0)
		util.postMessage(param.channel, 
                         orders_service.init(
                            param.user, 
                            param.args[0]).message
                         );
};