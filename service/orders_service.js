var slackTerminal   = require('slack-terminalize')
var restaurants_service = require('../service/restaurants_service');

module.exports = (function OrdersService() {
	var _orders = {};

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

			_orders[user_id] = {
				username: user.name,
				restaurant_id: restaurant_id,
				restaurant_name: restaurant.name,
				requests: {
				}
			};

			return {
				success: true,
				message: 'Order at ' + restaurant.name + ' created by @' + user.name + ' started successfully'
			};
		},
		join_order: function join_order(user_id, owner_username, item_id, quantity){
			var order;

			if(owner_username.startsWith('<@')){
	            var owner_id = owner_username.replace('<@', '').replace('>', '');
	            order = this.find_by_user(owner_id);
	        } else {
	            order = this.find_by_username(owner_username);
	        }

	        if(!order) {
	        	return {
					success: false,
					message: 'Order from ' + owner_username + ' not found'
				};
	        }

	        var item = restaurants_service.find_item_by_id(order.restaurant_id, item_id);

	        if(!item){
	        	return {
					success: false,
					message: 'Item ' + item_id + ' not found. Use "menu ' + order.restaurant_id + '"" to check all items'
				};
	        }

	        if(!quantity || quantity < 0){
	            return {
					success: false,
					message: 'Quantity must be highter than 1'
				};
	        }

	        var user = slackTerminal.getRTMClient().dataStore.getUserById(user_id);

	        if(!order.requests.hasOwnProperty(user_id))
	        	order.requests[user_id] = {};

	        var userRequest = order.requests[user_id];

	        if(!userRequest.hasOwnProperty(item_id))
	        	userRequest[item_id] = {
	        		name: item.name,
	        		price: item.price,
	        		quantity: quantity
	        	}
	        else
	        	userRequest[item_id].quantity = parseInt(userRequest[item_id].quantity) + 
	        								    parseInt(quantity);

	        return {
				success: true,
				message: item.name + ' (x' + quantity + ') added succesfully by @' + user.name
			};
		},
		remove_request: function remove_request(user_id){
			var order = this.find_by_user(user_id);

			if(!order){
				return {
					success: false,
					message: 'You do not have any open orders'
				};
			}

			delete _orders[user_id];

			return {
				success: true,
				message: 'Order for ' + order.restaurant_id + ' removed successfully'
			};
		},
		unjoin_order: function unjoin_order(user_id, owner_username, item_id, quantity){
			var order = this.find_by_username(owner_username);

			if(owner_username.startsWith('<@')){
	            var owner_id = owner_username.replace('<@', '').replace('>', '');
	            order = this.find_by_user(owner_id);
	        } else {
	            order = this.find_by_username(owner_username);
	        }

	        if(!order) {
	        	return {
					success: false,
					message: 'Order from ' + owner_username + ' not found'
				};
	        }

	        if(!order.requests.hasOwnProperty(user_id)){
	        	return {
					success: false,
					message: 'You do not have any request for this order'
				};
	        }

	        if(!order.requests[user_id].hasOwnProperty(item_id)){
	        	return {
					success: false,
					message: 'You do not have any request for this item_id'
				};
	        }

	        if(!quantity || quantity < 0){
	            return {
					success: false,
					message: 'Quantity must be highter than 1'
				};
	        }

	        var request = (order.requests[user_id])[item_id];

	        if(Object.keys(order.requests).length == 1 && request.quantity <= quantity){
	        	delete order.requests[user_id]
	        } else if (request.quantity <= quantity) {
	        	delete (order.requests[user_id])[item_id]
	        } else {
	        	request.quantity = parseInt(request.quantity) - parseInt(quantity);
	        }

	        return {
				success: true,
				message: 'Request for ' + request.name + ' (x' + quantity + ') removed successfully'
			};
		},
		find_by_user: function find_by_user(user_id){
			return _orders[user_id];
		}, 
		find_by_username: function find_by_username(username){
			return _orders[Object.keys(_orders).find(function(key){
				return _orders[key].username === username;
			})];
		}, 
		find_by_restaurant: function find_by_restaurant(restaurant_id){
			return _orders[Object.keys(_orders).find(function(key){
				return _orders[key].restaurant_id === restaurant_id;
			})];
		}
	}
})();