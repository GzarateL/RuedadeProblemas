"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus } from 'lucide-react';
import Link from 'next/link';

interface Desafio {
  desafio_id: number;
  titulo: string;
  descripcion: string | null;
  fecha_creacion: string;
  palabras_clave: string | null;
}

export default function MisDesafiosPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?error=unauthorized");
    } else if (!authLoading && user && user.rol !== 'externo') {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchDesafios = async () => {
      if (!user || user.rol !== 'externo') return;

      const token = Cookies.get('token');
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/desafios/mis-desafios`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Error al cargar desafíos');

        const data = await res.json();
        setDesafios(data);
      } catch (err: any) {
        console.error("Error fetching desafios:", err);
        toast.error("Error", { description: err.message });
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.rol === 'externo') {
      fetchDesafios();
    }
  }, [user]);

  if (authLoading || !user || user.rol !== 'externo') {
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
          <h1 className="text-3xl font-bold text-neutral-900">Mis Desafíos</h1>
          <p className="text-neutral-600 mt-2">
            Gestiona tus desafíos registrados
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/desafio/registrar">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Desafío
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : desafios.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-neutral-500 mb-4">
              No tienes desafíos registrados aún.
            </p>
            <Link href="/desafio/registrar">
              <Button>Registrar mi primer desafío</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {desafios.map((desafio) => (
            <div
              key={desafio.desafio_id}
              className="card-electric-fill p-6 rounded-xl border-2 border-black transition-all duration-350 ease-in-out relative"
            >
              <div className="mb-3">
                <h3 className="text-lg font-semibold mb-2">{desafio.titulo}</h3>
                <p className="text-sm opacity-80">
                  Registrado el {new Date(desafio.fecha_creacion).toLocaleDateString()}
                </p>
              </div>

              {desafio.descripcion && (
                <p className="text-sm mb-3 line-clamp-3 opacity-90">
                  {desafio.descripcion}
                </p>
              )}

              {desafio.palabras_clave && (
                <div className="mb-3">
                  <p className="text-xs font-medium opacity-70 mb-1">Palabras clave:</p>
                  <div className="flex flex-wrap gap-1">
                    {desafio.palabras_clave.split(',').map((palabra, idx) => (
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

              <Link href={`/desafio/editar/${desafio.desafio_id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-white border-2 border-black text-black hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white transition-all duration-250"
                >
                  Editar
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
