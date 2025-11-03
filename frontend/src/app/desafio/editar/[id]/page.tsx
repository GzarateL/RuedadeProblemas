"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

export default function EditarDesafioPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const desafioId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(true);

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    impacto: "",
    intentos_previos: "",
    areas: [] as number[],
    sub_areas: [] as number[],
    disciplinas: [] as number[],
    objetivos: [] as number[],
    metas: [] as number[],
    keyword_ids: [] as number[],
    soluciones: [] as Array<{ titulo: string; problema: string; solucion: string; orden: number }>
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (user && user.rol !== "externo") {
      alert("Solo los usuarios externos pueden editar desafíos");
      router.push("/");
      return;
    }

    if (user && desafioId) {
      cargarDesafio();
    }
  }, [user, isLoading, router, desafioId]);

  const cargarDesafio = async () => {
    try {
      const Cookies = (await import('js-cookie')).default;
      const token = Cookies.get("token");
      
      const response = await fetch(`${API_URL}/api/desafios/${desafioId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("=== DATOS CARGADOS DEL DESAFÍO ===");
        console.log("Datos completos:", data);
        console.log("OCDE - disciplina_ids:", data.disciplina_ids);
        console.log("ODS - meta_ids:", data.meta_ids);
        console.log("Keywords:", data.keyword_ids);
        console.log("Soluciones:", data.soluciones);
        
        setFormData({
          titulo: data.titulo,
          descripcion: data.descripcion,
          impacto: data.impacto,
          intentos_previos: data.intentos_previos || "",
          areas: data.area_ids || [],
          sub_areas: data.sub_area_ids || [],
          disciplinas: data.disciplina_ids || [],
          objetivos: data.objetivo_ids || [],
          metas: data.meta_ids || [],
          keyword_ids: data.keyword_ids || [],
          soluciones: data.soluciones || []
        });
      } else {
        alert("Error al cargar el desafío");
        router.push("/desafio");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al cargar el desafío");
      router.push("/desafio");
    } finally {
      setCargando(false);
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

    if (!formData.titulo || !formData.descripcion || !formData.impacto) {
      alert("Por favor complete todos los campos obligatorios");
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

      const dataToSend = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        impacto: formData.impacto,
        intentos_previos: formData.intentos_previos,
        ocde_ids: formData.disciplinas,
        ods_ids: formData.metas,
        keyword_ids: formData.keyword_ids,
        soluciones: formData.soluciones
      };

      const response = await fetch(`${API_URL}/api/desafios/${desafioId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar desafío");
      }

      alert("Desafío actualizado exitosamente");
      router.push("/desafio");
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Error al actualizar desafío. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Editar Desafío</CardTitle>
            <CardDescription>
              Actualice la información de su desafío
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
                  De los problemas que identificó, señale palabras claves
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
                  {loading ? "Actualizando..." : "Actualizar Desafío"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
