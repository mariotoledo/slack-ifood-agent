var restaurants_service = require('../service/restaurants_service');
var util    = require('../util');

module.exports = function (param) {
    if(param.args.length > 0){
        var restaurant = restaurants_service.find_by_id(param.args[0]);

        if(!restaurant)
            util.postMessage(param.channel, 'Restaurant not found');
        else{
            var menu = '';
            Object.keys(restaurant.menu).forEach(function(key){
                menu += 
                    key + 
                    ': ' + 
                    restaurant.menu[key].name + 
                    ' (R$ ' + 
                    restaurant.menu[key].price + 
                    ')\n';
            });
            util.postMessage(param.channel, menu);
        }
    }
};