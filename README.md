# Slack iFood Agent

A slackbot that helps groups of users to make orders from [iFood](ifood.com.br) on [Slack](https://slack.com/). Made using [node.js](https://nodejs.org) and [slack-terminalize](https://github.com/ggauravr/slack-terminalize) package.

## How does it works?

In large groups of people working together, it may be hard to ask for food and keep track of every person in a chat.
This slackbot helps to organize the order by providing a way that multiple persons make requests to a single iFood order on Slack, automatically calculating the price each one must pay.

When someone creates an order, an alert will pop on channel, and users can join using "order-join" command or use the "menu" command to check all the possible items. You can also add a shared request (shared for everyone) or a custom request (by adding the price instead of the desired item). Users can also give up on request or order when using specific commands.

By closing the order, all prices will be calculated automatically and all users will receive how much they must pay, while the order creator will have a list to what order on iFood.

### Commands

As a slackbot, Slack iFood Agent needs to receive specific commands to work, as listed below:

- **help**: Lists all available command;
- **menu _[restaurant-id]_**: Lists the restaurants menu;
_Ex: menu nilo_
- **order _[restaurant-id]_**: Creates an order to a specific restaurant. You cannot create more than one order per user;
_Ex: order nilo_
- **order-check _[username]_**: Check the order status from an open order made by a specific username;
_Ex: order-check @mariotoledo_
- **order-join _[username] [item-id] [quantity] [obs (optional)]_**: Makes a request to an open order made by a specific username. You must provide an item id (the desired food you want) and a quantity. Also, you can pass some observation, if needed;
_Ex: order-join @mariotoledo carne 1 fechada_
- **order-custom _[username] [label] [price]_**: Creates a custom request without having to specify an item id. You must provide an item label and a price;
_Ex: order-custom @mariotoledo risoli 2.50_
- **order-shared _[username] [item-id] [quantity] [obs (optional)]_**: Creates a shared request to all users. The item price will be divided to all users when the order closes;
_Ex: order-shared @mariotoledo refrigerante-2l 1_
- **order-unjoin _[username] [item-id] [quantity]_**: Removes a request from an open order;
_Ex: order-unjoin @mariotoledo carne 1 fechada_
- **order-delete**: Removes an open order. You must be the order's creator to do that;
_Ex: order-delete
- **set-delivery-price _[price]_**: Specifies the delivery price;
_Ex: set-delivery-price 5.50_
- **order-close**: Closes the open order. All the items will be calculated and printed. You must be the order's creator to do that;
_Ex: order-close

## Installation

If you want to use Slack iFood Agent on your team's Slack, then you must configure a few things before:

- Creates a Slack App: Go to _https://<your-team-name>.slack.com/services/new/bot_, create a new bot and copy the API token
- Add API token: Open **index.js** and replace the API token on int function:

```javascript
var slackTerminal = require('slack-terminalize');

slackTerminal.init('PUT API TOKEN HERE', {
}, {
    CONFIG_DIR: __dirname + '/config',
    COMMAND_DIR: __dirname + '/commands'
});
```
- Configuring restaurants and menus: All restaurants and menus must be configured in **restaurants.json** file. As **iFood does not have an API**, we made a parser as shown on **parse.js**.
- Turning agent available for use: You can execute the agent on your computer (node index.js) or deploying it to an instance like [Heroku](https://heroku.com/).

## Development
If you want to help in development, these is how the project is configured:

- commands folder: all commands scripts must be included here. Each commands receives params as default, where you can receive parameters from Slack, as listed below:
-- user: A string with the user id that used the command
-- channel: A string the channel where the command was executed
-- params: An array with all the params inserted after the command.
- commands.json: a JSON file containing all the avaiable commands
- restaurants.json: a JSON file containing all the available restaurants and menus
- service folder: stores all services. All features must be implemented in suitable services, as orders_service or restaurants_service
- util.js: contains helpers functions, as postMessage function
