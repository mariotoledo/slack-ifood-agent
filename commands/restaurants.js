var restaurants_service = require('../service/restaurants_service');
var util    = require('../util');

module.exports = function (param) {
    var restaurants = restaurants_service.find_all();
    
    var message = '';
    
    Object.keys(restaurants).forEach(function(key){
        message += 
            key + 
            ': ' + 
            restaurants[key].name + 
            '\n';
    });
    util.postMessage(param.channel, message);
};