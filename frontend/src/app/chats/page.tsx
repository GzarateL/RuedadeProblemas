"use client";

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { Chat } from '@/types/chat';

export default function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    setIsLoading(true);
    const token = Cookies.get('token');

    if (!token) {
      toast.error("No autenticado");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/chats", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setChats(data.chats || []);
      }
    } catch (err: any) {
      console.error("Error fetching chats:", err);
      toast.error("Error al cargar chats");
    } finally {
      setIsLoading(false);
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-6 h-6 text-blue-600" />
          <h1 className="text-3xl font-bold text-neutral-900">Mis Conversaciones</h1>
        </div>
        <p className="text-neutral-600">
          Chats activos con tus colaboradores
        </p>
      </div>

      {chats.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
            <p className="text-neutral-500">No tienes conversaciones activas</p>
            <p className="text-sm text-neutral-400 mt-2">
              Acepta solicitudes para iniciar conversaciones
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {chats.map((chat) => (
            <Link key={chat.chat_id} href={`/chats/${chat.chat_id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {chat.titulo_chat}
                        {chat.mensajes_no_leidos > 0 && (
                          <Badge variant="destructive" className="ml-2">
                            {chat.mensajes_no_leidos}
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-neutral-600 mt-1">
                        Con: {chat.otro_usuario_nombre || 'Usuario desconocido'}
                      </p>
                    </div>
                    <MessageCircle className="w-5 h-5 text-neutral-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <Clock className="w-3 h-3" />
                    Última actividad: {new Date(chat.ultima_actividad).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
