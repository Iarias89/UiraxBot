const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    surname:{
        type:String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    productsId:{
        type: mongoose.Types.ObjectId,
        ref: "products"
    },
    role:{
        type: Number,
        default: 0
    }
}) 

module.exports = mongoose.model("User", UserSchema)