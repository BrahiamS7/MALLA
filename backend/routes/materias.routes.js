import express from "express";
import db from "../db.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM materias ORDER BY codigo");
  const data = result.rows;
  const creditos=await db.query("SELECT sum(creditos) FROM materias WHERE estado='tachado'")
  res.json({ data: data, msg: "Materias cargando..." ,creditos:creditos.rows[0].sum});
});
router.get("/getStatus", async (req, res) => {
  const result = await db.query(
    "SELECT m.codigo AS codigo_materia, m.nombre AS nombre_materia, m.estado AS estado_materia, r.requiere_codigo, mr.estado AS estado_requisito FROM materias m JOIN requisitos r ON m.codigo = r.materia_codigo JOIN  materias mr ON r.requiere_codigo = mr.codigo;"
  );
  const data = result.rows;
  res.json({ data });
});

router.post("/addMate", async (req, res) => {
  const codigo = req.body.codigo;
  const creditos = req.body.creditos;
  const semestre = req.body.semestre;
  const nombre = req.body.nombre;
  const facultad = req.body.facultad;
  await db.query(
    "INSERT INTO materias (codigo,nombre,creditos,semestre,facultad,estado) VALUES ($1,$2,$3,$4,$5,'bloqueado')",
    [codigo, nombre, creditos, semestre, facultad]
  );
  res.json({ msg: "Materia añadida correctamente" });
});

router.post("/deleteMate/:codigo", async (req, res) => {
  const codigo = req.params.codigo;
  await db.query("DELETE FROM materias WHERE codigo=$1", [codigo]);
  res.json({ msg: "Eliminado correctamente" });
});

router.post("/changeStatus/:codigo", async (req, res) => {
  const codigo = req.params.codigo;
  const result = await db.query("SELECT * FROM materias WHERE codigo=$1", [
    codigo,
  ]);
  const mate = result.rows[0];
  let nuevoEstado;
  switch (mate.estado) {
    case "disponible":
      nuevoEstado = "tachado";
      break;
    case "tachado":
      nuevoEstado = "disponible";
      break;
    default:
      return res.status(400).json({ msg: "Estado invalido" });
  }
  await db.query("UPDATE materias SET estado=$1 WHERE codigo=$2", [
    nuevoEstado,
    codigo,
  ]);
  //CAMBIAR ESTADO DE MATERIA DEPENDIENTE
  async function actualizarDependientes(codigo) {
    const dependientes = await db.query(
      "SELECT m.codigo FROM requisitos r JOIN materias m ON m.codigo = r.materia_codigo WHERE r.requiere_codigo = $1",
      [codigo]
    );

    for (const dep of dependientes.rows) {
      const requisitos = await db.query(
        "SELECT mr.estado FROM requisitos r JOIN materias mr ON r.requiere_codigo = mr.codigo WHERE r.materia_codigo = $1",
        [dep.codigo]
      );

      const todosTachados = requisitos.rows.every(
        (req) => req.estado === "tachado"
      );

      const nuevoEstado = todosTachados ? "disponible" : "bloqueado";

      await db.query("UPDATE materias SET estado = $1 WHERE codigo = $2", [
        nuevoEstado,
        dep.codigo,
      ]);

      await actualizarDependientes(dep.codigo);
    }
  }
  await actualizarDependientes(codigo);
  return res.json({ msg: "Hola" });
});

export default router;
