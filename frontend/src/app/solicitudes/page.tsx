"use client";

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Inbox, Send, CheckCircle, XCircle, Clock, MessageCircle } from 'lucide-react';
import { Solicitud } from '@/types/solicitud';
import Link from 'next/link';

export default function SolicitudesPage() {
  const [solicitudesRecibidas, setSolicitudesRecibidas] = useState<Solicitud[]>([]);
  const [solicitudesEnviadas, setSolicitudesEnviadas] = useState<Solicitud[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [respondiendo, setRespondiendo] = useState<number | null>(null);

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    setIsLoading(true);
    const token = Cookies.get('token');

    if (!token) {
      toast.error("No autenticado");
      setIsLoading(false);
      return;
    }

    try {
      const [resRecibidas, resEnviadas] = await Promise.all([
        fetch("http://localhost:3001/api/solicitudes/recibidas", {
          headers: { "Authorization": `Bearer ${token}` }
        }),
        fetch("http://localhost:3001/api/solicitudes/enviadas", {
          headers: { "Authorization": `Bearer ${token}` }
        })
      ]);

      if (resRecibidas.ok) {
        const dataRecibidas = await resRecibidas.json();
        setSolicitudesRecibidas(dataRecibidas.solicitudes || []);
      }

      if (resEnviadas.ok) {
        const dataEnviadas = await resEnviadas.json();
        setSolicitudesEnviadas(dataEnviadas.solicitudes || []);
      }
    } catch (err: any) {
      console.error("Error fetching solicitudes:", err);
      toast.error("Error al cargar solicitudes");
    } finally {
      setIsLoading(false);
    }
  };

  const responderSolicitud = async (solicitudId: number, estado: 'aceptada' | 'rechazada') => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error("No autenticado");
      return;
    }

    setRespondiendo(solicitudId);

    try {
      const res = await fetch(`http://localhost:3001/api/solicitudes/${solicitudId}/responder`, {
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
      
      // Actualizar la lista localmente
      setSolicitudesRecibidas(prev => 
        prev.map(sol => 
          sol.solicitud_id === solicitudId 
            ? { ...sol, estado, fecha_respuesta: new Date().toISOString() }
            : sol
        )
      );

      // Si se aceptó, redirigir al chat
      if (estado === 'aceptada' && data.chat_id) {
        toast.success('¡Chat creado! Redirigiendo...', { duration: 2000 });
        setTimeout(() => {
          window.location.href = `/chats/${data.chat_id}`;
        }, 2000);
      }
    } catch (err: any) {
      console.error("Error respondiendo solicitud:", err);
      toast.error("Error", { description: err.message });
    } finally {
      setRespondiendo(null);
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Badge variant="outline" className="bg-yellow-50"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>;
      case 'aceptada':
        return <Badge variant="outline" className="bg-green-50 text-green-700"><CheckCircle className="w-3 h-3 mr-1" />Aceptada</Badge>;
      case 'rechazada':
        return <Badge variant="outline" className="bg-red-50 text-red-700"><XCircle className="w-3 h-3 mr-1" />Rechazada</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Solicitudes</h1>
        <p className="text-neutral-600">
          Gestiona tus solicitudes de colaboración
        </p>
      </div>

      <Tabs defaultValue="recibidas" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recibidas" className="flex items-center gap-2">
            <Inbox className="w-4 h-4" />
            Recibidas ({solicitudesRecibidas.length})
          </TabsTrigger>
          <TabsTrigger value="enviadas" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Enviadas ({solicitudesEnviadas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recibidas" className="mt-6">
          {solicitudesRecibidas.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Inbox className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
                <p className="text-neutral-500">No tienes solicitudes recibidas</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {solicitudesRecibidas.map((solicitud) => (
                <Card key={solicitud.solicitud_id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {solicitud.remitente_nombre || 'Usuario desconocido'}
                        </CardTitle>
                        <CardDescription>
                          Interesado en: {solicitud.match_titulo || 'Sin título'}
                        </CardDescription>
                      </div>
                      {getEstadoBadge(solicitud.estado)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {solicitud.mensaje && (
                        <p className="text-sm text-neutral-600 italic">
                          "{solicitud.mensaje}"
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <Clock className="w-3 h-3" />
                        Recibida: {new Date(solicitud.fecha_creacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>

                      {solicitud.estado === 'pendiente' && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => responderSolicitud(solicitud.solicitud_id, 'aceptada')}
                            disabled={respondiendo === solicitud.solicitud_id}
                            className="flex-1"
                          >
                            {respondiendo === solicitud.solicitud_id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Aceptar
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => responderSolicitud(solicitud.solicitud_id, 'rechazada')}
                            disabled={respondiendo === solicitud.solicitud_id}
                            variant="outline"
                            className="flex-1"
                          >
                            {respondiendo === solicitud.solicitud_id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 mr-2" />
                                Rechazar
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      {solicitud.fecha_respuesta && (
                        <div className="text-xs text-neutral-500">
                          Respondida: {new Date(solicitud.fecha_respuesta).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="enviadas" className="mt-6">
          {solicitudesEnviadas.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Send className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
                <p className="text-neutral-500">No has enviado solicitudes aún</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {solicitudesEnviadas.map((solicitud) => (
                <Card key={solicitud.solicitud_id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {solicitud.destinatario_nombre || 'Usuario desconocido'}
                        </CardTitle>
                        <CardDescription>
                          Sobre: {solicitud.match_titulo || 'Sin título'}
                        </CardDescription>
                      </div>
                      {getEstadoBadge(solicitud.estado)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {solicitud.mensaje && (
                        <p className="text-sm text-neutral-600 italic">
                          "{solicitud.mensaje}"
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <Clock className="w-3 h-3" />
                        Enviada: {new Date(solicitud.fecha_creacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>

                      {solicitud.fecha_respuesta && (
                        <div className="text-xs text-neutral-500">
                          Respondida: {new Date(solicitud.fecha_respuesta).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
