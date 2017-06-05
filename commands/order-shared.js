var util    = require('../util');

var orders_service = require('../service/orders_service')

module.exports = function (param) {
    if(param.args.length > 1){
        var item_id = param.args[0];
        var quantity = parseInt(param.args[1]);
        var obs = param.args.length > 2 ? param.args[2] : null;

        util.postMessage(
            param.channel,
            orders_service.join_shared(
                param.user, 
                item_id, 
                quantity,
                obs
            ).message
        );
    }
};