"use client";

import { useParams, useRouter, usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const chatId = params?.chat_id as string | undefined;
  const [otroUsuario, setOtroUsuario] = useState('');

  // Solo mostrar header si estamos en un chat específico
  const isInChatDetail = chatId && pathname?.includes(`/chats/${chatId}`);

  useEffect(() => {
    if (!isInChatDetail) return;

    const fetchChatInfo = async () => {
      const token = Cookies.get('token');
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats/${chatId}/mensajes`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) return;

        const data = await res.json();

        if (data.mensajes && data.mensajes.length > 0) {
          const resMe = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
            headers: { "Authorization": `Bearer ${token}` }
          });

          if (resMe.ok) {
            const userData = await resMe.json();
            const miTipo = userData.rol;

            const mensajeDelOtro = data.mensajes.find((m: any) =>
              m.remitente_tipo !== miTipo
            );

            if (mensajeDelOtro && mensajeDelOtro.remitente_nombre) {
              setOtroUsuario(mensajeDelOtro.remitente_nombre);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching chat info:", err);
      }
    };

    fetchChatInfo();
  }, [chatId, isInChatDetail]);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {isInChatDetail && (
        <button
          onClick={() => router.push('/chats')}
          className="fixed top-20 left-4 z-[1000] flex items-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 hover:shadow-xl hover:bg-white transition-all duration-200 max-w-[calc(100vw-2rem)]"
          aria-label="Volver a chats"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-900 truncate">
            {otroUsuario || 'Chat'}
          </span>
        </button>
      )}

      <div className="flex-1 min-h-0 overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}