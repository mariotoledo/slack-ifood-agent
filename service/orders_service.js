module.exports = (function OrdersService() {
	var _orders = [];

	return {
		init: function init(user_id, restaurant_id){
			console.log('restaurant_id', restaurant_id);
			var current_order = this.find_by_user(user_id);

			if(current_order)
				return {
					success: false,
					message: 'You already have an open order at ' + current_order.restaurant_id
				};

			current_order = this.find_by_restaurant(restaurant_id);

			if(current_order)
				return {
					success: false,
					message: 'There is already an open order at ' + current_order.restaurant_id
				};

			_orders.push({
				owner: user_id,
				restaurant_id: restaurant_id,
				requests: []
			});

			return {
				success: true,
				message: 'Order at ' + restaurant_id + ' started successfully'
			};
		}, 
		find_by_user: function find_by_user(user_id){
			return _orders.find(function(item){
				return item.owner === user_id;
			});
		}, 
		find_by_restaurant: function find_by_restaurant(restaurant_id){
			return _orders.find(function(item){
				return item.restaurant_id === restaurant_id;
			});
		}
	}
})();