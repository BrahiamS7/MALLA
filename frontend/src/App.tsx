import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";

function App() {
  const [msg, setMsg] = useState("");
  type Materia = {
    codigo: number;
    nombre: string;
    creditos: number;
    semestre: number;
  };

  const [materias, setMaterias] = useState<Materia[]>([]);
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [creditos, setCreditos] = useState("");
  const [semestre, setSemestre] = useState("");
  const [facultad, setFacultad] = useState("")

  useEffect(() => {
    fetch("/api/materias/")
      .then((res) => res.json())
      .then((data) => {
        setMsg(data.msg);
        setMaterias(data.data);
        console.log(materias);
      })
      .catch((err) => console.error("Error:", err));
  }, [materias]);

  const handleSubmit = () => {
    fetch("/api/materias/addMate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo, nombre, semestre, creditos,facultad }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setCodigo("");
        setSemestre("");
        setNombre("");
        setCreditos("");
        setFacultad("");
        setMsg(data.msg);
      });
  };
  const handleDelete = async (codigo) => {
    try {
      const res = await fetch(`/api/materias/deleteUser/${codigo}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      setMsg(data.msg);
    } catch (error) {
      console.log(error);
    }
  };

  const materiasPorSemestre: { [semestre: number]: typeof materias } = {};

  materias.forEach((materia) => {
    if (!materiasPorSemestre[materia.semestre]) {
      materiasPorSemestre[materia.semestre] = [];
    }
    materiasPorSemestre[materia.semestre].push(materia);
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "20px",
          padding: "20px",
        }}
      >
        {Object.keys(materiasPorSemestre)
          .sort()
          .map((semestre) => (
            <div key={semestre}>
              <h4 className="text-center">Semestre {semestre}</h4>
              {materiasPorSemestre[Number(semestre)].map((mate) => (
                <div
                  key={mate.codigo}
                  style={{ marginBottom: "12px", position: "relative" }}
                >
                  <Card
                    bg={"primary"}
                    text={"white"}
                    className="mb-2"
                    style={{
                      width: "200px",
                      height: "180px",
                      position: "relative",
                      borderRadius: "10px",
                    }}
                  >
                    <Card.Header style={{ fontSize: "12px" }}>
                      {mate.codigo} - Créditos: {mate.creditos}
                    </Card.Header>
                    <Card.Body>
                      <Card.Title style={{ fontSize: "15px" }}>
                        {mate.nombre}
                      </Card.Title>
                    </Card.Body>
                    <Card.Footer style={{ fontSize: "12px" }}>
                      Semestre {mate.semestre}
                    </Card.Footer>
                  </Card>
                  <div className="text-center">
                    <button
                      onClick={() => handleDelete(mate.codigo)}
                      className="btn btn-sm btn-danger"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>

      {/* Formulario de agregar */}
      <form style={{ padding: "20px" }}>
        <input
          type="number"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Codigo"
        />
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de materia"
        />
        <input
          type="number"
          value={creditos}
          onChange={(e) => setCreditos(e.target.value)}
          placeholder="Creditos"
        />
        <input
          type="number"
          value={semestre}
          onChange={(e) => setSemestre(e.target.value)}
          placeholder="Semestre"
        />
        <select name="" id="">}
          <option value={facultad}>Escoger facultad</option>
          <option value={facultad}>Ciencias Basicas</option>
          <option value={facultad}>Ciencias en Ingenieria</option>
          <option value={facultad}>Complementaria</option>
          <option value={facultad}>Ingenieria aplicada</option>
        </select>
        <input
          type="text"
          readOnly
          placeholder="Estado"
        />
        <input type="submit" value="Enviar" onClick={handleSubmit} />
      </form>
    </>
  );
}

export default App;
