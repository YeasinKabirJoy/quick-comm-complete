const mongoose = require('mongoose'); // Erase if already required
const ObjectId = mongoose.Schema.Types.ObjectId;
// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    sold: {
        type: Number,
        default: 0,
        select: false,
    },
    images: [],
    color: [],
    tags: [],
    ratings: [
        {
            star: Number,
            comment: String,
            postedby: { type: ObjectId, ref: "User" },
        },
    ],
    totalrating: {
        type: String,
        default: 0,
    },

},
    { timestamps: true }
);

//Export the model
module.exports = mongoose.model('Product', productSchema);