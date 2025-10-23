"use client";

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, AlertCircle, Send, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface CapacidadMatch {
  capacidad_id: number;
  descripcion_capacidad: string;
  investigador_id: number;
  investigador_nombre: string | null;
  palabras_coincidentes: string;
  total_coincidencias: number;
}

interface SolicitudEstado {
  [key: number]: boolean; // capacidad_id -> solicitud enviada
}

export default function MisMatchesExternoPage() {
  const [matches, setMatches] = useState<CapacidadMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [matchingActivo, setMatchingActivo] = useState(false);
  const [solicitudesEnviadas, setSolicitudesEnviadas] = useState<SolicitudEstado>({});
  const [enviandoSolicitud, setEnviandoSolicitud] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const token = Cookies.get('token');

      if (!token) {
        toast.error("No autenticado");
        setIsLoading(false);
        return;
      }

      try {
        // Obtener matches
        const resMatches = await fetch("http://localhost:3001/api/matches/my-matches", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!resMatches.ok) throw new Error('Error al cargar matches');

        const dataMatches = await resMatches.json();
        
        if (dataMatches.message) {
          setMatchingActivo(false);
        } else {
          setMatchingActivo(true);
          setMatches(dataMatches.matches || []);
        }

        // Obtener solicitudes enviadas
        const resSolicitudes = await fetch("http://localhost:3001/api/solicitudes/enviadas", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (resSolicitudes.ok) {
          const dataSolicitudes = await resSolicitudes.json();
          const estadoSolicitudes: SolicitudEstado = {};
          
          dataSolicitudes.solicitudes.forEach((sol: any) => {
            if (sol.tipo_match === 'capacidad') {
              estadoSolicitudes[sol.match_id] = true;
            }
          });
          
          setSolicitudesEnviadas(estadoSolicitudes);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        toast.error("Error", { description: err.message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const enviarSolicitud = async (capacidadId: number, investigadorId: number) => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error("No autenticado");
      return;
    }

    setEnviandoSolicitud(capacidadId);

    try {
      const res = await fetch("http://localhost:3001/api/solicitudes", {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          destinatario_tipo: 'unsa',
          destinatario_id: investigadorId,
          tipo_match: 'capacidad',
          match_id: capacidadId,
          mensaje: 'Me interesa colaborar con esta capacidad.'
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al enviar solicitud');
      }

      toast.success("Solicitud enviada exitosamente");
      setSolicitudesEnviadas(prev => ({ ...prev, [capacidadId]: true }));
    } catch (err: any) {
      console.error("Error enviando solicitud:", err);
      toast.error("Error", { description: err.message });
    } finally {
      setEnviandoSolicitud(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!matchingActivo) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <CardTitle className="text-yellow-900">Sistema de Matching Inactivo</CardTitle>
            </div>
            <CardDescription className="text-yellow-700">
              El sistema de matching no está activo en este momento. Por favor, contacta al administrador.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h1 className="text-3xl font-bold text-neutral-900">Mis Matches</h1>
        </div>
        <p className="text-neutral-600">
          Capacidades que coinciden con tus desafíos registrados
        </p>
      </div>

      {matches.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-neutral-500">
              No se encontraron matches en este momento. Asegúrate de haber registrado desafíos con palabras clave.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match) => {
            const yaEnviada = solicitudesEnviadas[match.capacidad_id];
            const enviando = enviandoSolicitud === match.capacidad_id;
            
            return (
              <Card key={match.capacidad_id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg line-clamp-2">
                      Capacidad #{match.capacidad_id}
                    </CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      {match.total_coincidencias} {match.total_coincidencias === 1 ? 'coincidencia' : 'coincidencias'}
                    </Badge>
                  </div>
                  <CardDescription>
                    {match.investigador_nombre || 'Investigador no especificado'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-neutral-600 line-clamp-3">
                      {match.descripcion_capacidad}
                    </p>
                    
                    <div>
                      <p className="text-sm font-medium text-neutral-700 mb-1">Palabras clave coincidentes:</p>
                      <div className="flex flex-wrap gap-1">
                        {match.palabras_coincidentes.split(',').map((palabra, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {palabra.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Botón de solicitud */}
                    <div className="pt-2">
                      {yaEnviada ? (
                        <Button disabled className="w-full" variant="outline">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Solicitud enviada
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => enviarSolicitud(match.capacidad_id, match.investigador_id || 0)}
                          disabled={enviando || !match.investigador_id}
                          className="w-full"
                        >
                          {enviando ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Enviar solicitud
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-8">
        <Link href="/desafio" className="text-sm text-blue-600 hover:underline">
          ← Volver a Mis Desafíos
        </Link>
      </div>
    </div>
  );
}
