"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";

const capacidadSchema = z.object({
  descripcion_capacidad: z.string().min(10, { message: "Descripción requerida (mínimo 10 caracteres)." }),
  problemas_que_resuelven: z.string().optional(),
  tipos_proyectos: z.string().optional(),
  equipamiento: z.string().optional(),
  palabrasClave: z.string().optional(),
  clave_interna: z.string().optional(),
});

type CapacidadFormData = z.infer<typeof capacidadSchema>;
type FieldErrors = { [key in keyof CapacidadFormData]?: string };

interface Props {
  capacidadId: string;
}

export default function FormularioEditarCapacidad({ capacidadId }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState<CapacidadFormData>({
    descripcion_capacidad: "",
    problemas_que_resuelven: "",
    tipos_proyectos: "",
    equipamiento: "",
    palabrasClave: "",
    clave_interna: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    fetchCapacidad();
  }, [capacidadId]);

  const fetchCapacidad = async () => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error("No autenticado");
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/capacidades/${capacidadId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Error al cargar capacidad');

      const data = await res.json();
      setFormData({
        descripcion_capacidad: data.descripcion_capacidad || "",
        problemas_que_resuelven: data.problemas_que_resuelven || "",
        tipos_proyectos: data.tipos_proyectos || "",
        equipamiento: data.equipamiento || "",
        palabrasClave: data.palabras_clave || "",
        clave_interna: data.clave_interna || "",
      });
    } catch (err: any) {
      toast.error("Error", { description: err.message });
      router.push('/capacidad');
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FieldErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const result = capacidadSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach(issue => {
        const path = issue.path[0] as keyof CapacidadFormData;
        if (path) fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error("Por favor corrija los errores en el formulario.");
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const token = Cookies.get('token');

    if (!token) {
      toast.error("Error de autenticación");
      setIsLoading(false);
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/capacidades/${capacidadId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar la capacidad.");
      }

      toast.success("¡Capacidad Actualizada!", { description: "Los cambios han sido guardados correctamente." });
      router.push("/capacidad");
    } catch (error: any) {
      setIsLoading(false);
      toast.error("Error al actualizar", { description: error.message });
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto my-12 border-2 border-black bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-black">Editar Capacidad</CardTitle>
        <CardDescription className="text-neutral-700">Modifica los datos de tu capacidad.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="descripcion_capacidad">Descripción de la Capacidad *</Label>
            <Textarea
              id="descripcion_capacidad"
              name="descripcion_capacidad"
              placeholder="Detalla la capacidad, expertise, línea de investigación..."
              value={formData.descripcion_capacidad}
              onChange={handleChange}
              rows={4}
            />
            {errors.descripcion_capacidad && <p className="text-sm text-red-600">{errors.descripcion_capacidad}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="problemas_que_resuelven">Problemas que pueden resolver</Label>
            <Textarea
              id="problemas_que_resuelven"
              name="problemas_que_resuelven"
              placeholder="Ej: Optimización de procesos industriales, análisis de datos complejos..."
              value={formData.problemas_que_resuelven}
              onChange={handleChange}
              rows={3}
            />
            {errors.problemas_que_resuelven && <p className="text-sm text-red-600">{errors.problemas_que_resuelven}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipos_proyectos">Tipos de Proyectos</Label>
            <Textarea
              id="tipos_proyectos"
              name="tipos_proyectos"
              placeholder="Ej: Desarrollo de prototipos, estudios de factibilidad, consultoría técnica..."
              value={formData.tipos_proyectos}
              onChange={handleChange}
              rows={3}
            />
            {errors.tipos_proyectos && <p className="text-sm text-red-600">{errors.tipos_proyectos}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipamiento">Equipamiento Disponible</Label>
            <Textarea
              id="equipamiento"
              name="equipamiento"
              placeholder="Laboratorios, software especializado, maquinaria..."
              value={formData.equipamiento}
              onChange={handleChange}
              rows={3}
            />
            {errors.equipamiento && <p className="text-sm text-red-600">{errors.equipamiento}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="palabrasClave">Palabras Clave</Label>
            <Input
              id="palabrasClave"
              name="palabrasClave"
              placeholder="Separadas por comas (ej: inteligencia artificial, biotecnología)"
              value={formData.palabrasClave}
              onChange={handleChange}
            />
            <p className="text-xs text-neutral-500">Ayudan a encontrar tu capacidad.</p>
            {errors.palabrasClave && <p className="text-sm text-red-600">{errors.palabrasClave}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clave_interna">Clave Interna (Opcional)</Label>
            <Input
              id="clave_interna"
              name="clave_interna"
              placeholder="Código de grupo, proyecto, etc."
              value={formData.clave_interna}
              onChange={handleChange}
            />
            {errors.clave_interna && <p className="text-sm text-red-600">{errors.clave_interna}</p>}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push('/capacidad')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-white border-2 border-black text-black hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white transition-all duration-250"
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
