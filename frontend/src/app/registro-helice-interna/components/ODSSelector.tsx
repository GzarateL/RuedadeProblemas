"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Objetivo {
  id: number;
  nombre: string;
}

interface Meta {
  id: number;
  objetivo_id: number;
  codigo: string;
  descripcion: string;
}

interface ODSSelectorProps {
  selectedObjetivos: number[];
  selectedMetas: number[];
  onSelectionChange: (objetivos: number[], metas: number[]) => void;
}

export default function ODSSelector({
  selectedObjetivos,
  selectedMetas,
  onSelectionChange
}: ODSSelectorProps) {
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [metas, setMetas] = useState<Meta[]>([]);
  const [expandedObjetivos, setExpandedObjetivos] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchODSData();
  }, []);

  const fetchODSData = async () => {
    try {
      // Obtener solo los objetivos principales
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/ods/objetivos`);
      if (!response.ok) throw new Error('Error al cargar objetivos ODS');
      
      const objetivosData = await response.json();
      setObjetivos(objetivosData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ODS data:', error);
      setLoading(false);
    }
  };

  const fetchMetas = async (objetivoId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/ods/objetivos/${objetivoId}/metas`);
      if (!response.ok) throw new Error('Error al cargar metas');
      
      const metasData = await response.json();
      setMetas(prev => [...prev, ...metasData]);
    } catch (error) {
      console.error('Error fetching metas:', error);
    }
  };

  const toggleObjetivoExpansion = (objetivoId: number) => {
    const newExpanded = new Set(expandedObjetivos);
    if (newExpanded.has(objetivoId)) {
      newExpanded.delete(objetivoId);
    } else {
      newExpanded.add(objetivoId);
      // Cargar metas solo cuando se expande el objetivo
      const objetivoMetas = metas.filter(m => m.objetivo_id === objetivoId);
      if (objetivoMetas.length === 0) {
        fetchMetas(objetivoId);
      }
    }
    setExpandedObjetivos(newExpanded);
  };

  const handleObjetivoChange = (objetivoId: number, checked: boolean) => {
    let newObjetivos = [...selectedObjetivos];
    let newMetas = [...selectedMetas];

    if (checked) {
      if (!newObjetivos.includes(objetivoId)) {
        newObjetivos.push(objetivoId);
      }
    } else {
      newObjetivos = newObjetivos.filter(id => id !== objetivoId);
      // Remover metas relacionadas
      const relatedMetas = metas.filter(m => m.objetivo_id === objetivoId).map(m => m.id);
      newMetas = newMetas.filter(id => !relatedMetas.includes(id));
    }

    onSelectionChange(newObjetivos, newMetas);
  };

  const handleMetaChange = (metaId: number, checked: boolean) => {
    let newMetas = [...selectedMetas];

    if (checked) {
      if (!newMetas.includes(metaId)) {
        newMetas.push(metaId);
      }
    } else {
      newMetas = newMetas.filter(id => id !== metaId);
    }

    onSelectionChange(selectedObjetivos, newMetas);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Seleccione los Objetivos de Desarrollo Sostenible (ODS) con los que su trabajo se alinea. Puede expandir cada objetivo para ver las metas específicas.
      </div>

      {objetivos.map((objetivo) => {
        const objetivoMetas = metas.filter(m => m.objetivo_id === objetivo.id);
        const isObjetivoExpanded = expandedObjetivos.has(objetivo.id);
        const isObjetivoSelected = selectedObjetivos.includes(objetivo.id);

        return (
          <Card key={objetivo.id} className="border border-gray-200">
            <CardHeader className="pb-3">
  <div className="flex items-start space-x-3">
    <Checkbox
      id={`objetivo-${objetivo.id}`}
      checked={isObjetivoSelected}
      onCheckedChange={(checked) => handleObjetivoChange(objetivo.id, checked as boolean)}
      className="mt-1 flex-shrink-0"
    />
    <button
      type="button"
      onClick={() => toggleObjetivoExpansion(objetivo.id)}
      className="flex-1 min-w-0 text-left p-0 bg-transparent hover:bg-gray-50 rounded transition-colors"
    >
      <div className="flex items-start w-full">
        {isObjetivoExpanded ? (
          <ChevronDown className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0 max-w-full overflow-hidden">
          <div className="font-medium text-sm mb-1 break-words">
            ODS {objetivo.id}
          </div>
          <div className="text-sm text-gray-700 leading-relaxed break-words">
            {objetivo.nombre}
          </div>
        </div>
      </div>
    </button>
  </div>
</CardHeader>
            {isObjetivoExpanded && objetivoMetas.length > 0 && (
              <CardContent className="pt-0">
                <div className="ml-6 space-y-3">
                  <div className="text-sm font-medium text-gray-700 mb-3">
                    Metas específicas:
                  </div>
                  {objetivoMetas.map((meta) => {
                    const isMetaSelected = selectedMetas.includes(meta.id);

                    return (
                      <div key={meta.id} className="border-l-2 border-gray-100 pl-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id={`meta-${meta.id}`}
                            checked={isMetaSelected}
                            onCheckedChange={(checked) => handleMetaChange(meta.id, checked as boolean)}
                            className="mt-1"
                          />
                          <label
                            htmlFor={`meta-${meta.id}`}
                            className="text-sm text-gray-700 cursor-pointer leading-relaxed"
                          >
                            <span className="font-medium">{meta.codigo}:</span> {meta.descripcion}
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}