"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash2, FileText, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';

interface RegistroHeliceInterna {
  registro_id: number;
  tipo: 'docente_investigador' | 'grupo_centro_instituto' | 'laboratorio' | 'centro_produccion';
  nombre_completo?: string;
  nombre?: string;
  email: string;
  telefono: string;
  estado: 'borrador' | 'completado' | 'en_revision' | 'aprobado' | 'rechazado';
  fecha_creacion: string;
  fecha_actualizacion?: string;
  paso_actual: number;
}

export default function MisRegistrosHeliceInternaPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [registros, setRegistros] = useState<RegistroHeliceInterna[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?error=unauthorized");
    } else if (!authLoading && user && user.rol !== 'interno') {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchRegistros = async () => {
      if (!user || user.rol !== 'interno') return;

      const token = Cookies.get('token');
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/registros`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Error al cargar registros');

        const data = await res.json();
        console.log("Registros recibidos:", data);
        setRegistros(data);
      } catch (err: any) {
        console.error("Error fetching registros:", err);
        toast.error("Error", { description: err.message });
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.rol === 'interno') {
      fetchRegistros();
    }
  }, [user]);

  const handleEliminar = async (registroId: number, tipo: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.')) {
      return;
    }

    const token = Cookies.get('token');
    if (!token) {
      toast.error("No autenticado");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/registros/${registroId}?tipo=${tipo}`,
        {
          method: 'DELETE',
          headers: { "Authorization": `Bearer ${token}` }
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al eliminar registro');
      }

      toast.success("Registro eliminado exitosamente");
      setRegistros(prev => prev.filter(r => r.registro_id !== registroId));
    } catch (err: any) {
      toast.error("Error", { description: err.message });
    }
  };

  const getTipoNombre = (tipo: string) => {
    const tipos: Record<string, string> = {
      'docente_investigador': 'Docente/Investigador',
      'grupo_centro_instituto': 'Grupo/Centro/Instituto',
      'laboratorio': 'Laboratorio',
      'centro_produccion': 'Centro de Producción'
    };
    return tipos[tipo] || tipo;
  };

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { color: string; icon: any; label: string }> = {
      'borrador': { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Borrador' },
      'completado': { color: 'bg-blue-100 text-blue-800', icon: FileText, label: 'Completado' },
      'en_revision': { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'En Revisión' },
      'aprobado': { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Aprobado' },
      'rechazado': { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rechazado' }
    };
    const config = estados[estado] || estados['borrador'];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (authLoading || !user || user.rol !== 'interno') {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-theme(space.16))]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Registros de Hélice Interna</h1>
          <p className="text-gray-600 mt-2">
            Gestiona tus registros como docente, investigador o entidad de la UNSA
          </p>
        </div>
        <Link href="/registro-helice-interna">
          <Button className="flex items-center gap-2 bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4" />
            Nuevo Registro
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      ) : registros.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes registros aún
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primer registro de hélice interna para comenzar a participar en el sistema de matching
            </p>
            <Link href="/registro-helice-interna">
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Crear mi primer registro
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {registros.map((registro) => (
            <Card key={`${registro.tipo}-${registro.registro_id}`} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">
                        {registro.nombre_completo || registro.nombre || 'Sin nombre'}
                      </CardTitle>
                      {getEstadoBadge(registro.estado)}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {getTipoNombre(registro.tipo)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Fecha de creación</p>
                      <p className="text-sm font-medium">{formatFecha(registro.fecha_creacion)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium">{registro.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Teléfono</p>
                      <p className="text-sm font-medium">{registro.telefono}</p>
                    </div>
                  </div>
                </div>

                {registro.estado === 'borrador' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Registro incompleto:</strong> Paso {registro.paso_actual} de 9.
                      Continúa editando para completar tu registro.
                    </p>
                  </div>
                )}

                {registro.estado === 'rechazado' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-red-800">
                      <strong>Registro rechazado:</strong> Revisa las observaciones y edita tu registro.
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link
                    href={`/registro-helice-interna/${registro.tipo === 'docente_investigador' ? 'docente_investigador' :
                      registro.tipo === 'grupo_centro_instituto' ? 'grupo_centro_instituto' :
                        registro.tipo === 'laboratorio' ? 'laboratorio' :
                          'centro_produccion'
                      }?edit=${registro.registro_id}`}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleEliminar(registro.registro_id, registro.tipo)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
