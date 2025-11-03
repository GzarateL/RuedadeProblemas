"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API_URL } from "@/config/api";

export default function RegistroGobiernoPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    // Paso 1: Datos de la institución
    nombre_institucion: "",
    nombre_completo: "",
    cargo: "",
    tipo_gobierno: "",
    email: "",
    telefono: "",
    
    // Paso 2: Descripción del desafío
    titulo: "",
    descripcion: "",
    impacto: "",
    intentos_previos: "",
    
    // Paso 3: Clasificación
    ocde_ids: [] as number[],
    ods_ids: [] as number[],
    keywords: [] as string[],
    
    // Paso 4: Participación
    tipo_participacion: "",
    dias_interes: [] as number[]
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert("Debe iniciar sesión para continuar");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/helice-externa/gobierno`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Error al registrar");
      }

      router.push("/registro-helice-externa/confirmacion");
    } catch (error) {
      console.error("Error:", error);
      alert("Error al registrar. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Datos de la Institución</h2>
            
            <div>
              <Label htmlFor="nombre_institucion">Nombre de la Institución</Label>
              <Input
                id="nombre_institucion"
                value={formData.nombre_institucion}
                onChange={(e) => handleInputChange("nombre_institucion", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="nombre_completo">Nombre Completo</Label>
              <Input
                id="nombre_completo"
                value={formData.nombre_completo}
                onChange={(e) => handleInputChange("nombre_completo", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                value={formData.cargo}
                onChange={(e) => handleInputChange("cargo", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="tipo_gobierno">Tipo de Gobierno</Label>
              <Select
                value={formData.tipo_gobierno}
                onValueChange={(value) => handleInputChange("tipo_gobierno", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="central">Central</SelectItem>
                  <SelectItem value="regional">Regional</SelectItem>
                  <SelectItem value="provincial">Provincial</SelectItem>
                  <SelectItem value="distrital">Distrital</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Descripción del Desafío</h2>
            
            <div>
              <Label htmlFor="titulo">Título del Desafío</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => handleInputChange("titulo", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleInputChange("descripcion", e.target.value)}
                rows={6}
                placeholder="Identifique el problema, cómo afecta, desde cuándo afecta, quiénes se beneficiarían"
                required
              />
            </div>

            <div>
              <Label htmlFor="impacto">Impacto</Label>
              <Select
                value={formData.impacto}
                onValueChange={(value) => handleInputChange("impacto", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo de impacto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="microlocal">Microlocal</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="distrital">Distrital</SelectItem>
                  <SelectItem value="provincial">Provincial</SelectItem>
                  <SelectItem value="regional">Regional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="intentos_previos">Intentos Previos</Label>
              <Textarea
                id="intentos_previos"
                value={formData.intentos_previos}
                onChange={(e) => handleInputChange("intentos_previos", e.target.value)}
                rows={4}
                placeholder="Describa qué soluciones previas se han dado a este problema"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Clasificación</h2>
            <p className="text-gray-600">
              Seleccione las áreas OCDE, ODS y palabras clave relacionadas con su desafío
            </p>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Esta sección requiere componentes adicionales para selección de OCDE, ODS y Keywords.
                Por ahora puede continuar al siguiente paso.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Tipo de Participación</h2>
            
            <div>
              <Label htmlFor="tipo_participacion">Tipo de Participación</Label>
              <Select
                value={formData.tipo_participacion}
                onValueChange={(value) => handleInputChange("tipo_participacion", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Todos tendrán acceso a la rueda en forma presencial, sin embargo, puede seleccionar un tipo para su participación.
              </p>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Selección de días de interés: Esta sección requiere integración con el calendario de sesiones.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Registro - Gobierno</CardTitle>
            <CardDescription>
              Paso {currentStep} de 4
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {renderStep()}

              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : router.back()}
                >
                  {currentStep === 1 ? "Cancelar" : "Anterior"}
                </Button>

                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {loading ? "Registrando..." : "Finalizar Registro"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
