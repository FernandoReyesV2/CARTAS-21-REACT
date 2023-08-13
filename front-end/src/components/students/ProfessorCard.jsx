import { Button, ButtonLink, Card } from "../ui";

export function ProfessorCard({ professor,deleteProfessor }) { 
  //const { deleteStudent } = useStudents();

  return (
    <Card>
      <header className="flex justify-between">
        <h1 className="text-2xl font-bold">{professor.nombre}</h1>
        <div className="flex gap-x-2 items-center">
          <Button onClick={() => deleteProfessor(professor._id)}>Delete</Button>
          <ButtonLink to={`/professor/${JSON.stringify(professor)}`}>Edit</ButtonLink>
        </div>
      </header>
      <p className="text-slate-300"><span className="text-blue-400 font-bold">Nota1:</span> {professor.materia}</p>
    </Card>
  );
}