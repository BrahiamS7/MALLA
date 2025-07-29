import express from "express";
import db from "../db.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM materias");
  const data = result.rows;
  res.json({ data: data, msg: "Materias cargando..." });
});
router.post("/addMate", async (req, res) => {
  const codigo = req.body.codigo;
  const creditos = req.body.creditos;
  const semestre = req.body.semestre;
  const nombre = req.body.nombre;
  const facultad = req.body.facultad;
  await db.query(
    "INSERT INTO materias (codigo,nombre,creditos,semestre,facultad) VALUES ($1,$2,$3,$4,$5)",
    [codigo, nombre, creditos, semestre, facultad]
  );
  res.json({ msg: "Materia añadida correctamente" });
});

router.post("/deleteMate/:codigo", async (req, res) => {
  const codigo = req.params.codigo;
  await db.query("DELETE FROM materias WHERE codigo=$1", [codigo]);
  res.json({ msg: "Eliminado correctamente" });
});

export default router;
