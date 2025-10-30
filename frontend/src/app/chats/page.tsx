"use client";

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock } from 'lucide-react';
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats`, {
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
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Mis Conversaciones</h1>
        <p className="text-neutral-600">
          Chats activos con tus colaboradores
        </p>
      </div>

      {chats.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
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
              <div className="card-electric-fill p-6 rounded-xl border-2 border-neutral-200 cursor-pointer transition-all">
                <h3 className="font-bold text-xl flex items-center gap-2 mb-3">
                  {chat.titulo_chat}
                  {(chat.mensajes_no_leidos ?? 0) > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {chat.mensajes_no_leidos}
                    </Badge>
                  )}
                </h3>
                <p className="opacity-80 text-sm mb-2">
                  Con: {chat.otro_usuario_nombre || 'Usuario desconocido'}
                </p>
                <div className="flex items-center gap-2 text-xs opacity-70">
                  <Clock className="w-3 h-3" />
                  Última actividad: {new Date(chat.ultima_actividad).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
