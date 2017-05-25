module.exports = (function RestaurantsService() {
    var restaurants = require('../data/restaurants.json')

    return {
        find_by_id: function find_by_id(restaurant_id) {
            if(restaurants.hasOwnProperty(restaurant_id))
                return restaurants[restaurant_id];
        },
        find_all: function find_all(){
            return restaurants;
        },
        find_item_by_id: function find_item_by_id(restaurant_id, item_id){
            if(restaurants.hasOwnProperty(restaurant_id)){
                var restaurant = restaurants[restaurant_id];
                if(restaurant.menu.hasOwnProperty(item_id))
                    return restaurant.menu[item_id];
            }
        }
    };
})();