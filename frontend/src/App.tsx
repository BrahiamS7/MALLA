import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";

function App() {
  type Materia = {
    codigo: number;
    nombre: string;
    creditos: number;
    semestre: number;
    facultad: string;
    estado: string;
  };
  const url = import.meta.env.VITE_API_URL;
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [creditos, setCreditos] = useState("");
  // const [codigo, setCodigo] = useState("");
  // const [nombre, setNombre] = useState("");
  // const [creditos, setCreditos] = useState("");
  // const [semestre, setSemestre] = useState("");
  // const [facultad, setFacultad] = useState("");

  useEffect(() => {
    cargarMaterias();
  }, []);

  const cargarMaterias = () => {
    fetch(`${url}/api/materias/`)
      .then((res) => res.json())
      .then((data) => {
        setMaterias(data.data);
        setCreditos(data.creditos);
        console.log("Materias cargadas:", data.data);
      })
      .catch((err) => console.log(err));
  };

  // const handleSubmit = () => {
  //   fetch("/api/materias/addMate", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ codigo, nombre, semestre, creditos, facultad }),
  //     credentials: "include",
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setCodigo("");
  //       setSemestre("");
  //       setNombre("");
  //       setCreditos("");
  //       setFacultad("");
  //       cargarMaterias();
  //       setMsg(data.msg);
  //     });
  // };
  // const handleDelete = async (codigo: number) => {
  //   try {
  //     const res = await fetch(`/api/materias/deleteMate/${codigo}`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include",
  //     });
  //     const data = await res.json();
  //     setMsg(data.msg);
  //     cargarMaterias();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const changeStatus = async (codigo: number) => {
    console.log("cambiando materia:" + codigo);

    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/materias/changeStatus/${codigo}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      console.log("recargando materias");
      cargarMaterias();
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
          .map(Number)
          .sort((a, b) => a - b)
          .map((semestre) => (
            <div key={semestre}>
              <h1 className="text-center" style={{ fontSize: "20px" }}>
                Semestre {semestre}
              </h1>
              {materiasPorSemestre[Number(semestre)].map((mate) => (
                <div
                  key={mate.codigo}
                  style={{ marginBottom: "12px", position: "relative" }}
                >
                  <div>
                    <Card
                      onClick={() => changeStatus(mate.codigo)}
                      bg={
                        mate.facultad === "ciencias basicas"
                          ? undefined
                          : mate.facultad === "ciencias ingenieria"
                          ? "info"
                          : mate.facultad === "complementaria"
                          ? "success"
                          : "secondary"
                      }
                      text={"white"}
                      className={
                        mate.estado === "tachado"
                          ? "tachado mb-2"
                          : mate.estado === "bloqueado"
                          ? "bloqueado mb-2"
                          : "mb-2"
                      }
                      style={{
                        width: "130px",
                        height: "120px",
                        position: "relative",
                        borderRadius: "10px",
                        cursor: "pointer",
                        backgroundColor:
                          mate.facultad === "ciencias basicas"
                            ? "purple"
                            : undefined,
                      }}
                    >
                      <Card.Header style={{ fontSize: "8px" }}>
                        {mate.codigo} - Créditos: {mate.creditos}
                      </Card.Header>
                      <Card.Body>
                        <Card.Title
                          style={{ fontSize: "8px", textAlign: "center" }}
                        >
                          {mate.nombre}
                        </Card.Title>
                      </Card.Body>
                      <Card.Footer style={{ fontSize: "10px" }}>
                        Semestre {mate.semestre}
                      </Card.Footer>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>

      {/* <form style={{ padding: "20px" }}>
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
        <select value={facultad} onChange={(e) => setFacultad(e.target.value)}>
          <option value="">Escoger facultad</option>
          <option value="ciencias basicas">Ciencias Basicas</option>
          <option value="ciencias ingenieria">Ciencias en Ingenieria</option>
          <option value="complementaria">Complementaria</option>
          <option value="ingenieria aplicada">Ingenieria aplicada</option>
        </select>
        <input type="text" readOnly placeholder="Estado" />
        <input type="submit" value="Enviar" onClick={handleSubmit} />
      </form>
      <p>{msg}</p> */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          overflowX: "auto",
          gap: "20px",
          padding: "20px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
          }}
        >
          <p className="areas">
            <label className="morado"></label>Area de ciencias basicas
          </p>
          <p className="areas">
            <label className="azul"></label> Area de ciencias basicas en
            Ingenieria
          </p>
          <p className="areas">
            <label className="verde"></label>Area de formacion complementaria
          </p>
          <p className="areas">
            <label className="gris"></label>Area de ingenieria aplicada
          </p>
        </div>
        <div
          className="credit"
          style={{
            display: "flex",
          }}
        >
          <h4
            style={{
              margin: "0 10px",
            }}
          >
            Creditos Totales: 162
          </h4>
          <h4
            style={{
              margin: "0 10px",
            }}
          >
            Creditos Aprobados: {creditos}
          </h4>
        </div>
      </div>
    </>
  );
}

export default App;
