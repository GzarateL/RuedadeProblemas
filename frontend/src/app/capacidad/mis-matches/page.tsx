"use client";

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, AlertCircle, Send, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface DesafioMatch {
  desafio_id: number;
  titulo: string;
  descripcion: string | null;
  participante_nombre: string | null;
  organizacion: string | null;
  palabras_coincidentes: string;
  total_coincidencias: number;
  participante_id?: number;
}

interface SolicitudEstado {
  [key: number]: boolean; // desafio_id -> solicitud enviada
}

export default function MisMatchesUNSAPage() {
  const [matches, setMatches] = useState<DesafioMatch[]>([]);
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

        // Obtener solicitudes enviadas para marcar cuáles ya fueron enviadas
        const resSolicitudes = await fetch("http://localhost:3001/api/solicitudes/enviadas", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (resSolicitudes.ok) {
          const dataSolicitudes = await resSolicitudes.json();
          const estadoSolicitudes: SolicitudEstado = {};
          
          dataSolicitudes.solicitudes.forEach((sol: any) => {
            if (sol.tipo_match === 'desafio') {
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

  const enviarSolicitud = async (desafioId: number, participanteId: number) => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error("No autenticado");
      return;
    }

    setEnviandoSolicitud(desafioId);

    try {
      const res = await fetch("http://localhost:3001/api/solicitudes", {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          destinatario_tipo: 'externo',
          destinatario_id: participanteId,
          tipo_match: 'desafio',
          match_id: desafioId,
          mensaje: 'Me interesa colaborar en este desafío.'
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al enviar solicitud');
      }

      toast.success("Solicitud enviada exitosamente");
      setSolicitudesEnviadas(prev => ({ ...prev, [desafioId]: true }));
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
          Desafíos que coinciden con tus capacidades registradas
        </p>
      </div>

      {matches.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-neutral-500">
              No se encontraron matches en este momento. Asegúrate de haber registrado capacidades con palabras clave.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match) => {
            const yaEnviada = solicitudesEnviadas[match.desafio_id];
            const enviando = enviandoSolicitud === match.desafio_id;
            
            return (
              <Card key={match.desafio_id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {match.titulo}
                    </CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      {match.total_coincidencias} {match.total_coincidencias === 1 ? 'coincidencia' : 'coincidencias'}
                    </Badge>
                  </div>
                  <CardDescription>
                    {match.participante_nombre || 'Participante no especificado'}
                    {match.organizacion && ` - ${match.organizacion}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {match.descripcion && (
                      <p className="text-sm text-neutral-600 line-clamp-3">
                        {match.descripcion}
                      </p>
                    )}
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
                          onClick={() => enviarSolicitud(match.desafio_id, match.participante_id || 0)}
                          disabled={enviando || !match.participante_id}
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
        <Link href="/capacidad" className="text-sm text-blue-600 hover:underline">
          ← Volver a Mis Capacidades
        </Link>
      </div>
    </div>
  );
}
