import { useEffect, useState } from "react";
import { ImFileEmpty } from "react-icons/im";
import { StudentCard } from "../components/students/StudentCard";
import { get } from "react-hook-form";
import { ProfessorCard } from "../components/students/ProfessorCard";

export default function GetProfessor() {
  const [professor, GetProfessor ] = useState([]);

   useEffect(() => {
    GetProfessor([
      {_id:1,nombre:"Ana",materia:"POO"},
      {_id:2,nombre:"Jose",materia:"Calculo"},
      {_id:3,nombre:"Miguel",materia:"Biologia"}
    ]);
  }, []);
  const deleteProfessor = (id) => {
    GetProfessor(professor.filter((est) => est._id !== id ))
  }

  return (
 
     <>
      {professor.length === 0 && (
        <div className="flex justify-center items-center p-10">
          <div>
            <ImFileEmpty className="text-6xl text-gray-400 m-auto my-2" />
            <h1 className="font-bold text-xl">
              No existen profesores ingresados
            </h1>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
        {professor.map((professor) => (
          <ProfessorCard professor={professor} deleteProfessor={deleteProfessor} key={professor._id} />
         ))}
      </div>
    </>
     
 
  );
}