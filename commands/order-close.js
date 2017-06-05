var util    = require('../util');

var orders_service = require('../service/orders_service')

module.exports = function (param) {
    util.postMessage(
        param.channel, 
        orders_service.close(
            param.user
        ).message
    );
};