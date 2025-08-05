// IMPORTACIONES
import express from "express";
import cors from "cors";
import env from "dotenv";

//IMPORTACIONES DE RUTAS
import materiasRoutes from "./routes/materias.routes.js";

// CONSTANTES
const app = express();
const port = process.env.PORT || 3001;
env.config();
const allowedOrigins = [
  "https://malla-q7osojwy5-brahiams7s-projects.vercel.app",
  'https://malla-brahiams7s-projects.vercel.app'
];

// UTILIDADES
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// RUTAS
app.get("/api", (req, res) => {
  res.json({ msg: "API funcionando correctamente" });
});
app.use("/api/materias", materiasRoutes);

//RUTA LISTEN
app.listen(port, () => {
  console.log(`SERVER RUNNING IN PORT ${process.env.PORT}`);
});
