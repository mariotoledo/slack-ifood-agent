var util    = require('../util');

var orders_service = require('../service/orders_service')

module.exports = function (param) {
    if(param.args.length > 1){
        var owner_username = param.args[0];
        var item_id = param.args[1];
        var quantity = param.args.length > 2 ? param.args[2] : 1;

        util.postMessage(
            param.channel,
            orders_service.unjoin_order(
                param.user, 
                owner_username, 
                item_id, 
                quantity
            ).message
        );
    }
};