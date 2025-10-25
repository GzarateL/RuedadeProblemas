"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { Mensaje } from '@/types/chat';

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.chat_id as string;
  
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [tituloChat, setTituloChat] = useState('');
  const [otroUsuario, setOtroUsuario] = useState('');
  const [miTipo, setMiTipo] = useState<'unsa' | 'externo' | null>(null);
  const [miId, setMiId] = useState<number | null>(null);
  
  const mensajesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  useEffect(() => {
    fetchMensajes();
    
    // Actualizar cada 3 segundos
    const interval = setInterval(fetchMensajes, 3000);
    
    return () => clearInterval(interval);
  }, [chatId]);

  const fetchMensajes = async () => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error("No autenticado");
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/chats/${chatId}/mensajes`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error('Error al cargar mensajes');
      }

      const data = await res.json();
      setMensajes(data.mensajes || []);
      
      // Obtener info del chat si es la primera carga
      if (isLoading && data.mensajes.length > 0) {
        const primerMensaje = data.mensajes[0];
        setOtroUsuario(primerMensaje.remitente_nombre || 'Usuario');
      }
      
      // Obtener info del usuario actual
      const resMe = await fetch('http://localhost:3000/api/auth/me', {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (resMe.ok) {
        const userData = await resMe.json();
        setMiTipo(userData.rol === 'unsa' ? 'unsa' : 'externo');
        setMiId(userData.rol === 'unsa' ? userData.investigador_id : userData.participante_id);
      }
      
    } catch (err: any) {
      console.error("Error fetching mensajes:", err);
      if (isLoading) {
        toast.error("Error al cargar chat");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nuevoMensaje.trim()) return;
    
    const token = Cookies.get('token');
    if (!token) {
      toast.error("No autenticado");
      return;
    }

    setEnviando(true);

    try {
      const res = await fetch(`http://localhost:3000/api/chats/${chatId}/mensajes`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ contenido: nuevoMensaje.trim() })
      });

      if (!res.ok) {
        throw new Error('Error al enviar mensaje');
      }

      setNuevoMensaje('');
      await fetchMensajes(); // Recargar mensajes
    } catch (err: any) {
      console.error("Error enviando mensaje:", err);
      toast.error("Error al enviar mensaje");
    } finally {
      setEnviando(false);
    }
  };

  const esMiMensaje = (mensaje: Mensaje) => {
    return mensaje.remitente_tipo === miTipo && mensaje.remitente_id === miId;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <Link href="/chats" className="flex items-center gap-2 text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Volver a conversaciones
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {otroUsuario || 'Chat'}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Mensajes */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
          {mensajes.length === 0 ? (
            <div className="text-center text-neutral-500 py-12">
              No hay mensajes aún. ¡Envía el primero!
            </div>
          ) : (
            mensajes.map((mensaje) => {
              const esMio = esMiMensaje(mensaje);
              
              return (
                <div
                  key={mensaje.mensaje_id}
                  className={`flex ${esMio ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      esMio
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {!esMio && (
                      <p className="text-xs font-semibold mb-1 opacity-70">
                        {mensaje.remitente_nombre}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {mensaje.contenido}
                    </p>
                    <p className={`text-xs mt-1 ${esMio ? 'text-blue-100' : 'text-gray-500'}`}>
                      {new Date(mensaje.fecha_envio).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={mensajesEndRef} />
        </CardContent>

        {/* Input de mensaje */}
        <div className="border-t p-4">
          <form onSubmit={enviarMensaje} className="flex gap-2">
            <Input
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
              placeholder="Escribe un mensaje..."
              disabled={enviando}
              className="flex-1"
            />
            <Button type="submit" disabled={enviando || !nuevoMensaje.trim()}>
              {enviando ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
