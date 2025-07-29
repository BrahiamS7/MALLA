// IMPORTACIONES
import express from "express";
import cors from 'cors'

//IMPORTACIONES DE RUTAS
import materiasRoutes from './routes/materias.routes.js'

// CONSTANTES
const app=express();
const port=3001;

// UTILIDADES
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))



// RUTAS
app.get("/api",(req,res)=>{
    res.json({msg:"API funcionando correctamente"})
})
app.use('/api/materias',materiasRoutes)



//RUTA LISTEN
app.listen(port,()=>{
    console.log(`SERVER RUNNING IN PORT ${port}`);
})