"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API_URL } from "@/config/api";
import DiasInteresSelector from "../components/DiasInteresSelector";

export default function RegistroGobiernoPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre_institucion: "",
    nombre_completo: "",
    cargo: "",
    tipo_gobierno: "",
    email: "",
    telefono: "",
    dias_interes: [] as number[],
    tipo_participacion: ""
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (user && user.rol !== "externo") {
      alert("Solo los usuarios externos pueden registrarse en la hélice externa");
      router.push("/");
    }
  }, [user, isLoading, router]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert("Debe iniciar sesión para continuar");
      return;
    }

    // Validaciones
    if (!formData.nombre_institucion || !formData.nombre_completo || !formData.cargo || 
        !formData.tipo_gobierno || !formData.email || !formData.telefono || !formData.tipo_participacion) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    setLoading(true);

    try {
      // Importar Cookies dinámicamente
      const Cookies = (await import('js-cookie')).default;
      const token = Cookies.get("token");
      
      if (!token) {
        alert("No se encontró token de autenticación. Por favor inicie sesión nuevamente.");
        router.push("/login");
        return;
      }

      console.log("Enviando datos:", formData);
      console.log("Usuario:", user);
      
      const response = await fetch(`${API_URL}/api/helice-externa/gobierno`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData);
        throw new Error(errorData.error || "Error al registrar");
      }

      const result = await response.json();
      console.log("Registro exitoso:", result);
      
      router.push("/registro-helice-externa/confirmacion");
    } catch (error: any) {
      console.error("Error completo:", error);
      alert(error.message || "Error al registrar. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Registro - Gobierno</CardTitle>
            <CardDescription>
              Complete los datos de su institución gubernamental
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <Label htmlFor="nombre_institucion">Nombre de la Institución *</Label>
                <Input
                  id="nombre_institucion"
                  value={formData.nombre_institucion}
                  onChange={(e) => handleInputChange("nombre_institucion", e.target.value)}
                  placeholder="Registre el nombre de su organización"
                  required
                />
              </div>

              <div>
                <Label htmlFor="nombre_completo">Nombre Completo *</Label>
                <Input
                  id="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={(e) => handleInputChange("nombre_completo", e.target.value)}
                  placeholder="Registre sus nombres y apellidos"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cargo">Cargo *</Label>
                <Input
                  id="cargo"
                  value={formData.cargo}
                  onChange={(e) => handleInputChange("cargo", e.target.value)}
                  placeholder="Registre su cargo actual"
                  required
                />
              </div>

              <div>
                <Label htmlFor="tipo_gobierno">Tipo de Gobierno *</Label>
                <Select
                  value={formData.tipo_gobierno}
                  onValueChange={(value) => handleInputChange("tipo_gobierno", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo de gobierno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="central">CENTRAL</SelectItem>
                    <SelectItem value="regional">REGIONAL</SelectItem>
                    <SelectItem value="provincial">PROVINCIAL</SelectItem>
                    <SelectItem value="distrital">DISTRITAL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Registre su correo corporativo"
                  required
                />
              </div>

              <div>
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  placeholder="Registre su número de teléfono"
                  required
                />
              </div>

              <DiasInteresSelector
                selectedSesiones={formData.dias_interes}
                onChange={(sesiones) => handleInputChange("dias_interes", sesiones)}
              />

              <div>
                <Label htmlFor="tipo_participacion">Tipo de Participación *</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Todos tendrán acceso a la rueda en forma presencial, sin embargo, puede seleccionar un tipo para su participación
                </p>
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

              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {loading ? "Registrando..." : "Finalizar Registro"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
