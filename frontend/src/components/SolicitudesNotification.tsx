"use client";

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Badge } from "@/components/ui/badge";
import { Bell } from 'lucide-react';
import Link from 'next/link';

export default function SolicitudesNotification() {
  const [pendientes, setPendientes] = useState(0);

  useEffect(() => {
    const fetchConteo = async () => {
      const token = Cookies.get('token');
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3001/api/solicitudes/pendientes/count", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setPendientes(data.total || 0);
        }
      } catch (err) {
        console.error("Error fetching conteo solicitudes:", err);
      }
    };

    fetchConteo();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchConteo, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (pendientes === 0) return null;

  return (
    <Link href="/solicitudes" className="relative inline-block">
      <Bell className="w-5 h-5 text-neutral-600 hover:text-neutral-900 transition-colors" />
      {pendientes > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {pendientes > 9 ? '9+' : pendientes}
        </Badge>
      )}
    </Link>
  );
}
