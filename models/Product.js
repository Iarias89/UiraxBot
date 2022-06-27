const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    name:{
        type: String,
        // required: true
    },
    public_id:{
        type: String
    },
    url:{
        type: String
    }
        
})

module.exports = mongoose.model("Product", ProductSchema)