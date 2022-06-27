const express = require("express");
const Certificado = require("../models/Certificado");
const CertificadoRouter = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/authAdmin");
const User = require("../models/User");
const Product = require("../models/Product");

//CREAR CERTIFICADO
CertificadoRouter.post("/certificados", auth, async (req, res) => {
    const user = await User.findById(req.user.id)
    const {
        productId,
        bastidor
    } = req.body
    try {
        if (!user || !productId || !bastidor) {
            return res.json({
                success: false,
                message: "Faltan datos"
            })
        }

        if ((bastidor.length < 15) || (bastidor.search(/[U,I,R,A,X]/) < 0)) {
            return res.json({
                success: false,
                message: "Numero no corresponde con nuestros productos"
            })
        }
        const certifi = await Certificado.findOne({bastidor})
        if (certifi) {
        return res.status(400).json({
            success: false,
            message: "Bastidor ya registrado"
        })
    }
        const certificado = new Certificado({
            user: req.user.id,
            products: productId,
            bastidor
        })

        let newCertificado = await certificado.save()
        return res.json({
            success: true,
            user: user,
            products: productId,
            certificado: newCertificado
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
})

//OBTENER CERTIFICADOS
CertificadoRouter.get("/buscarCertificados", auth, admin, async(req, res)=>{
    let certificado = await Certificado.find({})
    return res.json({
        success: true,
        certificado
    })
})

module.exports = CertificadoRouter 