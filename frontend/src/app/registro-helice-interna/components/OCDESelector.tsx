"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Area {
  id: number;
  codigo: string;
  nombre: string;
}

interface SubArea {
  id: number;
  codigo: string;
  nombre: string;
  area_id: number;
}

interface Disciplina {
  id: number;
  codigo: string;
  nombre: string;
  sub_area_id: number;
}

interface OCDESelectorProps {
  selectedAreas: number[];
  selectedSubAreas: number[];
  selectedDisciplinas: number[];
  onSelectionChange: (areas: number[], subAreas: number[], disciplinas: number[]) => void;
}

export default function OCDESelector({
  selectedAreas,
  selectedSubAreas,
  selectedDisciplinas,
  onSelectionChange
}: OCDESelectorProps) {
  const [areas, setAreas] = useState<Area[]>([]);
  const [subAreas, setSubAreas] = useState<SubArea[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [expandedAreas, setExpandedAreas] = useState<Set<number>>(new Set());
  const [expandedSubAreas, setExpandedSubAreas] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOCDEData();
  }, []);

  // Expandir y cargar datos cuando hay selecciones previas (modo edición)
  useEffect(() => {
    const loadSelectedData = async () => {
      if (areas.length === 0) return;
      if (selectedDisciplinas.length === 0) return;

      console.log('Cargando datos OCDE seleccionados:', { selectedDisciplinas });

      // Cargar datos basándose en las disciplinas seleccionadas
      for (const disciplinaId of selectedDisciplinas) {
        try {
          // Obtener información de la disciplina desde el backend
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/ocde/disciplinas/${disciplinaId}`);
          if (response.ok) {
            const discData = await response.json();
            
            // Cargar sub-área si no está cargada
            const subAreaExists = subAreas.find(sa => sa.id === discData.sub_area_id);
            if (!subAreaExists) {
              const saResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/ocde/sub-areas/${discData.sub_area_id}`);
              if (saResponse.ok) {
                const saData = await saResponse.json();
                setSubAreas(prev => {
                  const exists = prev.find(sa => sa.id === saData.id);
                  return exists ? prev : [...prev, saData];
                });
                
                // Expandir el área correspondiente y cargar todas sus sub-áreas
                setExpandedAreas(prev => new Set(prev).add(saData.area_id));
                await fetchSubAreas(saData.area_id);
              }
            } else {
              // Si la sub-área ya existe, solo expandir el área
              setExpandedAreas(prev => new Set(prev).add(subAreaExists.area_id));
              await fetchSubAreas(subAreaExists.area_id);
            }
            
            // Expandir la sub-área y cargar sus disciplinas
            setExpandedSubAreas(prev => new Set(prev).add(discData.sub_area_id));
            await fetchDisciplinas(discData.sub_area_id);
          }
        } catch (error) {
          console.error('Error loading disciplina data:', error);
        }
      }
    };

    loadSelectedData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areas.length]); // Solo ejecutar cuando se cargan las áreas inicialmente

  const fetchOCDEData = async () => {
    try {
      // Obtener solo las áreas principales
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/ocde/areas`);
      if (!response.ok) throw new Error('Error al cargar áreas OCDE');

      const areasData = await response.json();
      setAreas(areasData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching OCDE data:', error);
      setLoading(false);
    }
  };

  const fetchSubAreas = async (areaId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/ocde/areas/${areaId}/sub-areas`);
      if (!response.ok) throw new Error('Error al cargar sub-áreas');

      const subAreasData = await response.json();
      setSubAreas(prev => {
        // Evitar duplicados: solo agregar sub-áreas que no existen
        const existingIds = new Set(prev.map(sa => sa.id));
        const newSubAreas = subAreasData.filter((sa: SubArea) => !existingIds.has(sa.id));
        return [...prev, ...newSubAreas];
      });
    } catch (error) {
      console.error('Error fetching sub-areas:', error);
    }
  };

  const fetchDisciplinas = async (subAreaId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/ocde/sub-areas/${subAreaId}/disciplinas`);
      if (!response.ok) throw new Error('Error al cargar disciplinas');

      const disciplinasData = await response.json();
      setDisciplinas(prev => {
        // Evitar duplicados: solo agregar disciplinas que no existen
        const existingIds = new Set(prev.map(d => d.id));
        const newDisciplinas = disciplinasData.filter((d: Disciplina) => !existingIds.has(d.id));
        return [...prev, ...newDisciplinas];
      });
    } catch (error) {
      console.error('Error fetching disciplinas:', error);
    }
  };

  const toggleAreaExpansion = (areaId: number) => {
    const newExpanded = new Set(expandedAreas);
    if (newExpanded.has(areaId)) {
      newExpanded.delete(areaId);
    } else {
      newExpanded.add(areaId);
      // Cargar sub-áreas solo cuando se expande el área
      const areaSubAreas = subAreas.filter(sa => sa.area_id === areaId);
      if (areaSubAreas.length === 0) {
        fetchSubAreas(areaId);
      }
    }
    setExpandedAreas(newExpanded);
  };

  const toggleSubAreaExpansion = (subAreaId: number) => {
    const newExpanded = new Set(expandedSubAreas);
    if (newExpanded.has(subAreaId)) {
      newExpanded.delete(subAreaId);
    } else {
      newExpanded.add(subAreaId);
      // Cargar disciplinas solo cuando se expande la sub-área
      const subAreaDisciplinas = disciplinas.filter(d => d.sub_area_id === subAreaId);
      if (subAreaDisciplinas.length === 0) {
        fetchDisciplinas(subAreaId);
      }
    }
    setExpandedSubAreas(newExpanded);
  };

  const handleAreaChange = (areaId: number, checked: boolean) => {
    let newAreas = [...selectedAreas];
    let newSubAreas = [...selectedSubAreas];
    let newDisciplinas = [...selectedDisciplinas];

    if (checked) {
      if (!newAreas.includes(areaId)) {
        newAreas.push(areaId);
      }
    } else {
      newAreas = newAreas.filter(id => id !== areaId);
      // Remover sub-áreas y disciplinas relacionadas
      const relatedSubAreas = subAreas.filter(sa => sa.area_id === areaId).map(sa => sa.id);
      newSubAreas = newSubAreas.filter(id => !relatedSubAreas.includes(id));

      const relatedDisciplinas = disciplinas.filter(d =>
        relatedSubAreas.includes(d.sub_area_id)
      ).map(d => d.id);
      newDisciplinas = newDisciplinas.filter(id => !relatedDisciplinas.includes(id));
    }

    onSelectionChange(newAreas, newSubAreas, newDisciplinas);
  };

  const handleSubAreaChange = (subAreaId: number, checked: boolean) => {
    let newSubAreas = [...selectedSubAreas];
    let newDisciplinas = [...selectedDisciplinas];

    if (checked) {
      if (!newSubAreas.includes(subAreaId)) {
        newSubAreas.push(subAreaId);
      }
    } else {
      newSubAreas = newSubAreas.filter(id => id !== subAreaId);
      // Remover disciplinas relacionadas
      const relatedDisciplinas = disciplinas.filter(d => d.sub_area_id === subAreaId).map(d => d.id);
      newDisciplinas = newDisciplinas.filter(id => !relatedDisciplinas.includes(id));
    }

    onSelectionChange(selectedAreas, newSubAreas, newDisciplinas);
  };

  const handleDisciplinaChange = (disciplinaId: number, checked: boolean) => {
    let newDisciplinas = [...selectedDisciplinas];

    if (checked) {
      if (!newDisciplinas.includes(disciplinaId)) {
        newDisciplinas.push(disciplinaId);
      }
    } else {
      newDisciplinas = newDisciplinas.filter(id => id !== disciplinaId);
    }

    onSelectionChange(selectedAreas, selectedSubAreas, newDisciplinas);
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
        Seleccione las áreas OCDE que mejor describan su expertise. Puede seleccionar múltiples opciones.
      </div>

      {areas.map((area) => {
        const areaSubAreas = subAreas.filter(sa => sa.area_id === area.id);
        const isAreaExpanded = expandedAreas.has(area.id);
        const isAreaSelected = selectedAreas.includes(area.id);

        return (
          <Card key={area.id} className="border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={`area-${area.id}`}
                  checked={isAreaSelected}
                  onCheckedChange={(checked) => handleAreaChange(area.id, checked as boolean)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleAreaExpansion(area.id)}
                  className="p-0 h-auto font-normal flex-1 justify-start"
                >
                  {isAreaExpanded ? (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2" />
                  )}
                  <span className="font-medium text-sm">
                    {area.codigo} - {area.nombre}
                  </span>
                </Button>
              </div>
            </CardHeader>

            {isAreaExpanded && (
              <CardContent className="pt-0">
                <div className="ml-6 space-y-3">
                  {areaSubAreas.map((subArea, subAreaIndex) => {
                    const subAreaDisciplinas = disciplinas.filter(d => d.sub_area_id === subArea.id);
                    const isSubAreaExpanded = expandedSubAreas.has(subArea.id);
                    const isSubAreaSelected = selectedSubAreas.includes(subArea.id);

                    return (
                      <div key={`area-${area.id}-subarea-${subArea.id}-idx-${subAreaIndex}`} className="border-l-2 border-gray-100 pl-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <Checkbox
                            id={`subarea-${subArea.id}`}
                            checked={isSubAreaSelected}
                            onCheckedChange={(checked) => handleSubAreaChange(subArea.id, checked as boolean)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSubAreaExpansion(subArea.id)}
                            className="p-0 h-auto font-normal flex-1 justify-start text-sm"
                          >
                            {isSubAreaExpanded ? (
                              <ChevronDown className="h-3 w-3 mr-2" />
                            ) : (
                              <ChevronRight className="h-3 w-3 mr-2" />
                            )}
                            {subArea.codigo} - {subArea.nombre}
                          </Button>
                        </div>

                        {isSubAreaExpanded && (
                          <div className="ml-6 space-y-2">
                            {subAreaDisciplinas.map((disciplina, discIndex) => {
                              const isDisciplinaSelected = selectedDisciplinas.includes(disciplina.id);

                              return (
                                <div key={`area-${area.id}-subarea-${subArea.id}-disciplina-${disciplina.id}-idx-${discIndex}`} className="flex items-center space-x-3">
                                  <Checkbox
                                    id={`disciplina-${disciplina.id}`}
                                    checked={isDisciplinaSelected}
                                    onCheckedChange={(checked) => handleDisciplinaChange(disciplina.id, checked as boolean)}
                                  />
                                  <label
                                    htmlFor={`disciplina-${disciplina.id}`}
                                    className="text-sm text-gray-700 cursor-pointer"
                                  >
                                    {disciplina.codigo} - {disciplina.nombre}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        )}
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