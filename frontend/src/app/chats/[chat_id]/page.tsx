"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, MessageCircle } from 'lucide-react';
import { Mensaje } from '@/types/chat';

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.chat_id as string;

  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [otroUsuario, setOtroUsuario] = useState('');
  const [miTipo, setMiTipo] = useState<'unsa' | 'externo' | null>(null);
  const [shouldScroll, setShouldScroll] = useState(true);

  const mensajesEndRef = useRef<HTMLDivElement>(null);
  const mensajesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (shouldScroll) {
      mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const handleScroll = () => {
    if (mensajesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = mensajesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldScroll(isNearBottom);
    }
  };

  useEffect(() => {
    fetchMensajes();
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
      const resMe = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (resMe.ok) {
        const userData = await resMe.json();
        setMiTipo(userData.rol); // 'unsa' o 'externo'
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats/${chatId}/mensajes`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Error al cargar mensajes');

      const data = await res.json();
      setMensajes(data.mensajes || []);

      // Obtener nombre del otro usuario
      if (data.mensajes.length > 0) {
        const userData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          headers: { "Authorization": `Bearer ${token}` }
        }).then(r => r.json());

        const miTipoActual = userData.rol;
        const mensajeDelOtro = data.mensajes.find((m: Mensaje) =>
          m.remitente_tipo !== miTipoActual
        );

        if (mensajeDelOtro && mensajeDelOtro.remitente_nombre) {
          setOtroUsuario(mensajeDelOtro.remitente_nombre);
        } else {
          // Si no hay mensajes del otro, usar el primer mensaje disponible
          const primerMensaje = data.mensajes[0];
          if (primerMensaje && primerMensaje.remitente_nombre) {
            setOtroUsuario(primerMensaje.remitente_nombre);
          }
        }
      }

    } catch (err: any) {
      console.error("Error:", err);
      if (isLoading) toast.error("Error al cargar chat");
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
    setShouldScroll(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats/${chatId}/mensajes`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ contenido: nuevoMensaje.trim() })
      });

      if (!res.ok) throw new Error('Error al enviar mensaje');

      setNuevoMensaje('');
      await fetchMensajes();
    } catch (err: any) {
      console.error("Error:", err);
      toast.error("Error al enviar mensaje");
    } finally {
      setEnviando(false);
    }
  };

  const esMiMensaje = (mensaje: Mensaje) => {
    if (!miTipo) return false;
    return mensaje.remitente_tipo === miTipo;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="chat-container flex flex-col bg-gray-50 h-full w-full">
      {/* Área de Mensajes - Toma el espacio restante con scroll */}
      <div
        ref={mensajesContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-gray-100"
      >
        {mensajes.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-neutral-500 py-12">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
              <p className="text-lg font-medium">No hay mensajes aún</p>
              <p className="text-sm mt-2">¡Envía el primero!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {mensajes.map((mensaje) => {
              const esMio = esMiMensaje(mensaje);

              return (
                <div
                  key={mensaje.mensaje_id}
                  className={`flex w-full ${esMio ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${esMio
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
                      }`}
                  >
                    {!esMio && (
                      <p className="text-xs font-semibold mb-1 text-blue-600">
                        {mensaje.remitente_nombre}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                      {mensaje.contenido}
                    </p>
                    <p className={`text-xs mt-1.5 ${esMio ? 'text-blue-100' : 'text-gray-500'}`}>
                      {new Date(mensaje.fecha_envio).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={mensajesEndRef} />
          </div>
        )}
      </div>

      {/* Input Box - Anclado en la parte inferior */}
      <div className="flex-shrink-0 border-t p-4 bg-white shadow-lg">
        <form onSubmit={enviarMensaje} className="flex gap-2 w-full max-w-4xl mx-auto">
          <Input
            name="mensaje"
            id="mensaje-input"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            placeholder="Escribe un mensaje..."
            disabled={enviando}
            className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            autoFocus
          />
          <Button
            type="submit"
            disabled={enviando || !nuevoMensaje.trim()}
            className="bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {enviando ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}