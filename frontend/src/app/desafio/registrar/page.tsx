"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API_URL } from "@/config/api";
import OCDESelector from "@/app/registro-helice-interna/components/OCDESelector";
import ODSSelector from "@/app/registro-helice-interna/components/ODSSelector";
import KeywordSelector from "@/app/registro-helice-interna/components/KeywordSelector";
import SolucionesEditor from "@/app/registro-helice-interna/components/SolucionesEditor";

export default function RegistrarDesafioPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tieneRegistro, setTieneRegistro] = useState(false);
  const [verificandoRegistro, setVerificandoRegistro] = useState(true);

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    impacto: "",
    intentos_previos: "",
    // OCDE
    areas: [] as number[],
    sub_areas: [] as number[],
    disciplinas: [] as number[],
    // ODS
    objetivos: [] as number[],
    metas: [] as number[],
    // Keywords y soluciones
    keyword_ids: [] as number[],
    soluciones: [] as Array<{ titulo: string; problema: string; solucion: string; orden: number }>
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (user && user.rol !== "externo") {
      alert("Solo los usuarios externos pueden registrar desafíos");
      router.push("/");
      return;
    }

    if (user) {
      verificarRegistroHeliceExterna();
    }
  }, [user, isLoading, router]);

  const verificarRegistroHeliceExterna = async () => {
    try {
      const Cookies = (await import('js-cookie')).default;
      const token = Cookies.get("token");
      
      const response = await fetch(`${API_URL}/api/helice-externa/verificar-registro`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (!data.tieneRegistro) {
          alert("Debe registrarse primero en la hélice externa antes de crear un desafío");
          router.push("/registro-helice-externa");
          return;
        }
        setTieneRegistro(true);
      }
    } catch (error) {
      console.error("Error al verificar registro:", error);
    } finally {
      setVerificandoRegistro(false);
    }
  };

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
    if (!formData.titulo || !formData.descripcion || !formData.impacto) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    if (formData.metas.length === 0) {
      alert("Debe seleccionar al menos una meta ODS");
      return;
    }

    if (formData.keyword_ids.length === 0) {
      alert("Debe seleccionar al menos una palabra clave");
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

      // Preparar datos para enviar (solo disciplinas y metas)
      const dataToSend = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        impacto: formData.impacto,
        intentos_previos: formData.intentos_previos,
        ocde_ids: formData.disciplinas, // Solo enviar disciplinas
        ods_ids: formData.metas, // Solo enviar metas
        keyword_ids: formData.keyword_ids,
        soluciones: formData.soluciones
      };

      console.log("Enviando desafío:", dataToSend);
      
      const response = await fetch(`${API_URL}/api/desafios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al registrar desafío");
      }

      const result = await response.json();
      console.log("Desafío registrado:", result);
      
      alert("Desafío registrado exitosamente");
      router.push("/desafio");
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Error al registrar desafío. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || verificandoRegistro) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!tieneRegistro) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Registrar Desafío</CardTitle>
            <CardDescription>
              Complete la información sobre el desafío que desea plantear
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <Label htmlFor="titulo">Título del Desafío *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange("titulo", e.target.value)}
                  placeholder="Registre el título de su desafío"
                  required
                />
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción *</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange("descripcion", e.target.value)}
                  rows={6}
                  placeholder="Registre una breve descripción: identifique el problema, cómo afecta, desde cuándo afecta, quiénes se beneficiarían"
                  required
                />
              </div>

              <div>
                <Label htmlFor="impacto">Impacto *</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Señale qué tipo de impacto tendría la posible solución
                </p>
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
                <Label>OCDE Activado para I+D+i+e *</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Seleccione las sub-áreas donde está este problema
                </p>
                <OCDESelector
                  selectedAreas={formData.areas}
                  selectedSubAreas={formData.sub_areas}
                  selectedDisciplinas={formData.disciplinas}
                  onSelectionChange={(areas, subAreas, disciplinas) => {
                    setFormData(prev => ({
                      ...prev,
                      areas,
                      sub_areas: subAreas,
                      disciplinas
                    }));
                  }}
                />
              </div>

              <div>
                <Label>ODS Activado para I+D+i+e *</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Seleccione las metas donde se encuentra el problema
                </p>
                <ODSSelector
                  selectedObjetivos={formData.objetivos}
                  selectedMetas={formData.metas}
                  onSelectionChange={(objetivos, metas) => {
                    setFormData(prev => ({
                      ...prev,
                      objetivos,
                      metas
                    }));
                  }}
                />
              </div>

              <div>
                <Label htmlFor="intentos_previos">Intentos Previos</Label>
                <Textarea
                  id="intentos_previos"
                  value={formData.intentos_previos}
                  onChange={(e) => handleInputChange("intentos_previos", e.target.value)}
                  rows={4}
                  placeholder="Describa qué soluciones previas se han dado a ese problema"
                />
              </div>

              <div>
                <Label>Palabras Claves de Soluciones *</Label>
                <p className="text-sm text-gray-600 mb-2">
                  De los problemas que identificó, señale palabras claves. Ej.: nanomateriales, bacterias, dislexia, rotación de personal, biorremediación, estructura civil, ...
                </p>
                <KeywordSelector
                  selectedKeywords={formData.keyword_ids}
                  onSelectionChange={(ids) => handleInputChange("keyword_ids", ids)}
                />
              </div>

              <div>
                <Label>Soluciones Propuestas</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Indique brevemente qué soluciones considera que puede darse
                </p>
                <SolucionesEditor
                  soluciones={formData.soluciones}
                  onChange={(soluciones) => handleInputChange("soluciones", soluciones)}
                />
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
                  {loading ? "Registrando..." : "Registrar Desafío"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
