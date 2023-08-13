import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Input, Label } from "../components/ui";
import { useForm } from "react-hook-form";


export default function FormProfessor() {
  const {register,handleSubmit,setValue, formState: { errors }} = useForm();
   
  const navigate = useNavigate();
  const params = useParams();
  
  const onSubmit = (values) => {
    if (params.id) {
      console.log("Profesor Actualizado...")
      alert("Profesor Actualizado...")
    }else{
      console.log("Profesor Insertado...")
      alert("Profesor Insertado...")
    }  
    console.log(values)
  };

   useEffect(() => {
    const loadStudent = () => {
      //console.log(params.id)
      if (params.id) {
        const student = JSON.parse(params.id)
        console.log(student)
        setValue("Nombre", student.nombre);
        setValue("Materia", student.Materia);
      }
    };
    loadStudent();
  }, []);

  return (
     <Card>
	    <form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          type="text"
          placeholder="Ingrese nombre"
          {...register("nombre",{ required: {value:true,message:"Nombre es requerido"} })}
          autoFocus
        />
        {errors.nombre && (
          <p className="text-red-500 font-semibold">{errors.nombre.message}</p>
        )}
        <Label htmlFor="Materia">Materia:</Label>
         <Input 
            type="text"
            placeholder="Escriba la materia..."
            {...register("Materia", { required: {value:true,message:"Materia es requerido"} })}
          />
          {errors.Materia && (<p className="text-red-500 font-semibold">{errors.Materia.message}</p>)}
        <Button>Grabar Registro</Button>
      </form>
     </Card> 
  );
}