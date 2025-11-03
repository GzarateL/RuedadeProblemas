// /frontend/src/app/admin/capacidades/components/CapacidadDetailModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CapacidadAdmin } from '@/types/capacidad';

interface CapacidadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  capacidad: CapacidadAdmin;
}

export default function CapacidadDetailModal({ isOpen, onClose, capacidad }: CapacidadDetailModalProps) {
  const tipoLabels: Record<string, string> = {
    'docente_investigador': 'Docente Investigador',
    'grupo_centro_instituto': 'Grupo/Centro/Instituto',
    'laboratorio': 'Laboratorio',
    'centro_produccion': 'Centro de Producción'
  };

  const getNombre = () => {
    if (capacidad.tipo_registro === 'docente_investigador') {
      return capacidad.nombre_completo || 'Sin nombre';
    }
    return capacidad.nombre || 'Sin nombre';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-4">
          <DialogTitle className="text-xl font-bold">{getNombre()}</DialogTitle>
          <DialogDescription className="text-sm text-neutral-600 pt-1">
            Tipo: {tipoLabels[capacidad.tipo_registro]} | Estado: {capacidad.estado}
            <br />
            Email: {capacidad.email} | Teléfono: {capacidad.telefono}
          </DialogDescription>
        </DialogHeader>

        {/* Cuerpo del Modal con scroll */}
        <div className="py-4 space-y-4 text-sm overflow-y-auto flex-grow pr-2">

          {/* Información Básica */}
          <div>
            <h4 className="font-semibold mb-2 text-neutral-800">Información Básica:</h4>
            <div className="space-y-1 text-neutral-700">
              {capacidad.programa_estudio && (
                <p><span className="font-medium">Programa de Estudio:</span> {capacidad.programa_estudio}</p>
              )}
              {capacidad.oficina_departamento_vinculado && (
                <p><span className="font-medium">Departamento:</span> {capacidad.oficina_departamento_vinculado}</p>
              )}
              {capacidad.nombre_completo_responsable && (
                <p><span className="font-medium">Responsable:</span> {capacidad.nombre_completo_responsable}</p>
              )}
            </div>
          </div>

          {/* Palabras Clave */}
          {capacidad.keywords.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 text-neutral-800">Palabras Clave:</h4>
              <div className="flex flex-wrap gap-2">
                {capacidad.keywords.map((kw) => (
                  <Badge key={kw.id} variant="secondary" className="text-xs">
                    {kw.keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* OCDE */}
          {capacidad.ocde.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 text-neutral-800">Áreas OCDE:</h4>
              <div className="space-y-2">
                {capacidad.ocde.map((item, index) => (
                  <div key={index} className="text-neutral-700 text-xs bg-gray-50 p-2 rounded">
                    <p><span className="font-medium">Área:</span> {item.area_nombre}</p>
                    {item.sub_area_nombre && (
                      <p><span className="font-medium">Sub-área:</span> {item.sub_area_nombre}</p>
                    )}
                    {item.disciplina_nombre && (
                      <p><span className="font-medium">Disciplina:</span> {item.disciplina_nombre}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ODS */}
          {capacidad.ods.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 text-neutral-800">Objetivos de Desarrollo Sostenible (ODS):</h4>
              <div className="space-y-2">
                {capacidad.ods.map((item, index) => (
                  <div key={index} className="text-neutral-700 text-xs bg-blue-50 p-2 rounded">
                    <p><span className="font-medium">ODS {item.objetivo_id}:</span> {item.objetivo_nombre}</p>
                    {item.meta_codigo && (
                      <p><span className="font-medium">Meta {item.meta_codigo}:</span> {item.meta_descripcion}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Soluciones */}
          {capacidad.soluciones.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 text-neutral-800">Soluciones Propuestas:</h4>
              <div className="space-y-3">
                {capacidad.soluciones.map((sol, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-3 py-1">
                    <p className="font-medium text-neutral-800">{sol.titulo}</p>
                    <p className="text-xs text-neutral-600 mt-1"><span className="font-medium">Problema:</span> {sol.problema}</p>
                    <p className="text-xs text-neutral-600 mt-1"><span className="font-medium">Solución:</span> {sol.solucion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Pie del Modal */}
        <DialogFooter className="flex-shrink-0 pt-4 border-t">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}