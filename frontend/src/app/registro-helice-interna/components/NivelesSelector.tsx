"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NivelesData {
  nivelTRL: number | null;
  nivelCRL: number | null;
}

interface NivelesSelectorProps {
  data: NivelesData;
  onChange: (field: keyof NivelesData, value: number | null) => void;
  errors?: Record<string, string>;
}

export default function NivelesSelector({ data, onChange, errors = {} }: NivelesSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Niveles Tecnológicos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>TRL (Technology Readiness Level):</strong> Nivel de madurez tecnológica (1-9)<br/>
            <strong>CRL (Commercial Readiness Level):</strong> Nivel de preparación comercial (1-9)
          </p>
        </div>

        <div>
          <Label htmlFor="nivelTRL">
            Nivel TRL *
          </Label>
          <p className="text-sm text-gray-600 mb-2">
            Señale su máximo nivel de TRL que podría alcanzar al día de hoy
          </p>
          <Select
            value={data.nivelTRL?.toString() || ''}
            onValueChange={(value) => onChange('nivelTRL', parseInt(value))}
          >
            <SelectTrigger className={errors.nivelTRL ? 'border-red-500' : ''}>
              <SelectValue placeholder="Seleccione nivel TRL (1-9)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">TRL 1 - Principios básicos observados</SelectItem>
              <SelectItem value="2">TRL 2 - Concepto tecnológico formulado</SelectItem>
              <SelectItem value="3">TRL 3 - Prueba de concepto experimental</SelectItem>
              <SelectItem value="4">TRL 4 - Validación en laboratorio</SelectItem>
              <SelectItem value="5">TRL 5 - Validación en entorno relevante</SelectItem>
              <SelectItem value="6">TRL 6 - Demostración en entorno relevante</SelectItem>
              <SelectItem value="7">TRL 7 - Demostración en entorno operacional</SelectItem>
              <SelectItem value="8">TRL 8 - Sistema completo y calificado</SelectItem>
              <SelectItem value="9">TRL 9 - Sistema probado en entorno operacional</SelectItem>
            </SelectContent>
          </Select>
          {errors.nivelTRL && (
            <p className="text-red-500 text-sm mt-1">{errors.nivelTRL}</p>
          )}
        </div>

        <div>
          <Label htmlFor="nivelCRL">
            Nivel CRL *
          </Label>
          <p className="text-sm text-gray-600 mb-2">
            Señale su máximo nivel de CRL que podría alcanzar al día de hoy
          </p>
          <Select
            value={data.nivelCRL?.toString() || ''}
            onValueChange={(value) => onChange('nivelCRL', parseInt(value))}
          >
            <SelectTrigger className={errors.nivelCRL ? 'border-red-500' : ''}>
              <SelectValue placeholder="Seleccione nivel CRL (1-9)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">CRL 1 - Idea de negocio</SelectItem>
              <SelectItem value="2">CRL 2 - Concepto de negocio</SelectItem>
              <SelectItem value="3">CRL 3 - Prueba de concepto de negocio</SelectItem>
              <SelectItem value="4">CRL 4 - Validación de mercado</SelectItem>
              <SelectItem value="5">CRL 5 - Producto mínimo viable</SelectItem>
              <SelectItem value="6">CRL 6 - Primeros clientes</SelectItem>
              <SelectItem value="7">CRL 7 - Escalamiento inicial</SelectItem>
              <SelectItem value="8">CRL 8 - Crecimiento sostenido</SelectItem>
              <SelectItem value="9">CRL 9 - Madurez comercial</SelectItem>
            </SelectContent>
          </Select>
          {errors.nivelCRL && (
            <p className="text-red-500 text-sm mt-1">{errors.nivelCRL}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
