"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const academiaSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Contraseña debe tener al menos 6 caracteres" }),
  confirmPassword: z.string(),
  institucion: z.string().min(2, { message: "Institución requerida" }),
  nombres_apellidos: z.string().min(2, { message: "Nombres y apellidos requeridos" }),
  cargo: z.string().optional(),
  programa_estudio: z.string().optional(),
  telefono: z.string().optional(),
  tipo_participacion: z.enum(["Presencial", "Virtual"]),
  dias_interes: z.array(z.number()).min(1, { message: "Seleccione al menos un día de interés" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type AcademiaFormData = z.infer<typeof academiaSchema>;
type FieldErrors = { [key in keyof AcademiaFormData]?: string };

interface Props {
  onBack: () => void;
}

const diasEvento = [
  { id: 1, nombre: "Día 0: Lanzamiento y Cóctel de Prensa", fecha: "1 Dic" },
  { id: 2, nombre: "Día 1: Talento y Educación", fecha: "2 Dic" },
  { id: 3, nombre: "Día 2: Sector Empresarial", fecha: "3 Dic" },
  { id: 4, nombre: "Día 3: Desarrollo Humano", fecha: "4 Dic" },
  { id: 5, nombre: "Día 4: Gestión Pública", fecha: "5 Dic" },
  { id: 6, nombre: "Día 5: Sociedad Civil", fecha: "6 Dic" },
];

export function FormularioAcademia({ onBack }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AcademiaFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    institucion: "",
    nombres_apellidos: "",
    cargo: "",
    programa_estudio: "",
    telefono: "",
    tipo_participacion: "Presencial",
    dias_interes: [],
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FieldErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FieldErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDiaChange = (diaId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      dias_interes: checked 
        ? [...prev.dias_interes, diaId]
        : prev.dias_interes.filter(id => id !== diaId)
    }));
    if (errors.dias_interes) {
      setErrors(prev => ({ ...prev, dias_interes: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const result = academiaSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach(issue => {
        const path = issue.path[0] as keyof AcademiaFormData;
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
        programa_estudio: dataToSend.programa_estudio || null,
        telefono: dataToSend.telefono || null
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/academia`, {
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
        <CardTitle className="text-2xl font-bold text-black">Registro Academia</CardTitle>
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
                placeholder="correo@institucion.edu"
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

          {/* Datos personales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Datos personales</h3>
            
            <div className="space-y-2">
              <Label htmlFor="institucion">Institución *</Label>
              <Input
                id="institucion"
                name="institucion"
                placeholder="Universidad, Instituto, Colegio..."
                value={formData.institucion}
                onChange={handleChange}
              />
              {errors.institucion && <p className="text-sm text-red-600">{errors.institucion}</p>}
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
                  placeholder="Director, Docente, Investigador..."
                  value={formData.cargo}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="programa_estudio">Programa de Estudio</Label>
                <Input
                  id="programa_estudio"
                  name="programa_estudio"
                  placeholder="Carrera, especialidad..."
                  value={formData.programa_estudio}
                  onChange={handleChange}
                />
              </div>
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

          {/* Participación */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Modalidad de participación</h3>
            
            <div className="space-y-2">
              <Label>Tipo de participación *</Label>
              <Select value={formData.tipo_participacion} onValueChange={(value) => handleSelectChange("tipo_participacion", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione modalidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Presencial">Presencial</SelectItem>
                  <SelectItem value="Virtual">Virtual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Días de interés *</Label>
              <div className="grid grid-cols-1 gap-3">
                {diasEvento.map((dia) => (
                  <div key={dia.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`dia-${dia.id}`}
                      checked={formData.dias_interes.includes(dia.id)}
                      onCheckedChange={(checked) => handleDiaChange(dia.id, checked as boolean)}
                    />
                    <Label htmlFor={`dia-${dia.id}`} className="text-sm">
                      <span className="font-medium">{dia.fecha}</span> - {dia.nombre}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.dias_interes && <p className="text-sm text-red-600">{errors.dias_interes}</p>}
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