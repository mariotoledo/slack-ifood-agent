var util    = require('../util');

var orders_service = require('../service/orders_service')

module.exports = function (param) {
    if(param.args.length > 2){
        var owner_username = param.args[0];
        var item_id = param.args[1];
        var quantity = parseInt(param.args[2]);
        var obs = param.args.length > 3 ? param.args[3] : null;

        util.postMessage(
            param.channel,
            orders_service.join_order(
                param.user, 
                owner_username, 
                item_id, 
                quantity,
                obs
            ).message
        );
    }
};