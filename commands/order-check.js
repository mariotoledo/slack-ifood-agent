var request = require('request');
var util    = require('../util');

var orders_service = require('../service/orders_service')

module.exports = function (param) {
    if(param.args.length > 0){
        var username = param.args[0];

        var order;

        if(username.startsWith('<@')){
            var user_id = username.replace('<@', '').replace('>', '');
            order = orders_service.find_by_user(user_id);
        } else {
            order = orders_service.find_by_username(username);
        }

        if(!order) {
            util.postMessage(param.channel, 'Order from ' + username + ' not found');
            return;
        }

        var message = 'Order at ' + order.restaurant_id + ' open by ' + order.owner.username + ':\n\n';

        if(Object.keys(order.requests).length == 0){
            message += 'No requests were added yet';
        } else {
            Object.keys(order.requests).forEach(function(username){
                var userRequestItems = order.requests[username].items;

                if(userRequestItems && userRequestItems.length > 0){
                    message += '- @' + username + ':\n';
                
                    userRequestItems.forEach(function(item){
                        message += '\t- ' + item.name + ' (R$ ' + item.price + ')\n';
                    });  
                }
            });
        }

        util.postMessage(param.channel,message);
    }
};