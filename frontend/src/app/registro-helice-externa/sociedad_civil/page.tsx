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

export default function RegistroSociedadCivilPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre_organizacion: "",
    nombre_completo: "",
    cargo: "",
    tipo_organizacion: "",
    tamano_organizacion: "",
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

    if (!formData.nombre_organizacion || !formData.nombre_completo || !formData.cargo || 
        !formData.tipo_organizacion || !formData.tamano_organizacion ||
        !formData.email || !formData.telefono || !formData.tipo_participacion) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    setLoading(true);

    try {
      const Cookies = (await import('js-cookie')).default;
      const token = Cookies.get("token");
      
      if (!token) {
        alert("No se encontró token de autenticación. Por favor inicie sesión nuevamente.");
        router.push("/login");
        return;
      }
      
      const response = await fetch(`${API_URL}/api/helice-externa/sociedad-civil`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al registrar");
      }

      router.push("/registro-helice-externa/confirmacion");
    } catch (error: any) {
      console.error("Error:", error);
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
            <CardTitle>Registro - Sociedad Civil</CardTitle>
            <CardDescription>
              Complete los datos de su organización
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <Label htmlFor="nombre_organizacion">Nombre de la Organización a la que Representa *</Label>
                <Input
                  id="nombre_organizacion"
                  value={formData.nombre_organizacion}
                  onChange={(e) => handleInputChange("nombre_organizacion", e.target.value)}
                  placeholder='Registre el nombre de su organización, caso contrario, indique "YO MISMO"'
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
                  placeholder='Registre su cargo actual, caso contrario, indique "YO MISMO"'
                  required
                />
              </div>

              <div>
                <Label htmlFor="tipo_organizacion">Tipo de Organización Civil *</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Seleccione el tipo de organización civil que mejor describa la suya
                </p>
                <Select
                  value={formData.tipo_organizacion}
                  onValueChange={(value) => handleInputChange("tipo_organizacion", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gremio_sindical">Gremio Sindical</SelectItem>
                    <SelectItem value="sociedad_civil_sin_fines_lucro">Sociedad Civil sin Fines de Lucro</SelectItem>
                    <SelectItem value="sociedad_civil_con_fines_lucro">Sociedad Civil con Fines de Lucro</SelectItem>
                    <SelectItem value="ong">ONG</SelectItem>
                    <SelectItem value="colegio_profesional">Colegio Profesional</SelectItem>
                    <SelectItem value="gremio_empresarial">Gremio Empresarial</SelectItem>
                    <SelectItem value="persona_natural">Persona Natural</SelectItem>
                    <SelectItem value="junta_vecinal">Junta Vecinal</SelectItem>
                    <SelectItem value="comedor_popular">Comedor Popular</SelectItem>
                    <SelectItem value="asociacion_civil">Asociación Civil</SelectItem>
                    <SelectItem value="asociacion_militar">Asociación Militar</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tamano_organizacion">Tamaño de Organización *</Label>
                <Select
                  value={formData.tamano_organizacion}
                  onValueChange={(value) => handleInputChange("tamano_organizacion", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tamaño" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="menos_de_4">Menos de 4 personas</SelectItem>
                    <SelectItem value="de_4_a_10">De 4 a 10 personas</SelectItem>
                    <SelectItem value="de_11_a_20">De 11 a 20 personas</SelectItem>
                    <SelectItem value="de_21_a_50">De 21 a 50 personas</SelectItem>
                    <SelectItem value="mas_de_50">Más de 50 personas</SelectItem>
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
