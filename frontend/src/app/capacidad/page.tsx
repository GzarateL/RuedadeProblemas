"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from 'lucide-react';
import Link from 'next/link';

interface Capacidad {
  capacidad_id: number;
  descripcion_capacidad: string;
  fecha_creacion: string;
  palabras_clave: string | null;
}

export default function MisCapacidadesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [capacidades, setCapacidades] = useState<Capacidad[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?error=unauthorized");
    } else if (!authLoading && user && user.rol !== 'unsa') {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchCapacidades = async () => {
      if (!user || user.rol !== 'unsa') return;

      const token = Cookies.get('token');
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/capacidades/mis-capacidades`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Error al cargar capacidades');

        const data = await res.json();
        console.log("Capacidades recibidas:", data);
        setCapacidades(data);
      } catch (err: any) {
        console.error("Error fetching capacidades:", err);
        toast.error("Error", { description: err.message });
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.rol === 'unsa') {
      fetchCapacidades();
    }
  }, [user]);

  if (authLoading || !user || user.rol !== 'unsa') {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-theme(space.16))]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Mis Capacidades</h1>
          <p className="text-neutral-600 mt-2">
            Gestiona tus capacidades registradas
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/capacidad/mis-matches">
            <Button variant="outline">
              Ver Matches
            </Button>
          </Link>
          <Link href="/capacidad/registrar">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nueva Capacidad
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : capacidades.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-neutral-500 mb-4">
              No tienes capacidades registradas aún.
            </p>
            <Link href="/capacidad/registrar">
              <Button>Registrar mi primera capacidad</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {capacidades.map((capacidad) => (
            <div 
              key={capacidad.capacidad_id} 
              className="card-electric-fill p-6 rounded-xl border-2 border-neutral-200 cursor-pointer transition-all relative"
            >
              <div className="mb-3">
                <h3 className="text-lg font-semibold line-clamp-2 mb-2">
                  {capacidad.descripcion_capacidad}
                </h3>
                <p className="text-sm opacity-80">
                  {(() => {
                    if (!capacidad.fecha_creacion) return 'Fecha no disponible';
                    try {
                      const fecha = new Date(capacidad.fecha_creacion);
                      if (isNaN(fecha.getTime())) return 'Fecha no disponible';
                      return `Registrada el ${fecha.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}`;
                    } catch {
                      return 'Fecha no disponible';
                    }
                  })()}
                </p>
              </div>
              
              {capacidad.palabras_clave && (
                <div>
                  <p className="text-xs font-medium opacity-70 mb-2">Palabras clave:</p>
                  <div className="flex flex-wrap gap-1">
                    {capacidad.palabras_clave.split(',').map((palabra, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs px-2.5 py-0.5 rounded-full border border-current opacity-80"
                      >
                        {palabra.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
