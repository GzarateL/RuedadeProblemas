// /frontend/src/app/registro/components/FormularioRegistro.tsx
"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BouncingBall } from "@/components/BouncingBall";
import { RainEffect } from "@/components/RainDrop";

// --- Simulación de datos ---
const helices = [
  { id: 1, nombre: "Academia" },
  { id: 2, nombre: "Gobierno" },
  { id: 3, nombre: "Empresas" },
  { id: 4, nombre: "Sociedad" },
];
const diasEvento = [
  { id: 1, nombre: "Día 0: Lanzamiento y Cóctel de Prensa (Lun, 01)" },
  { id: 2, nombre: "Día 1: Talento y Educación (Mar, 02)" },
  { id: 3, nombre: "Día 2: Sector Empresarial (Mié, 03)" },
  { id: 4, nombre: "Día 3: Desarrollo Humano (Jue, 04)" },
  { id: 5, nombre: "Día 4: Gestión Pública (Vie, 05)" },
  { id: 6, nombre: "Día 5: Sociedad Civil (Sáb, 06)" },
];

// --- 1) Esquemas Zod ---
const baseSchema = z.object({
  email: z.string().email({ message: "Correo inválido." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
  nombres_apellidos: z.string().min(3, { message: "Nombre requerido." }),
  cargo: z.string().min(2, { message: "Cargo requerido." }),
  telefono: z.string().optional(),
});
const externoSchema = baseSchema.extend({
  rol: z.literal("externo"),
  helice_id: z.string().min(1, { message: "Debe seleccionar una hélice." }),
  organizacion: z.string().min(2, { message: "Organización requerida." }),
  dias_interes: z.array(z.number()).default([]),
});
const unsaSchema = baseSchema.extend({
  rol: z.literal("unsa"),
  unidad_academica: z.string().min(3, { message: "Unidad académica requerida." }),
});
const formSchema = z.discriminatedUnion("rol", [externoSchema, unsaSchema]);

// --- 2) Tipos TS derivados de Zod ---
type ExternoFormData = z.infer<typeof externoSchema>;
type UnsaFormData = z.infer<typeof unsaSchema>;
type FormValues = ExternoFormData | UnsaFormData;

interface Props {
  rol: "externo" | "unsa";
  onVolver: () => void;
}

// --- 3) Valores iniciales tipados ---
const getInitialValues = (rol: "externo" | "unsa"): FormValues => {
  const base = {
    email: "",
    password: "",
    nombres_apellidos: "",
    cargo: "",
    telefono: "",
  };
  if (rol === "externo") {
    const externoInit: ExternoFormData = {
      ...base,
      rol: "externo",
      organizacion: "",
      dias_interes: [],
      helice_id: "",
    };
    return externoInit;
  }
  const unsaInit: UnsaFormData = {
    ...base,
    rol: "unsa",
    unidad_academica: "",
  };
  return unsaInit;
};

// --- Helper type para errores de UI ---
type FieldErrors = { [key: string]: string | undefined };

export function FormularioRegistro({ rol, onVolver }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Estado tipado con la unión y valor inicial según rol
  const [formData, setFormData] = useState<FormValues>(() => getInitialValues(rol));
  const [errors, setErrors] = useState<FieldErrors>({});



  // --- 4) Handlers genéricos para inputs comunes ---
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value } as FormValues));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  // Select SOLO para helice_id (externo)
  const handleSelectHelice = (value: string) => {
    setFormData(prev => {
      if (prev.rol !== "externo") return prev;
      return { ...prev, helice_id: value } as ExternoFormData;
    });
    if (errors["helice_id"]) setErrors(prev => ({ ...prev, helice_id: undefined }));
  };

  // Checkbox de días (externo) — shadcn devuelve boolean | "indeterminate"
  const handleCheckboxChange = (diaId: number, checked: boolean | "indeterminate") => {
    setFormData(prev => {
      if (prev.rol !== "externo") return prev;
      const current = prev.dias_interes ?? [];
      const isChecked = checked === true;
      const next = isChecked ? [...current, diaId] : current.filter(id => id !== diaId);
      return { ...prev, dias_interes: next } as ExternoFormData;
    });
    if (errors.dias_interes) setErrors(prev => ({ ...prev, dias_interes: undefined }));
  };

  // --- 5) Validación manual con Zod ---
  const validateForm = (): boolean => {
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      // Zod usa "issues", no "errors"
      result.error.issues.forEach(issue => {
        const path0 = issue.path[0];
        if (typeof path0 === "string") fieldErrors[path0] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error("Por favor corrija los errores en el formulario.");
      return false;
    }
    setErrors({});
    return true;
  };

  // --- 6) Submit ---
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    // Construcción segura por rol
    const valuesToSubmit =
      formData.rol === "externo"
        ? {
          ...formData,
          helice_id: parseInt(formData.helice_id, 10),
        }
        : { ...formData };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valuesToSubmit),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al registrar.");
      toast.success("¡Registro Exitoso!", { description: "Tu cuenta ha sido creada. Ahora inicia sesión." });
      router.push("/login");
    } catch (error: any) {
      setIsLoading(false);
      toast.error("Error en el registro", { description: error.message });
    }
  };

  // --- 7) JSX ---
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white p-4 overflow-hidden">
      {/* Animación de gotas cayendo */}
      <RainEffect />

      <div className="w-full max-w-3xl relative z-10 animate-[fadeInScale_0.35s_ease-out_forwards] opacity-0">
        <div className="relative bg-white border-2 border-[#FF0033] rounded-2xl overflow-hidden">
          {/* Canvas abarca toda la tarjeta */}
          <BouncingBall />

          {/* Contenido del formulario */}
          <div className="relative z-10 bg-white/95">
            <div className="flex flex-col items-center gap-4 px-8 pt-6 pb-8 text-center">
              <Button variant="outline" size="sm" className="self-start bg-white text-black font-semibold rounded-full border-gray-300 px-4 transition-all duration-300 hover:bg-electric hover:text-white focus:bg-electric focus:text-white hover:drop-shadow-[0_0_20px_hsl(0,100%,60%)] focus:drop-shadow-[0_0_20px_hsl(0,100%,60%)]" onClick={onVolver}>
                Volver
              </Button>
              <div className="w-full space-y-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  Registro: {rol === "externo" ? "Hélice Externa" : "Hélice UNSA"}
                </h1>
                <p className="text-sm text-gray-600">
                  Complete el formulario según su rol. Los campos marcados con * son obligatorios.
                </p>
              </div>
            </div>
            <div className="px-6 pt-2 pb-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <fieldset className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6 shadow-sm">
                  <legend className="text-lg font-semibold text-gray-800">1. Datos de Cuenta</legend>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-900 font-medium">
                        Correo Electrónico *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="su.correo@dominio.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none"
                      />
                      {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-900 font-medium">
                        Contraseña *
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none"
                      />
                      {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                    </div>
                  </div>
                </fieldset>

                <fieldset className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6 shadow-sm">
                  <legend className="text-lg font-semibold text-gray-800">2. Datos de Perfil</legend>

                  <div className="space-y-2">
                    <Label htmlFor="nombres_apellidos" className="text-gray-900 font-medium">
                      Nombres y Apellidos Completos *
                    </Label>
                    <Input
                      id="nombres_apellidos"
                      name="nombres_apellidos"
                      placeholder="Ej: Juan Pérez"
                      value={formData.nombres_apellidos}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none"
                    />
                    {errors.nombres_apellidos && <p className="text-sm text-red-600">{errors.nombres_apellidos}</p>}
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cargo" className="text-gray-900 font-medium">
                        Cargo *
                      </Label>
                      <Input
                        id="cargo"
                        name="cargo"
                        placeholder="Ej: Gerente, 'Mi Persona'"
                        value={formData.cargo}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none"
                      />
                      {errors.cargo && <p className="text-sm text-red-600">{errors.cargo}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono" className="text-gray-900 font-medium">
                        Teléfono
                      </Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        placeholder="Ej: 987654321"
                        value={formData.telefono || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none"
                      />
                      {errors.telefono && <p className="text-sm text-red-600">{errors.telefono}</p>}
                    </div>
                  </div>

                  {rol === "externo" && formData.rol === "externo" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="organizacion" className="text-gray-900 font-medium">
                            Organización *
                          </Label>
                          <Input
                            id="organizacion"
                            name="organizacion"
                            placeholder="Ej: 'Mi Vecindad', Empresa S.A.C."
                            value={formData.organizacion}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none"
                          />
                          {errors.organizacion && <p className="text-sm text-red-600">{errors.organizacion}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="helice_id" className="text-gray-900 font-medium">
                            Hélice a la que pertenece *
                          </Label>
                          <Select value={formData.helice_id} onValueChange={handleSelectHelice}>
                            <SelectTrigger id="helice_id" className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none">
                              <SelectValue placeholder="Seleccione..." />
                            </SelectTrigger>
                            <SelectContent>
                              {helices.map(h => (
                                <SelectItem key={h.id} value={String(h.id)}>
                                  {h.nombre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.helice_id && <p className="text-sm text-red-600">{errors.helice_id}</p>}
                        </div>
                      </div>

                      <div className="space-y-3 rounded-xl border border-dashed border-gray-300 bg-white/80 p-4">
                        <Label className="text-gray-900 font-medium">Día(s) de Interés</Label>
                        <p className="text-sm text-gray-600">Seleccione los días que planea asistir.</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {diasEvento.map(dia => (
                            <label
                              key={dia.id}
                              htmlFor={`dia-${dia.id}`}
                              className="flex cursor-pointer items-center gap-3 rounded-lg border border-transparent bg-gray-50 px-3 py-3 text-sm text-gray-700 transition hover:border-gray-300 hover:bg-white hover:shadow-sm"
                            >
                              <Checkbox
                                id={`dia-${dia.id}`}
                                checked={formData.dias_interes?.includes(dia.id)}
                                onCheckedChange={checked => handleCheckboxChange(dia.id, checked)}
                              />
                              <span>{dia.nombre}</span>
                            </label>
                          ))}
                        </div>
                        {errors.dias_interes && <p className="text-sm text-red-600">{errors.dias_interes}</p>}
                      </div>
                    </div>
                  )}

                  {rol === "unsa" && formData.rol === "unsa" && (
                    <div className="space-y-2">
                      <Label htmlFor="unidad_academica" className="text-gray-900 font-medium">
                        Unidad Académica / Investigación *
                      </Label>
                      <Input
                        id="unidad_academica"
                        name="unidad_academica"
                        placeholder="Ej: Escuela de Ing. de Sistemas"
                        value={formData.unidad_academica}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none"
                      />
                      {errors.unidad_academica && <p className="text-sm text-red-600">{errors.unidad_academica}</p>}
                    </div>
                  )}
                </fieldset>

                <button
                  type="submit"
                  className="w-full bg-white border-2 border-black text-black font-semibold py-3 rounded-lg transition-colors duration-300 hover:bg-electric hover:border-electric hover:text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Registrando..." : "Crear Cuenta"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
