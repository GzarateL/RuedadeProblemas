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

const desafioSchema = z.object({
  titulo: z.string().min(5, { message: "Título requerido (mínimo 5 caracteres)." }),
  descripcion: z.string().min(10, { message: "Descripción requerida (mínimo 10 caracteres)." }),
  impacto: z.string().optional(),
  intentos_previos: z.string().optional(),
  solucion_imaginada: z.string().optional(),
  palabrasClave: z.string().optional(),
});

type DesafioFormData = z.infer<typeof desafioSchema>;
type FieldErrors = { [key in keyof DesafioFormData]?: string };

interface Props {
  desafioId: string;
}

export default function FormularioEditarDesafio({ desafioId }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState<DesafioFormData>({
    titulo: "",
    descripcion: "",
    impacto: "",
    intentos_previos: "",
    solucion_imaginada: "",
    palabrasClave: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    fetchDesafio();
  }, [desafioId]);

  const fetchDesafio = async () => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error("No autenticado");
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/desafios/${desafioId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Error al cargar desafío');

      const data = await res.json();
      setFormData({
        titulo: data.titulo || "",
        descripcion: data.descripcion || "",
        impacto: data.impacto || "",
        intentos_previos: data.intentos_previos || "",
        solucion_imaginada: data.solucion_imaginada || "",
        palabrasClave: data.palabras_clave || "",
      });
    } catch (err: any) {
      toast.error("Error", { description: err.message });
      router.push('/desafio');
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
    const result = desafioSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach(issue => {
        const path = issue.path[0] as keyof DesafioFormData;
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/desafios/${desafioId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar el desafío.");
      }

      toast.success("¡Desafío Actualizado!", { description: "Los cambios han sido guardados correctamente." });
      router.push("/desafio");
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
        <CardTitle className="text-2xl font-bold text-black">Editar Desafío</CardTitle>
        <CardDescription className="text-neutral-700">Modifica los datos de tu desafío.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título del Desafío *</Label>
            <Input
              id="titulo"
              name="titulo"
              placeholder="Ej: Reducir consumo de agua en proceso X"
              value={formData.titulo}
              onChange={handleChange}
            />
            {errors.titulo && <p className="text-sm text-red-600">{errors.titulo}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción Detallada *</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              placeholder="Contexto, problema específico, qué se necesita..."
              value={formData.descripcion}
              onChange={handleChange}
              rows={5}
            />
            {errors.descripcion && <p className="text-sm text-red-600">{errors.descripcion}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="impacto">Impacto Esperado</Label>
            <Textarea
              id="impacto"
              name="impacto"
              placeholder="Beneficios si se resuelve (económico, social, ambiental...)"
              value={formData.impacto}
              onChange={handleChange}
              rows={3}
            />
            {errors.impacto && <p className="text-sm text-red-600">{errors.impacto}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="intentos_previos">Intentos Previos (si los hubo)</Label>
            <Textarea
              id="intentos_previos"
              name="intentos_previos"
              placeholder="¿Qué se ha intentado antes para solucionar esto?"
              value={formData.intentos_previos}
              onChange={handleChange}
              rows={3}
            />
            {errors.intentos_previos && <p className="text-sm text-red-600">{errors.intentos_previos}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="solucion_imaginada">Solución Imaginada (opcional)</Label>
            <Textarea
              id="solucion_imaginada"
              name="solucion_imaginada"
              placeholder="¿Tienes alguna idea de cómo podría ser la solución?"
              value={formData.solucion_imaginada}
              onChange={handleChange}
              rows={3}
            />
            {errors.solucion_imaginada && <p className="text-sm text-red-600">{errors.solucion_imaginada}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="palabrasClave">Palabras Clave</Label>
            <Input
              id="palabrasClave"
              name="palabrasClave"
              placeholder="Separadas por comas (ej: agricultura, sensores, optimización)"
              value={formData.palabrasClave}
              onChange={handleChange}
            />
            <p className="text-xs text-neutral-500">Ayudan a conectar tu desafío con capacidades.</p>
            {errors.palabrasClave && <p className="text-sm text-red-600">{errors.palabrasClave}</p>}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push('/desafio')}
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
