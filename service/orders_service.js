var slackTerminal   = require('slack-terminalize')
var restaurants_service = require('../service/restaurants_service');

module.exports = (function OrdersService() {
	var _orders = [];

	return {
		init: function init(user_id, restaurant_id){
			var restaurant = restaurants_service.find_by_id(restaurant_id);

			if(!restaurant) {
				return {
					success: false,
					message: 'Restaurant not found'
				};
			}

			var current_order = this.find_by_user(user_id);

			if(current_order) {
				return {
					success: false,
					message: 'You already have an open order at ' + restaurant.name
				};
			}

        	var user = slackTerminal.getRTMClient().dataStore.getUserById(user_id);

			_orders.push({
				owner: {
					id: user_id,
					username: user.name
				},
				restaurant_id: restaurant_id,
				restaurant_name: restaurant.name,
				requests: {
				}
			});

			return {
				success: true,
				message: 'Order at ' + restaurant.name + ' created by @' + user.name + ' started successfully'
			};
		}, 
		find_by_user: function find_by_user(user_id){
			return _orders.find(function(item){
				return item.owner.id === user_id;
			});
		}, 
		find_by_username: function find_by_username(username){
			return _orders.find(function(item){
				return item.owner.username === username;
			});
		}, 
		find_by_restaurant: function find_by_restaurant(restaurant_id){
			return _orders.find(function(item){
				return item.restaurant_id === restaurant_id;
			});
		}
	}
})();