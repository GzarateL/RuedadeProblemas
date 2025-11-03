// /frontend/src/app/admin/capacidades/components/CapacidadCard.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CapacidadAdmin } from '@/types/capacidad'; // Importa el tipo que acabamos de crear
import { Pencil } from 'lucide-react';

interface CapacidadCardProps {
  capacidad: CapacidadAdmin;
  onViewDetails: () => void; // Función para abrir el modal
  onEdit?: () => void; // Función para editar la capacidad
  onAprobar?: () => void; // Función para aprobar la capacidad
  onRechazar?: () => void; // Función para rechazar la capacidad
  showApprovalButtons?: boolean; // Mostrar botones de aprobación/rechazo
}

export default function CapacidadCard({ 
  capacidad, 
  onViewDetails, 
  onEdit, 
  onAprobar, 
  onRechazar, 
  showApprovalButtons = false 
}: CapacidadCardProps) {
  // Obtener el nombre a mostrar según el tipo
  const getNombre = () => {
    if (capacidad.tipo_registro === 'docente_investigador') {
      return capacidad.nombre_completo || 'Sin nombre';
    }
    return capacidad.nombre || 'Sin nombre';
  };

  // Mapeo de tipos a etiquetas legibles
  const tipoLabels: Record<string, string> = {
    'docente_investigador': 'Docente Investigador',
    'grupo_centro_instituto': 'Grupo/Centro/Instituto',
    'laboratorio': 'Laboratorio',
    'centro_produccion': 'Centro de Producción'
  };

  const nombre = getNombre();
  const maxLength = 60;
  const truncatedNombre = nombre.length > maxLength ? nombre.substring(0, maxLength) + "..." : nombre;

  return (
    <Card className="flex flex-col h-full overflow-hidden border border-gray-300 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out relative group">
      <CardHeader className="pb-2 px-5 pt-5">
        {/* Botón de edición en la esquina superior derecha */}
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
            aria-label="Editar capacidad"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
        {/* Título: Nombre del perfil */}
        <CardTitle className="text-base font-semibold line-clamp-2 h-[48px]">
          {truncatedNombre}
        </CardTitle>
        {/* Descripción: Tipo de registro */}
        <CardDescription className="text-xs text-gray-500 pt-1">
          {tipoLabels[capacidad.tipo_registro]}
        </CardDescription>
      </CardHeader>

      {/* CardContent: Información adicional */}
      <CardContent className="flex-grow pt-1 pb-3 px-5">
        <div className="text-xs text-gray-600 space-y-1">
          <p><span className="font-medium">Email:</span> {capacidad.email}</p>
          {capacidad.programa_estudio && (
            <p><span className="font-medium">Programa:</span> {capacidad.programa_estudio}</p>
          )}
          {capacidad.oficina_departamento_vinculado && (
            <p><span className="font-medium">Departamento:</span> {capacidad.oficina_departamento_vinculado}</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4 px-5 flex flex-col gap-3">
        {/* Palabras Clave */}
        <div className="flex flex-wrap gap-1">
          {capacidad.keywords.slice(0, 2).map((kw, index) => (
            <Badge key={index} variant="outline" className="text-[10px] px-2.5 py-0.5 font-medium border-gray-400 rounded-full bg-white text-gray-700">
              {kw.keyword}
            </Badge>
          ))}
          {capacidad.keywords.length > 2 && (
            <Badge variant="outline" className="text-[10px] px-2.5 py-0.5 font-medium border-gray-400 rounded-full bg-white text-gray-700">
              +{capacidad.keywords.length - 2}
            </Badge>
          )}
        </div>

        {/* Botones de acción */}
        {showApprovalButtons ? (
          <div className="flex gap-2 w-full">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAprobar?.();
              }}
              className="flex-1 h-8 text-xs bg-green-600 text-white hover:bg-green-700 rounded-md"
            >
              ✓ Aprobar
            </Button>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRechazar?.();
              }}
              className="flex-1 h-8 text-xs bg-red-600 text-white hover:bg-red-700 rounded-md"
            >
              ✗ Rechazar
            </Button>
          </div>
        ) : null}

        {/* Botón Ver Detalles */}
        <Button
          size="sm"
          onClick={onViewDetails}
          className="w-full h-7 px-4 text-xs bg-black text-white hover:bg-gray-800 rounded-full"
        >
          VER CAPACIDAD
        </Button>
      </CardFooter>
    </Card>
  );
}