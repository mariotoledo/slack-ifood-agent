var request = require('request');
var util    = require('../util');
var slackTerminal   = require('slack-terminalize')

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

        var message = 'Order at ' + order.restaurant_id + ' open by @' + order.username + ':\n\n';

        if(Object.keys(order.requests).length == 0){
            message += 'No requests were added yet';
        } else {
            Object.keys(order.requests).forEach(function(user_id){
                var userRequestItems = order.requests[user_id];

                if(userRequestItems && Object.keys(userRequestItems).length > 0){
                    var user = slackTerminal.getRTMClient().dataStore.getUserById(user_id);

                    message += '- @' + user.name + ':\n';
                
                    Object.keys(userRequestItems).forEach(function(key){
                        message += '\t- ' + 
                                    userRequestItems[key].name + 
                                    ' [x' + 
                                    userRequestItems[key].quantity + 
                                    ']' +
                                    ' (R$ ' + 
                                    (userRequestItems[key].price * userRequestItems[key].quantity) + 
                                    ')\n';
                    });  
                }
            });
        }

        util.postMessage(param.channel,message);
    }
};