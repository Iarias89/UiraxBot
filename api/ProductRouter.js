const express = require("express");
const Product = require("../models/Product");
const ProductRouter = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/authAdmin");
const cloudinary = require("cloudinary");
const fs = require("fs");


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

//Crear subir imagen aparte del crear producto...........
ProductRouter.post("/uploadManual", auth, admin,async (req,res)=>{
    try{
        if(!req.files || Object.keys(req.files).length===0)
        return res.status(400).json({
            success: false,
            message: "No se ha encontrado el archivo."
        })

        const file = req.files.file;
        console.log(file)
        
        if(file.mimetype !== "image/jpeg" && file.mimetype !== "image/png"){
            removeTmp(file.tempFilePath)
            return res.status(400).json({
            sucess: false,
            message: "Formato de archivo incorrecto"
        }) 
        }
        cloudinary.v2.uploader.upload(file.tempFilePath, {folder: "manuales"}, async(err,result)=>{
            if(err) throw err;
            removeTmp(file.tempFilePath)
            res.json({
                success: true,
                public_id: result.public_id,
                url: result.secure_url
            })
        })

        
    } catch(err){
        
        res.status(500).json({
            success: false,
            message: "Fallo general"
        })
    }
})
//.......................CREAR PRODUCTO
ProductRouter.post("/crearProducto", auth, admin, async (req, res) => {
    try {
        const {
            name,
            public_id,
            url
        } = req.body
        if (!name || !public_id || !url) {
            return res.json({
                success: false,
                message: "Faltan datos por completar"
            })
        }
        const product = await Product.findOne({
            name
        })
        if (product) {
            return res.status(400).json({
                success: false,
                message: "Producto ya registrado"
            })
        }
        const newProduct = new Product({
            name,
            public_id,
            url
        })
        await newProduct.save();
        return res.json({
            success: true,
            name,
            public_id,
            url,
            message: "Producto registrado correctamente!"
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
})

//......................MOSTRAR PRODUCTOS
ProductRouter.get("/products", async (req, res) => {
    let productos = await Product.find({})
    return res.json({
        success: true,
        productos
    })
})

//MOSTRAR PRODUCTO POR ID
ProductRouter.get("/findProduct/:id", async (req, res) => {
    const {
        id
    } = req.params
    try {
        let producto = await Product.findById(id)
        res.status(200).json({
            success: true,
            producto
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }

})

//........................ACTUALIZAR PRODUCTO
ProductRouter.put("/updateProduct", auth, admin, async (req, res) => {
    try {
        const {
            id
        } = req.body
        const {
            name,
            public_id,
            url,

        } = req.body

        await User.findOneAndUpdate(id, {
            name,
            public_id,
            url,
        })
        res.status(200).json({
            success: true,
            message: "Producto actualizado"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

//......................ELIMINAR PRODUCTO
ProductRouter.delete("/deleteProduct", auth, admin, async (req, res) => {
    try {
        const {
            id
        } = req.body
        await Product.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: "Producto borrado correctamente!"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

const removeTmp = (path) => {
    fs.unlink(path, (err) => {
        if (err) throw err;
    });
};

module.exports = ProductRouter