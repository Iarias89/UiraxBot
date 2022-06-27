const express = require("express");
const User = require("../models/User");
const UserRouter = express.Router();
const bcrypt = require("bcrypt")
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const admin = require("../middleware/authAdmin");

//REGISTRO NUEVO USUARIO
UserRouter.post("/register", async (req, res) => {
    try {
        const {
            name,
            surname,
            email,
            password,
        } = req.body

        if (!name || !surname || !email || !password) {
            return res.json({
                success: false,
                message: "Faltan datos por completar"
            })
        }

        const user = await User.findOne({
            email
        })
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Usuario ya registrado"
            })
        }

        if (!(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i).test(email)){
           return res.json({
                success: false,
                message: "El email introducido no es correcto"
           })
        }

        if ((password.length < 8) || (password.search(/[a-z]/i) < 0) || (password.search(/[0-9]/) < 0) || (password.search(/[A-Z]/) < 0)) {
            return res.json({
                success: false,
                message: "La contraseña tiene que tener un mínimo de ocho carácteres, incluyendo una mayúscula, una minúscula y un número "
            })
        }

        let passwordHash = bcrypt.hashSync(password, salt);

        const newUser = new User({
            name,
            surname,
            email,
            password: passwordHash
        })

        await newUser.save()

        const accessToken = createAccessToken({id:newUser._id})

        return res.json({
            success: true,
            newUser,
            accessToken,
            message: "Usuario registrado correctamente!"
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
})

//LOGUEO DE USUARIO
UserRouter.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body
        if (!email || !password) {
            return res.json({
                success: false,
                message: "Faltan datos por completar"
            })
        }

        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Usuario no registrado"
            })
        }
        const passwordTest = await bcrypt.compare(password, user.password)
        if (!passwordTest) return res.status(400).json({
            success: false,
            message: "Contraseña incorrecta"
        })

        const accessToken = createAccessToken({id:user._id})

        return res.status(200).json({
            success:true,
            accessToken,
            message: "Usuario registrado correctamente"
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
})

//AÑADIR PRODUCTO A USUARIO 
UserRouter.post("/usuario/products", auth, async (req, res) => {
    try {
        const {
           productsId
        } = req.body

        const products = await User.findOne({
            productsId
        })
        if (products) {
            return res.status(400).json({
                success: false,
                message: "Producto ya registrado"
            })
        }

        if (req.user.productsId){
            return res.json({
                success: false,
                message: "Producto ya añadido"
            })
        }

        await User.findOneAndUpdate({_id:req.user.id},{
        productsId})
        
        res.status(200).json({
            success: true,
            productsId,
            message: "Producto añadido"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

//MOSTRAR TODOS LOS USUARIOS
UserRouter.get("/", auth, admin, async (req, res) => {
    let users = await User.find({})
    return res.json({
        success: true,
        users
    })
})

//MOSTRAR UN USUARIO CONCRETO
UserRouter.get("/find", auth, async (req, res) => {
    const {
        id
    } = req.user
    try {
        let user = await User.findById(id)
        res.status(200).json({
            success: true,
            user
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }

})

//ACTUALIZAR USUARIO
UserRouter.put("/updateUser", auth , async (req, res,) => {
    try {
        const {name, email, password} = req.body
        const user = await User.findById(req.user.id)

        if(!user)return res.status(400).json({
            success:false,
            message: "Usuario no existe"
        })

        let passwordHash = bcrypt.hashSync(password, salt);

        await User.findOneAndUpdate({_id:req.user.id}, {
            name,
            email,
            password: passwordHash
        })
        res.status(200).json({
            success: true,
            message: "Usuario actualizado correctamente"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

//ELIMINAR USUARIO
UserRouter.delete("/deleteUser", auth , async (req, res) => {
    try {
        await User.findById(req.user.id)
        await User.findByIdAndDelete({_id:req.user.id})
        res.status(200).json({
            success: true,
            message: "Usuario borrado correctamente!"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
});

const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '11d'})
}

module.exports = UserRouter