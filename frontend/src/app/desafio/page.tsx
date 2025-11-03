"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { API_URL } from "@/config/api";
import { Pencil, Trash2 } from "lucide-react";

interface Desafio {
  desafio_id: number;
  titulo: string;
  descripcion: string;
  impacto: string;
  intentos_previos: string;
  fecha_creacion: string;
}

export default function MisDesafiosPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [loading, setLoading] = useState(true);
  const [eliminando, setEliminando] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (user && user.rol !== "externo") {
      router.push("/");
      return;
    }

    if (user) {
      cargarDesafios();
    }
  }, [user, isLoading, router]);

  const cargarDesafios = async () => {
    try {
      const Cookies = (await import('js-cookie')).default;
      const token = Cookies.get("token");
      
      const response = await fetch(`${API_URL}/api/desafios`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDesafios(data);
      }
    } catch (error) {
      console.error("Error al cargar desafíos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (desafioId: number) => {
    if (!confirm("¿Está seguro de que desea eliminar este desafío? Esta acción no se puede deshacer.")) {
      return;
    }

    setEliminando(desafioId);

    try {
      const Cookies = (await import('js-cookie')).default;
      const token = Cookies.get("token");
      
      const response = await fetch(`${API_URL}/api/desafios/${desafioId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("Desafío eliminado exitosamente");
        cargarDesafios();
      } else {
        const error = await response.json();
        alert(error.error || "Error al eliminar desafío");
      }
    } catch (error) {
      console.error("Error al eliminar desafío:", error);
      alert("Error al eliminar desafío");
    } finally {
      setEliminando(null);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const getImpactoColor = (impacto: string) => {
    const colors: Record<string, string> = {
      microlocal: "bg-blue-100 text-blue-800",
      local: "bg-green-100 text-green-800",
      distrital: "bg-yellow-100 text-yellow-800",
      provincial: "bg-orange-100 text-orange-800",
      regional: "bg-red-100 text-red-800"
    };
    return colors[impacto] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Mis Desafíos</h1>
            <p className="text-gray-600 mt-2">
              Gestiona los desafíos que has registrado
            </p>
          </div>
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/desafio/registrar">Registrar Nuevo Desafío</Link>
          </Button>
        </div>

        {desafios.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">
                Aún no has registrado ningún desafío
              </p>
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/desafio/registrar">Registrar Mi Primer Desafío</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {desafios.map((desafio) => (
              <Card key={desafio.desafio_id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{desafio.titulo}</CardTitle>
                      <CardDescription>
                        Registrado el {new Date(desafio.fecha_creacion).toLocaleDateString('es-ES')}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getImpactoColor(desafio.impacto)}>
                        {desafio.impacto.charAt(0).toUpperCase() + desafio.impacto.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Descripción:</h3>
                      <p className="text-gray-600">{desafio.descripcion}</p>
                    </div>
                    
                    {desafio.intentos_previos && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Intentos Previos:</h3>
                        <p className="text-gray-600">{desafio.intentos_previos}</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/desafio/editar/${desafio.desafio_id}`)}
                        className="flex items-center gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEliminar(desafio.desafio_id)}
                        disabled={eliminando === desafio.desafio_id}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        {eliminando === desafio.desafio_id ? "Eliminando..." : "Eliminar"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
