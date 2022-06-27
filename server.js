require("dotenv").config();
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose");
const ProductRouter = require("./api/ProductRouter");
const UserRouter = require("./api/UserRouter");
const CertificadoRouter = require("./api/CertificadoRouter");
const fileUpload = require("express-fileupload");
const path = require ("path");

const app = express();
app.use(express.json()); //para que use archivos JSON meter datos por postman
app.use(express.urlencoded({ extended: true})); //Pueda leer los datos dados por el postman
app.use (fileUpload({
    useTempFiles:true
}));
app.use(cors())
app.use("/api", UserRouter);
app.use("/api", ProductRouter);
app.use("/api", CertificadoRouter)
const URI = process.env.MONGODB_URL//Llamar a la base de datos
mongoose.connect(URI,{
}).then(()=>{
    console.log("BBDD is now connected")
}).catch(err=>{
    console.log(err)
})



if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}
app.listen(5000, () => console.log("server is run on port 5000"))