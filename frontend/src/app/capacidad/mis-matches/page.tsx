"use client";

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, AlertCircle, Send, CheckCircle, Clock, XCircle } from 'lucide-react';
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

interface EstadoSolicitudMatch {
  existe: boolean;
  solicitud: any | null;
  soyRemitente: boolean;
  soyDestinatario: boolean;
}

export default function MisMatchesUNSAPage() {
  const [matches, setMatches] = useState<DesafioMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [matchingActivo, setMatchingActivo] = useState(false);
  const [estadosSolicitudes, setEstadosSolicitudes] = useState<{[key: number]: EstadoSolicitudMatch}>({});
  const [enviandoSolicitud, setEnviandoSolicitud] = useState<number | null>(null);
  const [respondiendoSolicitud, setRespondiendoSolicitud] = useState<number | null>(null);

  useEffect(() => {
    console.log('🔄 Iniciando polling de matches...');
    fetchData();
    
    // Actualizar cada 5 segundos para ver solicitudes entrantes
    const interval = setInterval(() => {
      console.log('🔄 Actualizando matches automáticamente...');
      fetchData();
    }, 5000);
    
    return () => {
      console.log('🛑 Deteniendo polling de matches');
      clearInterval(interval);
    };
  }, []);

  const fetchData = async () => {
    const token = Cookies.get('token');

    if (!token) {
      if (isLoading) toast.error("No autenticado");
      setIsLoading(false);
      return;
    }

    try {
      // Obtener matches
      const resMatches = await fetch("http://localhost:3000/api/matches/my-matches", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!resMatches.ok) throw new Error('Error al cargar matches');

      const dataMatches = await resMatches.json();
      
      if (dataMatches.message) {
        setMatchingActivo(false);
      } else {
        setMatchingActivo(true);
        const matchesData = dataMatches.matches || [];
        setMatches(matchesData);
        
        // Obtener estado de solicitudes para cada match
        await fetchEstadosSolicitudes(matchesData, token);
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      if (isLoading) toast.error("Error", { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEstadosSolicitudes = async (matchesData: DesafioMatch[], token: string) => {
    const estados: {[key: number]: EstadoSolicitudMatch} = {};
    
    for (const match of matchesData) {
      if (!match.participante_id) continue;
      
      try {
        const res = await fetch(
          `http://localhost:3000/api/solicitudes/estado-match?` +
          `otro_tipo=externo&otro_id=${match.participante_id}&` +
          `tipo_match=desafio&match_id=${match.desafio_id}`,
          { headers: { "Authorization": `Bearer ${token}` } }
        );
        
        if (res.ok) {
          const data = await res.json();
          estados[match.desafio_id] = data;
          console.log(`Estado para desafio ${match.desafio_id}:`, data);
        }
      } catch (err) {
        console.error(`Error fetching estado for match ${match.desafio_id}:`, err);
      }
    }
    
    console.log('Todos los estados:', estados);
    setEstadosSolicitudes(estados);
  };

  const enviarSolicitud = async (desafioId: number, participanteId: number) => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error("No autenticado");
      return;
    }

    setEnviandoSolicitud(desafioId);

    try {
      const res = await fetch("http://localhost:3000/api/solicitudes", {
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
      await fetchData(); // Recargar para actualizar estados
    } catch (err: any) {
      console.error("Error enviando solicitud:", err);
      toast.error("Error", { description: err.message });
    } finally {
      setEnviandoSolicitud(null);
    }
  };

  const responderSolicitud = async (solicitudId: number, estado: 'aceptada' | 'rechazada') => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error("No autenticado");
      return;
    }

    setRespondiendoSolicitud(solicitudId);

    try {
      const res = await fetch(`http://localhost:3000/api/solicitudes/${solicitudId}/responder`, {
        method: 'PATCH',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ estado })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al responder solicitud');
      }

      toast.success(`Solicitud ${estado} exitosamente`);
      
      // Si se aceptó, redirigir al chat
      if (estado === 'aceptada' && data.chat_id) {
        toast.success('¡Chat creado! Redirigiendo...', { duration: 2000 });
        setTimeout(() => {
          window.location.href = `/chats/${data.chat_id}`;
        }, 2000);
      } else {
        await fetchData(); // Recargar para actualizar estados
      }
    } catch (err: any) {
      console.error("Error respondiendo solicitud:", err);
      toast.error("Error", { description: err.message });
    } finally {
      setRespondiendoSolicitud(null);
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
            const estadoSolicitud = estadosSolicitudes[match.desafio_id];
            const enviando = enviandoSolicitud === match.desafio_id;
            const respondiendo = respondiendoSolicitud === estadoSolicitud?.solicitud?.solicitud_id;
            
            console.log(`Renderizando desafio ${match.desafio_id}:`, {
              existe: estadoSolicitud?.existe,
              soyRemitente: estadoSolicitud?.soyRemitente,
              soyDestinatario: estadoSolicitud?.soyDestinatario,
              estado: estadoSolicitud?.solicitud?.estado
            });
            
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
                    
                    {/* Botones dinámicos según estado de solicitud */}
                    <div className="pt-2">
                      {!estadoSolicitud?.existe ? (
                        // No hay solicitud - Mostrar botón de enviar
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
                      ) : estadoSolicitud.soyRemitente ? (
                        // Yo envié la solicitud - Mostrar estado
                        <div className="space-y-2">
                          {estadoSolicitud.solicitud.estado === 'pendiente' && (
                            <Button disabled className="w-full" variant="outline">
                              <Clock className="w-4 h-4 mr-2" />
                              Solicitud pendiente
                            </Button>
                          )}
                          {estadoSolicitud.solicitud.estado === 'aceptada' && (
                            <Button 
                              onClick={() => window.location.href = '/chats'}
                              className="w-full bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Solicitud aceptada - Ver chat
                            </Button>
                          )}
                          {estadoSolicitud.solicitud.estado === 'rechazada' && (
                            <Button disabled className="w-full" variant="outline">
                              <XCircle className="w-4 h-4 mr-2" />
                              Solicitud rechazada
                            </Button>
                          )}
                        </div>
                      ) : (
                        // Existe solicitud (soy remitente o destinatario)
                        <div className="space-y-2">
                          {estadoSolicitud.solicitud.estado === 'pendiente' && estadoSolicitud.soyDestinatario ? (
                            // Me enviaron solicitud pendiente - Mostrar botones de aceptar/rechazar
                            <>
                              <div className="text-sm font-medium text-blue-600 mb-2">
                                ¡Te enviaron una solicitud!
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => responderSolicitud(estadoSolicitud.solicitud.solicitud_id, 'aceptada')}
                                  disabled={respondiendo}
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                  {respondiendo ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Aceptar
                                    </>
                                  )}
                                </Button>
                                <Button
                                  onClick={() => responderSolicitud(estadoSolicitud.solicitud.solicitud_id, 'rechazada')}
                                  disabled={respondiendo}
                                  variant="outline"
                                  className="flex-1"
                                >
                                  {respondiendo ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <>
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Rechazar
                                    </>
                                  )}
                                </Button>
                              </div>
                            </>
                          ) : estadoSolicitud.solicitud.estado === 'aceptada' ? (
                            // Solicitud aceptada (sin importar quién la envió) - Mostrar Ver chat
                            <Button 
                              onClick={() => window.location.href = '/chats'}
                              className="w-full bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Solicitud aceptada - Ver chat
                            </Button>
                          ) : estadoSolicitud.solicitud.estado === 'rechazada' ? (
                            // Solicitud rechazada
                            <Button disabled className="w-full" variant="outline">
                              <XCircle className="w-4 h-4 mr-2" />
                              Solicitud rechazada
                            </Button>
                          ) : null}
                        </div>
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
