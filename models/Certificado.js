const mongoose = require("mongoose")

const CertificadoSchema = mongoose.Schema({
    usuarioId:{
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    user:{
        type:String
    },
    productoId:{
        type: mongoose.Types.ObjectId,
        ref: "Product"
    },
    products:{
        type: String
    },
    bastidor:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Certificado", CertificadoSchema)