var util    = require('../util');

var orders_service = require('../service/orders_service');

module.exports = function (param) {
    util.postMessage(
        param.channel, 
        orders_service.remove_order(param.user).message
    );
};