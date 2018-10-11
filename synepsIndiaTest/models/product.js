
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = Schema({
    productName: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String, required: true }


});



var product = mongoose.model('product', productSchema);

module.exports = product;