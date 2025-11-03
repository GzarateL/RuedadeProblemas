// /frontend/src/app/admin/desafios/components/DesafioDetailModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"; // Componentes del modal de Shadcn UI
import { Button } from "@/components/ui/button"; // Botón
import { Badge } from "@/components/ui/badge"; // Etiquetas
import { DesafioAdmin } from '@/types/desafio'; // Tipo de datos del desafío

// Propiedades que recibe el modal
interface DesafioDetailModalProps {
  isOpen: boolean;        // Indica si el modal está abierto o cerrado
  onClose: () => void;     // Función para cerrar el modal
  desafio: DesafioAdmin; // Los datos completos del desafío a mostrar
}

// Función auxiliar para formatear la fecha y hora
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    // Formato español con día, mes, año, hora y minutos
    return date.toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true // O hour12: false para formato 24h
    });
  } catch (e) {
    console.error("Error formateando fecha:", e);
    return dateString; // Devuelve el original si hay error
  }
};

export default function DesafioDetailModal({ isOpen, onClose, desafio }: DesafioDetailModalProps) {
    // Mapeo de impacto a etiquetas legibles
    const impactoLabels: Record<string, string> = {
      'microlocal': 'Microlocal',
      'local': 'Local',
      'distrital': 'Distrital',
      'provincial': 'Provincial',
      'regional': 'Regional'
    };

    // Mapeo de tipo de participante a etiquetas legibles
    const tipoParticipanteLabels: Record<string, string> = {
      'empresa': 'Empresa',
      'gobierno': 'Gobierno',
      'sociedad_civil': 'Sociedad Civil',
      'colegio_profesional': 'Colegio Profesional'
    };

  return (
    // Componente Dialog principal, controla su estado con 'open' y 'onOpenChange'
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* DialogContent es el contenedor visible del modal */}
      {/* Clases para tamaño, altura máxima y scroll interno si el contenido excede */}
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] flex flex-col">

        {/* DialogHeader: Cabecera del modal */}
        <DialogHeader className="flex-shrink-0 border-b pb-4"> {/* Borde inferior */}
          <DialogTitle className="text-xl font-bold">{desafio.titulo}</DialogTitle>
          <DialogDescription className="text-sm text-neutral-600 pt-1">
            {/* Muestra información adicional del registrante y fecha */}
            Registrado por: {desafio.nombre || 'N/A'} ({desafio.email || 'N/A'})
            <br />
            Organización: {desafio.nombre_organizacion || 'N/A'} | 
            Tipo: {desafio.tipo_participante ? tipoParticipanteLabels[desafio.tipo_participante] || desafio.tipo_participante : 'N/A'}
            <br />
            Fecha: {formatDate(desafio.fecha_creacion)}
          </DialogDescription>
        </DialogHeader>

        {/* Cuerpo del Modal: Contenido principal con scroll */}
        {/* overflow-y-auto habilita el scroll vertical si es necesario */}
        {/* flex-grow hace que esta sección ocupe el espacio disponible */}
        <div className="py-4 space-y-4 text-sm overflow-y-auto flex-grow pr-2"> {/* Padding y espacio para scrollbar */}

          {/* Sección Descripción */}
          <div>
            <h4 className="font-semibold mb-1 text-neutral-800">Descripción Detallada:</h4>
            {/* whitespace-pre-wrap respeta los saltos de línea del texto original */}
            <p className="text-neutral-700 whitespace-pre-wrap">{desafio.descripcion || "No proporcionada."}</p>
          </div>

          {/* Sección Impacto */}
          <div>
            <h4 className="font-semibold mb-1 text-neutral-800">Nivel de Impacto:</h4>
            <Badge variant="secondary" className="text-xs">
              {impactoLabels[desafio.impacto] || desafio.impacto}
            </Badge>
          </div>

          {/* Sección Intentos Previos */}
          {desafio.intentos_previos && (
            <div>
              <h4 className="font-semibold mb-1 text-neutral-800">Intentos Previos:</h4>
              <p className="text-neutral-700 whitespace-pre-wrap">{desafio.intentos_previos}</p>
            </div>
          )}

        </div> {/* Fin del cuerpo scrollable */}

        {/* Pie del Modal */}
        <DialogFooter className="flex-shrink-0 pt-4 border-t"> {/* Borde superior */}
          {/* DialogClose envuelve el botón para que cierre el modal al hacer clic */}
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