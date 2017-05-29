function retrieveAndParse(restaurantId){
    var items = {}

    $('.result-text').each(function(i, item){
        var name = $(item).find('.text-wrap h4').html(); 
        var description = $(item).find('.text-wrap p').html();

        var span = $(item).find('.result-actions span');
        $(span).find('small').remove('small');

        var id = name.replace(/ /g, '-').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        var item_price = parseFloat(span.html().replace('R$ ', '').replace(',', '.'));

        items[id] = {
            name: name,
            price: item_price,
            description: description
        }
    });

    return items;
}