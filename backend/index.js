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

// UTILIDADES
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://malla-pk08grn7f-brahiams7s-projects.vercel.app",
      "https://malla-33ng.onrender.com",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: "true",
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
