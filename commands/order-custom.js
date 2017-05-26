var request = require('request');
var util    = require('../util');

var orders_service = require('../service/orders_service')

module.exports = function (param) {
    if(param.args.length > 1){
        var owner_username = param.args[0];
        var price = param.args[1];

        util.postMessage(
            param.channel,
            orders_service.join_custom(
                param.user, 
                owner_username, 
                price
            ).message
        );
    }
};