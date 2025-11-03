"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PIUData {
  tesis: number;
  libros: number;
  capitulosLibro: number;
  manuscritosPublicados: number;
  manuscritosAceptados: number;
  manuscritosEvaluacion: number;
  propiedadIntelectualPatente: number;
  propiedadIntelectualModalidadUso: number;
  propiedadIntelectualSuiGeneris: number;
  propiedadIntelectualSoftware: number;
  propiedadIntelectualObrasLiterarias: number;
  propiedadIntelectualOtras: number;
}

interface PIUSelectorProps {
  data: PIUData;
  onChange: (field: keyof PIUData, value: number) => void;
  errors?: Record<string, string>;
}

export default function PIUSelector({ data, onChange, errors = {} }: PIUSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>PIU Alcanzada (Producción Intelectual Universitaria)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Instrucciones:</strong> Indique la cantidad de productos de PIU que han logrado (0 a 999).
          </p>
        </div>

        {/* Tesis, Libros y Capítulos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="tesis">Tesis</Label>
            <Input
              id="tesis"
              type="number"
              min="0"
              max="999"
              value={data.tesis}
              onChange={(e) => onChange('tesis', parseInt(e.target.value) || 0)}
              className={errors.tesis ? 'border-red-500' : ''}
            />
          </div>

          <div>
            <Label htmlFor="libros">Libros</Label>
            <Input
              id="libros"
              type="number"
              min="0"
              max="999"
              value={data.libros}
              onChange={(e) => onChange('libros', parseInt(e.target.value) || 0)}
              className={errors.libros ? 'border-red-500' : ''}
            />
          </div>

          <div>
            <Label htmlFor="capitulosLibro">Capítulos de libro</Label>
            <Input
              id="capitulosLibro"
              type="number"
              min="0"
              max="999"
              value={data.capitulosLibro}
              onChange={(e) => onChange('capitulosLibro', parseInt(e.target.value) || 0)}
              className={errors.capitulosLibro ? 'border-red-500' : ''}
            />
          </div>
        </div>

        {/* Manuscritos */}
        <div>
          <h4 className="font-medium mb-3">Manuscritos</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="manuscritosPublicados">Publicados</Label>
              <Input
                id="manuscritosPublicados"
                type="number"
                min="0"
                max="999"
                value={data.manuscritosPublicados}
                onChange={(e) => onChange('manuscritosPublicados', parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="manuscritosAceptados">Aceptados para publicación</Label>
              <Input
                id="manuscritosAceptados"
                type="number"
                min="0"
                max="999"
                value={data.manuscritosAceptados}
                onChange={(e) => onChange('manuscritosAceptados', parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="manuscritosEvaluacion">En evaluación</Label>
              <Input
                id="manuscritosEvaluacion"
                type="number"
                min="0"
                max="999"
                value={data.manuscritosEvaluacion}
                onChange={(e) => onChange('manuscritosEvaluacion', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        {/* Propiedad Intelectual */}
        <div>
          <h4 className="font-medium mb-3">Propiedad Intelectual</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="propiedadIntelectualPatente">Patente de invención</Label>
              <Input
                id="propiedadIntelectualPatente"
                type="number"
                min="0"
                max="999"
                value={data.propiedadIntelectualPatente}
                onChange={(e) => onChange('propiedadIntelectualPatente', parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="propiedadIntelectualModalidadUso">Patente modalidad de uso</Label>
              <Input
                id="propiedadIntelectualModalidadUso"
                type="number"
                min="0"
                max="999"
                value={data.propiedadIntelectualModalidadUso}
                onChange={(e) => onChange('propiedadIntelectualModalidadUso', parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="propiedadIntelectualSuiGeneris">Sui generis</Label>
              <Input
                id="propiedadIntelectualSuiGeneris"
                type="number"
                min="0"
                max="999"
                value={data.propiedadIntelectualSuiGeneris}
                onChange={(e) => onChange('propiedadIntelectualSuiGeneris', parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="propiedadIntelectualSoftware">Derecho de Autor Software</Label>
              <Input
                id="propiedadIntelectualSoftware"
                type="number"
                min="0"
                max="999"
                value={data.propiedadIntelectualSoftware}
                onChange={(e) => onChange('propiedadIntelectualSoftware', parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="propiedadIntelectualObrasLiterarias">Derecho de Obras literarias</Label>
              <Input
                id="propiedadIntelectualObrasLiterarias"
                type="number"
                min="0"
                max="999"
                value={data.propiedadIntelectualObrasLiterarias}
                onChange={(e) => onChange('propiedadIntelectualObrasLiterarias', parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="propiedadIntelectualOtras">Otras</Label>
              <Input
                id="propiedadIntelectualOtras"
                type="number"
                min="0"
                max="999"
                value={data.propiedadIntelectualOtras}
                onChange={(e) => onChange('propiedadIntelectualOtras', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
