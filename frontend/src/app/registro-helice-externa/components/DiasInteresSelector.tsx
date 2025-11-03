"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { API_URL } from "@/config/api";

interface Sesion {
  sesion_id: number;
  dia_numero: number;
  nombre_dia: string;
  fecha: string;
  horario_display: string;
  bloque_tematico: string;
}

interface DiasInteresSelectorProps {
  selectedSesiones: number[];
  onChange: (sesiones: number[]) => void;
}

export default function DiasInteresSelector({ selectedSesiones, onChange }: DiasInteresSelectorProps) {
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarSesiones();
  }, []);

  const cargarSesiones = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cronograma`);
      if (response.ok) {
        const data = await response.json();
        // Aplanar las sesiones de todos los días
        const todasLasSesiones: Sesion[] = [];
        data.forEach((dia: any) => {
          dia.sesiones.forEach((sesion: any) => {
            todasLasSesiones.push({
              sesion_id: sesion.sesion_id,
              dia_numero: dia.dia_numero,
              nombre_dia: dia.nombre_dia,
              fecha: dia.fecha,
              horario_display: sesion.horario_display,
              bloque_tematico: sesion.bloque_tematico
            });
          });
        });
        setSesiones(todasLasSesiones);
      }
    } catch (error) {
      console.error("Error al cargar sesiones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (sesionId: number) => {
    if (selectedSesiones.includes(sesionId)) {
      onChange(selectedSesiones.filter(id => id !== sesionId));
    } else {
      onChange([...selectedSesiones, sesionId]);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Cargando días disponibles...</div>;
  }

  return (
    <div className="space-y-4">
      <Label>Días de Interés</Label>
      <p className="text-sm text-gray-600">
        Marque los días en los que desea participar. Esto estará sujeto a ubicación presencial o virtual
      </p>
      
      <div className="space-y-3 max-h-96 overflow-y-auto border rounded-lg p-4">
        {sesiones.map((sesion) => (
          <div key={sesion.sesion_id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded">
            <Checkbox
              id={`sesion-${sesion.sesion_id}`}
              checked={selectedSesiones.includes(sesion.sesion_id)}
              onCheckedChange={() => handleToggle(sesion.sesion_id)}
            />
            <label
              htmlFor={`sesion-${sesion.sesion_id}`}
              className="flex-1 cursor-pointer"
            >
              <div className="font-medium">
                Día {sesion.dia_numero}: {sesion.nombre_dia}
              </div>
              <div className="text-sm text-gray-600">
                {new Date(sesion.fecha).toLocaleDateString('es-ES')} - {sesion.horario_display}
              </div>
              <div className="text-sm text-gray-500">{sesion.bloque_tematico}</div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
