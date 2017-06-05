var util    = require('../util');
var orders_service = require('../service/orders_service')

module.exports = function (param) {
    if(param.args.length > 0){
        var message = orders_service.detail_message(param.args[0]);

        util.postMessage(param.channel,message);
    }
};