var request = require('request');
var util    = require('../util');

var orders_service = require('../service/orders_service')

module.exports = function (param) {
    if(param.args.length > 0){
        var price = parseFloat(param.args[0]);

        util.postMessage(
            param.channel,
            orders_service.set_delivery_price(
                param.user, 
                price
            ).message
        );
    }
};