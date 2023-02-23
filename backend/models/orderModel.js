const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


var orderSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: ObjectId,
                ref: "Product",
            },
            count: Number,
            color: String,
        },
    ],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Not Processed",
        enum: [
            "Not Processed",
            "Processing",
            "Dispatched",
            "Cancelled",
            "Delivered",
        ],
    },
    orderBy: {
        type: ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);