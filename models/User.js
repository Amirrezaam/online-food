const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    number:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    }
})

const model = mongoose.models?.User || mongoose.model("User", schema);

export default model;