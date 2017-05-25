module.exports = (function RestaurantsService() {
    var restaurants = require('../data/restaurants.json')

    return {
        find_by_id: function find_by_id(restaurant_id) {
            if(restaurants.hasOwnProperty(restaurant_id))
                return restaurants[restaurant_id];
        },
        find_all: function find_all(){
            return restaurants;
        }
    };
})();