"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const unsaSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Contraseña debe tener al menos 6 caracteres" }),
  confirmPassword: z.string(),
  nombres_apellidos: z.string().min(2, { message: "Nombres y apellidos requeridos" }),
  cargo: z.string().optional(),
  telefono: z.string().optional(),
  unidad_academica: z.string().min(2, { message: "Unidad académica requerida" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type UnsaFormData = z.infer<typeof unsaSchema>;
type FieldErrors = { [key in keyof UnsaFormData]?: string };

interface Props {
  onBack: () => void;
}

export function FormularioUnsa({ onBack }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UnsaFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    nombres_apellidos: "",
    cargo: "",
    telefono: "",
    unidad_academica: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FieldErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const result = unsaSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach(issue => {
        const path = issue.path[0] as keyof UnsaFormData;
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

    try {
      // Remove confirmPassword from the data sent to backend and ensure proper null values
      const { confirmPassword, ...dataToSend } = formData;
      
      // Convert empty strings to null for optional fields
      const cleanedData = {
        ...dataToSend,
        cargo: dataToSend.cargo || null,
        telefono: dataToSend.telefono || null
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/unsa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al registrar usuario");
      }

      toast.success("¡Registro exitoso!", { description: "Tu cuenta ha sido creada correctamente." });
      router.push("/login?success=registered");

    } catch (error: any) {
      setIsLoading(false);
      toast.error("Error en el registro", { description: error.message });
    }
  };

  return (
    <Card className="form-card w-full max-w-2xl mx-auto my-12 border-2 border-gray-300 bg-white transition-all duration-300">
      <CardHeader>
        <button 
          onClick={onBack}
          className="mb-4 text-gray-600 hover:text-gray-900 transition-colors text-left"
        >
          ← Volver
        </button>
        <CardTitle className="text-2xl font-bold text-black">Registro Hélice Universitaria</CardTitle>
        <CardDescription className="text-neutral-700">
          Complete sus datos para participar en la Rueda de Colaboración
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos de cuenta */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Datos de cuenta</h3>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="correo@unsa.edu.pe"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repita la contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          {/* Datos académicos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Datos académicos</h3>
            
            <div className="space-y-2">
              <Label htmlFor="unidad_academica">Unidad Académica *</Label>
              <Input
                id="unidad_academica"
                name="unidad_academica"
                placeholder="Escuela, Facultad, Instituto de Investigación..."
                value={formData.unidad_academica}
                onChange={handleChange}
              />
              {errors.unidad_academica && <p className="text-sm text-red-600">{errors.unidad_academica}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombres_apellidos">Nombres y Apellidos *</Label>
              <Input
                id="nombres_apellidos"
                name="nombres_apellidos"
                placeholder="Nombre completo"
                value={formData.nombres_apellidos}
                onChange={handleChange}
              />
              {errors.nombres_apellidos && <p className="text-sm text-red-600">{errors.nombres_apellidos}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  name="cargo"
                  placeholder="Docente, Investigador, Estudiante..."
                  value={formData.cargo}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  placeholder="+51 999 999 999"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="btn-register w-full bg-white border-2 border-black text-black transition-all duration-300" 
            disabled={isLoading}
          >
            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Estilos CSS para el efecto hover
const styles = `
  .btn-register:hover {
    background-color: #D00000 !important;
    border-color: #D00000 !important;
    color: white !important;
  }
  
  .form-card:has(.btn-register:hover) {
    border-color: #D00000 !important;
  }
`;

// Inyectar estilos en el head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}