// /frontend/src/app/admin/desafios/components/DesafioCard.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Ya deberías tenerlo instalado
import { DesafioAdmin } from '@/types/desafio';

interface DesafioCardProps {
  desafio: DesafioAdmin;
  onViewDetails: () => void;
}

export default function DesafioCard({ desafio, onViewDetails }: DesafioCardProps) {
  // Truncamiento
  const maxDescLength = 80;
  const truncatedDesc = desafio.descripcion && desafio.descripcion.length > maxDescLength
    ? desafio.descripcion.substring(0, maxDescLength) + "..."
    : desafio.descripcion;
  const needsSeeMore = desafio.descripcion && desafio.descripcion.length > maxDescLength;

  // Mapeo de impacto a etiquetas legibles
  const impactoLabels: Record<string, string> = {
    'microlocal': 'Microlocal',
    'local': 'Local',
    'distrital': 'Distrital',
    'provincial': 'Provincial',
    'regional': 'Regional'
  };

  return (
    // Card: Añadimos bordes más redondeados (rounded-xl)
    <Card className="flex flex-col h-full overflow-hidden border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"> {/* Más redondeado */}

      {/* CardHeader: Más padding */}
      <CardHeader className="pb-2 px-5 pt-5"> {/* Aumenta padding */}
        {/* CardTitle: Texto más grande y bold */}
        <CardTitle className="text-xl font-bold line-clamp-2 mb-1"> {/* Tamaño xl, bold */}
            {desafio.titulo}
        </CardTitle>
        {/* CardDescription: Texto más pequeño y gris */}
        <CardDescription className="text-xs text-gray-500 line-clamp-2 h-[36px]"> {/* Tamaño xs, gris, limita a 2 líneas */}
          {truncatedDesc || "Sin descripción detallada."}
        </CardDescription>
      </CardHeader>

      {/* CardContent: Lo usamos solo si hay "Ver más" o necesita espacio extra */}
      <CardContent className="flex-grow pt-2 pb-3 px-5">
         {/* Si la descripción es larga y necesita "Ver más", lo ponemos aquí */}
         {needsSeeMore && (
              <Button variant="link" size="sm" onClick={onViewDetails} className="text-xs px-0 py-0 h-auto text-blue-600 hover:text-blue-800 -mt-1">
                Leer descripción completa...
              </Button>
         )}
      </CardContent>

      {/* CardFooter: Contiene impacto y botón */}
      <CardFooter className="pt-0 pb-4 px-5 flex justify-between items-center">
         {/* Contenedor para el impacto y organización */}
         <div className="flex flex-col gap-1">
            <Badge variant="outline" className="text-[10px] px-2.5 py-0.5 font-medium border-gray-400 rounded-full bg-white text-gray-700 w-fit">
              {impactoLabels[desafio.impacto] || desafio.impacto}
            </Badge>
            {desafio.nombre_organizacion && (
              <span className="text-[10px] text-gray-600 truncate max-w-[150px]">
                {desafio.nombre_organizacion}
              </span>
            )}
         </div>

         {/* Botón "Ver Desafío" */}
         <Button
            size="sm"
            onClick={onViewDetails}
            // Estilo píldora negra con texto blanco
            className="h-7 px-4 text-xs bg-black text-white hover:bg-gray-800 rounded-full"
          >
            VER DESAFÍO
         </Button>
      </CardFooter>
    </Card>
  );
}