"use client";

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import Link from 'next/link';

interface Desafio {
  desafio_id: number;
  titulo: string;
  descripcion: string;
  usuario_id: number;
}

interface CapacidadMatch {
  registro_id: number;
  usuario_id: number;
  tipo_registro: string;
  nombre_completo?: string;
  nombre?: string;
  email: string;
  telefono: string;
  programa_estudio?: string;
  oficina_departamento_vinculado?: string;
  score_total: number;
  score_ocde: number;
  score_ods: number;
  score_keywords: number;
  ocde_coincidencias: number;
  ods_coincidencias: number;
  keywords_coincidencias: number;
  keywords_comunes?: string;
}

export default function AdminMatchingPage() {
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [selectedDesafioId, setSelectedDesafioId] = useState<number | null>(null);
  const [capacidades, setCapacidades] = useState<CapacidadMatch[]>([]);
  const [isLoadingDesafios, setIsLoadingDesafios] = useState(true);
  const [isLoadingCapacidades, setIsLoadingCapacidades] = useState(false);

  // Cargar desafíos al montar
  useEffect(() => {
    console.log('Componente montado, cargando desafíos...');
    fetchDesafios();
  }, []);

  const fetchDesafios = async () => {
    setIsLoadingDesafios(true);
    const token = Cookies.get('token');

    if (!token) {
      toast.error("No autenticado");
      setIsLoadingDesafios(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/desafios/admin/todos`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error('Error al cargar desafíos');
      }

      const data = await res.json();
      console.log('Desafíos cargados:', data);
      console.log('Cantidad de desafíos:', data.length);
      setDesafios(data);
      
      if (data.length === 0) {
        toast.info("No hay desafíos registrados aún");
      }
    } catch (err: any) {
      console.error("Error fetching desafíos:", err);
      toast.error("Error al cargar desafíos", { description: err.message });
    } finally {
      setIsLoadingDesafios(false);
    }
  };

  const fetchCapacidadesMatch = async (desafioId: number) => {
    setIsLoadingCapacidades(true);
    const token = Cookies.get('token');

    if (!token) {
      toast.error("No autenticado");
      setIsLoadingCapacidades(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/matching/desafio/${desafioId}/avanzado?limit=50`,
        {
          headers: { "Authorization": `Bearer ${token}` }
        }
      );

      if (!res.ok) {
        throw new Error('Error al cargar capacidades');
      }

      const data: CapacidadMatch[] = await res.json();
      setCapacidades(data);
      
      if (data.length === 0) {
        toast.info("No se encontraron capacidades que coincidan con este desafío");
      } else {
        toast.success(`Se encontraron ${data.length} capacidades coincidentes`);
      }
    } catch (err: any) {
      console.error("Error fetching capacidades:", err);
      toast.error("Error al cargar capacidades", { description: err.message });
      setCapacidades([]);
    } finally {
      setIsLoadingCapacidades(false);
    }
  };

  const handleDesafioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const desafioId = parseInt(e.target.value);
    if (isNaN(desafioId)) {
      setSelectedDesafioId(null);
      setCapacidades([]);
      return;
    }

    setSelectedDesafioId(desafioId);
    fetchCapacidadesMatch(desafioId);
  };

  const getNombreCapacidad = (cap: CapacidadMatch) => {
    return cap.tipo_registro === 'docente_investigador' 
      ? cap.nombre_completo 
      : cap.nombre;
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      'docente_investigador': 'Docente Investigador',
      'grupo_centro_instituto': 'Grupo/Centro/Instituto',
      'laboratorio': 'Laboratorio',
      'centro_produccion': 'Centro de Producción'
    };
    return labels[tipo] || tipo;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Matching Avanzado</h1>
        <p className="text-sm text-neutral-600 mt-1">
          Encuentra las mejores capacidades para cada desafío basado en OCDE (60%), ODS (25%) y Keywords (15%)
        </p>
      </div>

      {/* Selector de Desafío */}
      <div className="bg-white rounded-lg border p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar Desafío
        </label>
        {isLoadingDesafios ? (
          <div className="text-center py-4">
            <p className="text-neutral-600 animate-pulse">Cargando desafíos...</p>
          </div>
        ) : (
          <select
            value={selectedDesafioId || ''}
            onChange={handleDesafioChange}
            disabled={isLoadingDesafios}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Seleccione un desafío --</option>
            {desafios.map((desafio) => (
              <option key={desafio.desafio_id} value={desafio.desafio_id}>
                {desafio.titulo}
              </option>
            ))}
          </select>
        )}
        {!isLoadingDesafios && desafios.length === 0 && (
          <p className="text-sm text-neutral-500 mt-2">
            No hay desafíos registrados. Los usuarios externos deben registrar desafíos primero.
          </p>
        )}
      </div>

      {/* Resultados de Capacidades */}
      {isLoadingCapacidades ? (
        <div className="text-center py-12">
          <p className="text-neutral-600 animate-pulse">Calculando matches...</p>
        </div>
      ) : capacidades.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-800">
            Capacidades Encontradas ({capacidades.length})
          </h2>
          
          <div className="grid gap-4">
            {capacidades.map((cap, index) => (
              <div
                key={`${cap.tipo_registro}-${cap.registro_id}`}
                className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-semibold text-neutral-900">
                        #{index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {getNombreCapacidad(cap)}
                      </h3>
                    </div>
                    <p className="text-sm text-neutral-600">{getTipoLabel(cap.tipo_registro)}</p>
                    <p className="text-sm text-neutral-500">{cap.email}</p>
                    {cap.programa_estudio && (
                      <p className="text-sm text-neutral-500">Programa: {cap.programa_estudio}</p>
                    )}
                    {cap.oficina_departamento_vinculado && (
                      <p className="text-sm text-neutral-500">Departamento: {cap.oficina_departamento_vinculado}</p>
                    )}
                  </div>
                  
                  {/* Score Total */}
                  <div className="text-right">
                    <div className={`inline-block px-4 py-2 rounded-lg font-bold text-2xl ${getScoreColor(cap.score_total)}`}>
                      {cap.score_total.toFixed(1)}%
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">Score Total</p>
                  </div>
                </div>

                {/* Desglose de Scores */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs text-purple-600 font-medium mb-1">OCDE (60%)</p>
                    <p className="text-lg font-bold text-purple-700">{cap.score_ocde.toFixed(1)}%</p>
                    <p className="text-xs text-purple-600">{cap.ocde_coincidencias} coincidencias</p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-600 font-medium mb-1">ODS (25%)</p>
                    <p className="text-lg font-bold text-blue-700">{cap.score_ods.toFixed(1)}%</p>
                    <p className="text-xs text-blue-600">{cap.ods_coincidencias} coincidencias</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-green-600 font-medium mb-1">Keywords (15%)</p>
                    <p className="text-lg font-bold text-green-700">{cap.score_keywords.toFixed(1)}%</p>
                    <p className="text-xs text-green-600">{cap.keywords_coincidencias} coincidencias</p>
                  </div>
                </div>

                {/* Keywords Comunes */}
                {cap.keywords_comunes && (
                  <div className="border-t pt-3">
                    <p className="text-xs font-medium text-neutral-700 mb-2">Keywords en común:</p>
                    <div className="flex flex-wrap gap-2">
                      {cap.keywords_comunes.split(', ').map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : selectedDesafioId ? (
        <div className="border border-dashed rounded-lg p-12 text-center bg-gray-50">
          <p className="text-neutral-500">No se encontraron capacidades que coincidan con este desafío.</p>
        </div>
      ) : null}

      {/* Enlace de regreso */}
      <div className="pt-4">
        <Link href="/admin/dashboard" className="text-sm text-blue-600 hover:underline">
          ← Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}
