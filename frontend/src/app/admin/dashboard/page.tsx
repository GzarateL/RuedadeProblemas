// /frontend/src/app/admin/dashboard/page.tsx
"use client"; // Necesario para useState, useEffect, fetch

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button'; // Asegúrate que Button está importado
import Link from 'next/link'; // Importa Link

// Interfaces para tipar los datos
interface Desafio {
  desafio_id: number;
  titulo: string;
  participante_nombre: string;
  organizacion: string;
  fecha_creacion: string; // O Date si lo parseas
  palabras_clave: string | null;
}

// NUEVA INTERFAZ PARA CAPACIDADES
interface Capacidad {
  capacidad_id: number;
  descripcion_capacidad: string;
  investigador_nombre: string; // Nombre del investigador
  palabras_clave: string | null;
  // Añade otros campos si los necesitas mostrar
}

interface KeywordStat {
  palabra: string;
  conteo_desafios: number;
}

export default function AdminDashboardPage() {
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [capacidades, setCapacidades] = useState<Capacidad[]>([]); // <-- NUEVO ESTADO
  const [keywordStats, setKeywordStats] = useState<KeywordStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchingActivo, setMatchingActivo] = useState(false);
  const [isTogglingMatching, setIsTogglingMatching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const token = Cookies.get('token');

      if (!token) {
        setError("No autenticado.");
        setIsLoading(false);
        return;
      }

      try {
        // Fetch Desafíos
        const desafiosRes = await fetch("http://localhost:3001/api/desafios", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!desafiosRes.ok) throw new Error(`Error ${desafiosRes.status}: No se pudieron cargar los desafíos.`);
        const desafiosData: Desafio[] = await desafiosRes.json();
        setDesafios(desafiosData);

        // Fetch Capacidades
        const capacidadesRes = await fetch("http://localhost:3001/api/capacidades", {
           headers: { "Authorization": `Bearer ${token}` }
        });
        if (!capacidadesRes.ok) throw new Error(`Error ${capacidadesRes.status}: No se pudieron cargar las capacidades.`);
        const capacidadesData: Capacidad[] = await capacidadesRes.json();
        setCapacidades(capacidadesData);

        // Fetch Keyword Stats
        const statsRes = await fetch("http://localhost:3001/api/palabras-clave/stats", {
           headers: { "Authorization": `Bearer ${token}` }
        });
        if (!statsRes.ok) throw new Error(`Error ${statsRes.status}: No se pudieron cargar las estadísticas.`);
        const statsData: KeywordStat[] = await statsRes.json();
        setKeywordStats(statsData);

        // Fetch estado del matching
        const matchingRes = await fetch("http://localhost:3001/api/matches/status", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (matchingRes.ok) {
          const matchingData = await matchingRes.json();
          setMatchingActivo(matchingData.activo);
        }

      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Ocurrió un error al cargar los datos.");
        toast.error("Error al cargar datos", { description: err.message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleMatching = async () => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error("No autenticado");
      return;
    }

    setIsTogglingMatching(true);
    try {
      const nuevoEstado = !matchingActivo;
      const res = await fetch("http://localhost:3001/api/matches/toggle", {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ activo: nuevoEstado })
      });

      if (!res.ok) throw new Error('Error al cambiar estado del matching');

      const data = await res.json();
      setMatchingActivo(data.activo);
      toast.success(
        data.activo ? "Matching Activado" : "Matching Desactivado",
        { 
          description: data.activo 
            ? "Los usuarios ahora recibirán sugerencias de matches" 
            : "El sistema de matching ha sido desactivado"
        }
      );
    } catch (err: any) {
      console.error("Error toggling matching:", err);
      toast.error("Error", { description: err.message });
    } finally {
      setIsTogglingMatching(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            Bienvenido al Dashboard
          </h1>
          <p className="text-neutral-600 mt-2">
            Resumen de la actividad en la plataforma.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Button
            onClick={handleToggleMatching}
            disabled={isTogglingMatching || isLoading}
            variant={matchingActivo ? "destructive" : "default"}
            size="lg"
            className="min-w-[200px]"
          >
            {isTogglingMatching ? "Procesando..." : matchingActivo ? "🔴 Detener Matching" : "🟢 Iniciar Matching"}
          </Button>
          <p className="text-xs text-neutral-500">
            Estado: {matchingActivo ? "Activo" : "Inactivo"}
          </p>
        </div>
      </div>

      {isLoading && <p className="mt-8 text-center">Cargando datos...</p>}
      {error && <p className="mt-8 text-center text-red-600">Error: {error}</p>}

      {!isLoading && !error && (
        <>
          {/* Resumen General */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold">Desafíos Registrados</h3>
              <p className="text-4xl font-bold mt-2">{desafios.length}</p>
            </div>
             <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold">Palabras Clave Populares</h3>
              <p className="text-xl font-bold mt-2 truncate">
                  {keywordStats.length > 0 ? keywordStats[0].palabra : '-'}
              </p>
               <p className="text-sm text-neutral-500">
                   {keywordStats.length > 0 ? `(${keywordStats[0].conteo_desafios} desafíos)` : '(No hay datos)'}
               </p>
            </div>
             <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold">Capacidades UNSA</h3>
              {/* <-- ACTUALIZADO CONTEO --> */}
              <p className="text-4xl font-bold mt-2">{capacidades.length}</p>
            </div>
          </div>

           {/* Tabla de Últimos Desafíos */}
           <div className="mt-12 bg-white p-6 rounded-lg border">
               <h2 className="text-xl font-semibold mb-4">Últimos Desafíos Registrados</h2>
               {desafios.length === 0 ? (
                    <p className="text-neutral-500">No hay desafíos registrados aún.</p>
               ) : (
                <div className="overflow-x-auto">
                   <table className="min-w-full divide-y divide-neutral-200">
                       <thead className="bg-neutral-50">
                           <tr>
                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Título</th>
                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Participante</th>
                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Organización</th>
                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Palabras Clave</th>
                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Fecha</th>
                           </tr>
                       </thead>
                       <tbody className="bg-white divide-y divide-neutral-200">
                           {desafios.slice(0, 5).map((desafio) => ( // Mostrar solo los últimos 5
                               <tr key={desafio.desafio_id}>
                                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{desafio.titulo}</td>
                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{desafio.participante_nombre}</td>
                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{desafio.organizacion || '-'}</td>
                                   <td className="px-6 py-4 text-sm text-neutral-500 max-w-xs truncate">{desafio.palabras_clave || '-'}</td>
                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{new Date(desafio.fecha_creacion).toLocaleDateString()}</td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
                </div>
               )}
                {desafios.length > 5 && (
                    <div className="mt-4">
                      {/* Enlace a la página completa de desafíos (si la creas) */}
                      <Link href="/admin/desafios">
                          <Button variant="link" size="sm">Ver todos los desafíos...</Button>
                      </Link>
                    </div>
                )}
           </div>

           {/* <-- NUEVA TABLA DE CAPACIDADES --> */}
           <div className="mt-12 bg-white p-6 rounded-lg border">
               <h2 className="text-xl font-semibold mb-4">Últimas Capacidades Registradas</h2>
               {capacidades.length === 0 ? (
                    <p className="text-neutral-500">No hay capacidades registradas aún.</p>
               ) : (
                <div className="overflow-x-auto">
                   <table className="min-w-full divide-y divide-neutral-200">
                       <thead className="bg-neutral-50">
                           <tr>
                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Descripción</th>
                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Investigador</th>
                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Palabras Clave</th>
                           </tr>
                       </thead>
                       <tbody className="bg-white divide-y divide-neutral-200">
                           {capacidades.slice(0, 5).map((capacidad) => ( // Mostrar solo las últimas 5
                               <tr key={capacidad.capacidad_id}>
                                   <td className="px-6 py-4 text-sm text-neutral-900 max-w-md truncate">{capacidad.descripcion_capacidad}</td>
                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{capacidad.investigador_nombre}</td>
                                   <td className="px-6 py-4 text-sm text-neutral-500 max-w-xs truncate">{capacidad.palabras_clave || '-'}</td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
                </div>
               )}
                {capacidades.length > 5 && (
                    <div className="mt-4">
                       {/* Enlace a la página completa de capacidades (si la creas) */}
                       <Link href="/admin/capacidades">
                           <Button variant="link" size="sm">Ver todas las capacidades...</Button>
                       </Link>
                    </div>
                )}
           </div>
           {/* <-- FIN NUEVA TABLA --> */}


           {/* Lista de Palabras Clave Populares (sin cambios) */}
           <div className="mt-8 bg-white p-6 rounded-lg border">
               <h2 className="text-xl font-semibold mb-4">Palabras Clave Más Utilizadas en Desafíos</h2>
                {keywordStats.length === 0 ? (
                    <p className="text-neutral-500">No hay datos de palabras clave.</p>
                ) : (
                    <ul className="space-y-2">
                        {keywordStats.map((stat) => (
                            <li key={stat.palabra} className="flex justify-between items-center text-sm">
                                <span className="text-neutral-700">{stat.palabra}</span>
                                <span className="font-medium text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                                    {stat.conteo_desafios} {stat.conteo_desafios === 1 ? 'desafío' : 'desafíos'}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
           </div>
        </>
      )}
    </div>
  );
}