const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


var CartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: ObjectId,
                ref: "Product",
            },
            count: Number,
            color: String,
            price: Number,
        },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderBy: {
        type: ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Cart', CartSchema);