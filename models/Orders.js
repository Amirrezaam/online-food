const mongoose = require("mongoose");

const schema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food'
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        // default: 1,
    },
    isPayment:{
        type: Boolean
    }
})

const model = mongoose.models?.Orders || mongoose.model("Orders", schema);

export default model;