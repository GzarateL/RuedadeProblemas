"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Solucion {
  titulo: string;
  problema: string;
  solucion: string;
}

interface SolucionesEditorProps {
  soluciones: Solucion[];
  onChange: (soluciones: Solucion[]) => void;
  errors?: Record<string, string>;
}

export default function SolucionesEditor({ soluciones, onChange, errors = {} }: SolucionesEditorProps) {
  const addSolucion = () => {
    onChange([...soluciones, { titulo: '', problema: '', solucion: '' }]);
  };

  const removeSolucion = (index: number) => {
    if (soluciones.length > 1) {
      onChange(soluciones.filter((_, i) => i !== index));
    }
  };

  const updateSolucion = (index: number, field: keyof Solucion, value: string) => {
    const updated = soluciones.map((sol, i) =>
      i === index ? { ...sol, [field]: value } : sol
    );
    onChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Soluciones Propuestas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Instrucciones:</strong> Indique brevemente problemas que pueden solucionar. 
            Puede agregar todas las soluciones que desee.
          </p>
        </div>

        {soluciones.map((solucion, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Solución {index + 1}</h4>
              {soluciones.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeSolucion(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Eliminar
                </Button>
              )}
            </div>

            <div>
              <Label htmlFor={`titulo-${index}`}>Título *</Label>
              <Input
                id={`titulo-${index}`}
                value={solucion.titulo}
                onChange={(e) => updateSolucion(index, 'titulo', e.target.value)}
                placeholder="Ej: Sistema de monitoreo ambiental"
                className={errors[`titulo_${index}`] ? 'border-red-500' : ''}
              />
              {errors[`titulo_${index}`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`titulo_${index}`]}</p>
              )}
            </div>

            <div>
              <Label htmlFor={`problema-${index}`}>Problema *</Label>
              <Textarea
                id={`problema-${index}`}
                value={solucion.problema}
                onChange={(e) => updateSolucion(index, 'problema', e.target.value)}
                placeholder="Describa el problema que se puede solucionar"
                rows={3}
                className={errors[`problema_${index}`] ? 'border-red-500' : ''}
              />
              {errors[`problema_${index}`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`problema_${index}`]}</p>
              )}
            </div>

            <div>
              <Label htmlFor={`solucion-${index}`}>Solución *</Label>
              <Textarea
                id={`solucion-${index}`}
                value={solucion.solucion}
                onChange={(e) => updateSolucion(index, 'solucion', e.target.value)}
                placeholder="Describa la solución propuesta"
                rows={3}
                className={errors[`solucion_${index}`] ? 'border-red-500' : ''}
              />
              {errors[`solucion_${index}`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`solucion_${index}`]}</p>
              )}
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addSolucion}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar otra solución
        </Button>
      </CardContent>
    </Card>
  );
}
