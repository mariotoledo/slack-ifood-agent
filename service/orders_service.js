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
				message: '@here: Order at ' + restaurant.name + ' created by @' + user.name + ' started successfully\nYou can join the order by using "order-join" command or check the menu by using "menu" command'
			};
		},
		join_order: function join_order(user_id, owner_username, item_id, quantity, obs){
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

	        if(quantity < 1){
	            return {
					success: false,
					message: 'Quantity must be higher than 0'
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
	        		quantity: quantity,
	        	}
	        else
	        	userRequest[item_id].quantity = parseInt(userRequest[item_id].quantity) + 
	        								    parseInt(quantity);

	     	if(obs) {
	     		userRequest[item_id].obs = obs;
	     	}

	        return {
				success: true,
				message: item.name + ' (x' + quantity + ') added succesfully by @' + user.name
			};
		},
		join_custom: function join_custom(user_id, owner_username, label, price){
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

	        if(label.trim() == ''){
	        	return {
					success: false,
					message: 'You must add an label'
				};
	        }

	        if(price <= 0){
	        	return {
					success: false,
					message: 'Price must be greater than 0'
				};
	        }

	        var user = slackTerminal.getRTMClient().dataStore.getUserById(user_id);

	        if(!order.requests.hasOwnProperty(user_id))
	        	order.requests[user_id] = {};

	        var userRequest = order.requests[user_id];

	        userRequest.custom = {
        		name: 'custom',
        		price: price,
        		quantity: 1
        	}

        	if(obs) {
	     		userRequest[item_id].obs = obs;
	     	}

        	return {
				success: true,
				message: 'R$ ' + price + ' added succesfully by @' + user.name
			};
		},
		join_shared: function join_shared(user_id, item_id, quantity, obs){
			var order = this.find_by_user(user_id);

	        if(!order) {
	        	return {
					success: false,
					message: 'You are not an owners or you do not have any open orders'
				};
	        }

	        var item = restaurants_service.find_item_by_id(order.restaurant_id, item_id);

	        if(!item){
	        	return {
					success: false,
					message: 'Item ' + item_id + ' not found. Use "menu ' + order.restaurant_id + '"" to check all items'
				};
	        }

	        if(quantity < 1){
	            return {
					success: false,
					message: 'Quantity must be higher than 0'
				};
	        }

	        var user = slackTerminal.getRTMClient().dataStore.getUserById(user_id);

	        if(!order.requests.hasOwnProperty('shared'))
	        	order.requests['shared'] = {};

	        var userRequest = order.requests['shared'];

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
				message: item.name + ' (x' + quantity + ') added succesfully to everyone'
			};
		},
		set_delivery_price: function set_delivery_price(user_id, price){
			var order = this.find_by_user(user_id);

	        if(!order) {
	        	return {
					success: false,
					message: 'You are not an owners or you do not have any open orders'
				};
	        }

	        if(price <= 0){
	        	return {
					success: false,
					message: 'Price must be greater than 0'
				};
	        }

	        order.deliveryPrice = price;

	        return {
				success: true,
				message: 'R$ ' + price + ' set as delivery price by @' + order.username
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
		close: function close(user_id){
			var order = this.find_by_user(user_id);

			if(!order){
				return {
					success: false,
					message: 'You do not have any open orders'
				};
			}

			if(!order.requests || Object.keys(order.requests).length == 0){
				delete _orders[user_id];

				return {
					success: false,
					message: 'Order from ' + order.username + ' without any request'
				};
			}

			if(!order.deliveryPrice){
				return {
					success: false,
					message: 'You have not set the delivery price. Please, use set-delivery-price command'
				};
			}

			var sharedValue = 0;

			var usersValue = [];

			if(order.deliveryPrice)
				sharedValue = order.deliveryPrice;

			Object.keys(order.requests).forEach(function(request_user_id){
				var request = order.requests[request_user_id];

				var totalValue = 0;

				Object.keys(request).forEach(function(item_id){
					totalValue += request[item_id].price * request[item_id].quantity;
				});

				if(request_user_id == 'shared'){
					sharedValue += totalValue;
				} else {
					var user = slackTerminal.getRTMClient().dataStore.getUserById(request_user_id);

					usersValue.push({
						username: user.name,
						value: totalValue
					});
				}
			});

			var splitedSharedValue = sharedValue / usersValue.length;

			usersValue.forEach(function(item){
				item.value += splitedSharedValue;
			});

			var detailMessage = this.detail_message(order.username);

			var message = detailMessage + '\n\n----------------------------- \n\n' + 
						  '@' + order.username + ' closed the order. These are the total price each one must pay:\n\n';

			usersValue.forEach(function(item){
				message += '- @' + item.username + ': R$ ' + item.value;
			});

			delete _orders[user_id];

			return {
				success: true,
				message: message
			};
		},
		detail_message: function detail_message(username){
	        var order;

	        if(username.startsWith('<@')){
	            var user_id = username.replace('<@', '').replace('>', '');
	            order = this.find_by_user(user_id);
	        } else {
	            order = this.find_by_username(username);
	        }

	        if(!order) {
	            return 'Order from ' + username + ' not found';
	        }

			var message = 'Order at ' + order.restaurant_id + ' open by @' + order.username + ':\n\n';

	        if(Object.keys(order.requests).length == 0){
	            message += 'No requests were added yet\n';
	        } else {
	            Object.keys(order.requests).forEach(function(user_id){
	                var userRequestItems = order.requests[user_id];

	                if(userRequestItems && Object.keys(userRequestItems).length > 0){
	                    var user = slackTerminal.getRTMClient().dataStore.getUserById(user_id);

	                    message += '- @' + username + ':\n';
	                
	                    Object.keys(userRequestItems).forEach(function(item_key){
	                        message += '\t- ' + 
	                                    userRequestItems[item_key].name + 
	                                    ' [x' + 
	                                    userRequestItems[item_key].quantity + 
	                                    ']' +
	                                    ' (R$ ' + 
	                                    (userRequestItems[item_key].price * userRequestItems[item_key].quantity) + 
	                                    ')\n';

	                        if(userRequestItems[item_key].obs){
	                        	message += '(Obs: ' + userRequestItems[item_key].obs + ')\n';
	                        }
	                    }); 
	                }
	            });
	        }

	        if(order.deliveryPrice){
	            message += '\nDelivery price: R$ ' + order.deliveryPrice;
	        }

	        return message;
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