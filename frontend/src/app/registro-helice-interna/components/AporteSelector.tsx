"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AporteData {
  nivelAporteDEL: number | null;
  nivelAporteDS: number | null;
}

interface AporteSelectorProps {
  data: AporteData;
  onChange: (field: keyof AporteData, value: number) => void;
  errors?: Record<string, string>;
}

export default function AporteSelector({ data, onChange, errors = {} }: AporteSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nivel de Aporte</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Instrucciones:</strong> Seleccione el nivel de aporte en una escala del 1 al 7, 
            donde 1 es el nivel más bajo y 7 es el nivel más alto.
          </p>
        </div>

        <div>
          <Label htmlFor="nivelAporteDEL">
            Aporte al DEL (Desarrollo Económico Local) *
          </Label>
          <p className="text-sm text-gray-600 mb-2">
            Desarrollo económico local (destinado a las personas): mejorar la calidad de vida y sus ingresos.
            Escala: 1 (Mínimo aporte) - 7 (Máximo aporte)
          </p>
          <Select
            value={data.nivelAporteDEL?.toString() || ''}
            onValueChange={(value) => onChange('nivelAporteDEL', parseInt(value))}
          >
            <SelectTrigger className={errors.nivelAporteDEL ? 'border-red-500' : ''}>
              <SelectValue placeholder="Seleccione nivel (1-7)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Muy bajo</SelectItem>
              <SelectItem value="2">2 - Bajo</SelectItem>
              <SelectItem value="3">3 - Moderadamente bajo</SelectItem>
              <SelectItem value="4">4 - Medio</SelectItem>
              <SelectItem value="5">5 - Moderadamente alto</SelectItem>
              <SelectItem value="6">6 - Alto</SelectItem>
              <SelectItem value="7">7 - Muy alto</SelectItem>
            </SelectContent>
          </Select>
          {errors.nivelAporteDEL && (
            <p className="text-red-500 text-sm mt-1">{errors.nivelAporteDEL}</p>
          )}
        </div>

        <div>
          <Label htmlFor="nivelAporteDS">
            Aporte al DS (Desarrollo Sostenible) *
          </Label>
          <p className="text-sm text-gray-600 mb-2">
            Desarrollo social (destinado a las políticas y gestión pública - Gobiernos): educación, salud, 
            infraestructura, transporte, seguridad, cultura, etc.
            Escala: 1 (Mínimo aporte) - 7 (Máximo aporte)
          </p>
          <Select
            value={data.nivelAporteDS?.toString() || ''}
            onValueChange={(value) => onChange('nivelAporteDS', parseInt(value))}
          >
            <SelectTrigger className={errors.nivelAporteDS ? 'border-red-500' : ''}>
              <SelectValue placeholder="Seleccione nivel (1-7)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Muy bajo</SelectItem>
              <SelectItem value="2">2 - Bajo</SelectItem>
              <SelectItem value="3">3 - Moderadamente bajo</SelectItem>
              <SelectItem value="4">4 - Medio</SelectItem>
              <SelectItem value="5">5 - Moderadamente alto</SelectItem>
              <SelectItem value="6">6 - Alto</SelectItem>
              <SelectItem value="7">7 - Muy alto</SelectItem>
            </SelectContent>
          </Select>
          {errors.nivelAporteDS && (
            <p className="text-red-500 text-sm mt-1">{errors.nivelAporteDS}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
