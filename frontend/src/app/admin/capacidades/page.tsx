// /frontend/src/app/admin/capacidades/page.tsx
"use client"; // Necesario para Hooks

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // Para leer el token
import { toast } from 'sonner'; // Para notificaciones
import CapacidadCard from './components/CapacidadCard'; // Importa la tarjeta de capacidad
import CapacidadDetailModal from './components/CapacidadDetailModal'; // Importa el modal de capacidad
import { CapacidadAdmin } from '@/types/capacidad'; // Importa el tipo de datos
import Link from 'next/link'; // Para el enlace de regreso

// Componente principal de la página
export default function AdminCapacidadesPage() {
  // --- Estados ---
  const [capacidades, setCapacidades] = useState<CapacidadAdmin[]>([]); // Array para las capacidades
  const [isLoading, setIsLoading] = useState(true); // Control de carga
  const [error, setError] = useState<string | null>(null); // Control de errores
  const [selectedCapacidad, setSelectedCapacidad] = useState<CapacidadAdmin | null>(null); // Capacidad para el modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Visibilidad del modal

  // --- Efecto para Cargar Datos ---
  useEffect(() => {
    const fetchCapacidades = async () => {
      setIsLoading(true);
      setError(null);
      const token = Cookies.get('token');

      if (!token) {
        setError("No autenticado.");
        setIsLoading(false);
        toast.error("Error de autenticación", { description: "Por favor, inicie sesión." });
        // Considera redirigir al login
        return;
      }

      try {
        // Llama al endpoint del backend para obtener TODAS las capacidades (protegido)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/admin/capacidades`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
          let errorMsg = `Error ${res.status}: No se pudieron cargar las capacidades.`;
          try {
              const errorData = await res.json();
              errorMsg = errorData.message || errorMsg;
          } catch (jsonError) {}
          throw new Error(errorMsg);
        }

        const data: CapacidadAdmin[] = await res.json();
        setCapacidades(data); // Guarda las capacidades en el estado

      } catch (err: any) {
        console.error("Error fetching capacidades:", err);
        setError(err.message);
        toast.error("Error al cargar capacidades", { description: err.message });
      } finally {
        setIsLoading(false); // Finaliza la carga
      }
    };

    fetchCapacidades(); // Llama a la función al montar
  }, []); // Se ejecuta solo una vez

  // --- Handlers del Modal ---

  // Abre el modal con la capacidad seleccionada
  const handleViewDetails = (capacidad: CapacidadAdmin) => {
    setSelectedCapacidad(capacidad);
    setIsModalOpen(true);
  };

  // Cierra el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCapacidad(null);
  };

  // Handler para editar capacidad
  const handleEdit = (capacidad: CapacidadAdmin) => {
    // TODO: Implementar lógica de edición
    const nombre = capacidad.tipo_registro === 'docente_investigador' 
      ? capacidad.nombre_completo 
      : capacidad.nombre;
    toast.info("Editar capacidad", { 
      description: `Editando: ${nombre}` 
    });
    console.log("Editar capacidad:", capacidad);
  };

  // Handler para aprobar capacidad
  const handleAprobar = async (capacidad: CapacidadAdmin) => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error("No autenticado");
      return;
    }

    const nombre = capacidad.tipo_registro === 'docente_investigador' 
      ? capacidad.nombre_completo 
      : capacidad.nombre;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/admin/registros/${capacidad.registro_id}/aprobar-rechazar`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            tipo: capacidad.tipo_registro,
            estado: 'aprobado'
          })
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al aprobar la capacidad');
      }

      toast.success("Capacidad aprobada", { 
        description: `${nombre} ha sido aprobada exitosamente` 
      });

      // Actualizar el estado local
      setCapacidades(prev => 
        prev.map(cap => 
          cap.registro_id === capacidad.registro_id && cap.tipo_registro === capacidad.tipo_registro
            ? { ...cap, estado: 'aprobado' }
            : cap
        )
      );
    } catch (err: any) {
      console.error("Error al aprobar:", err);
      toast.error("Error al aprobar", { description: err.message });
    }
  };

  // Handler para rechazar capacidad
  const handleRechazar = async (capacidad: CapacidadAdmin) => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error("No autenticado");
      return;
    }

    const nombre = capacidad.tipo_registro === 'docente_investigador' 
      ? capacidad.nombre_completo 
      : capacidad.nombre;

    const observaciones = prompt("Ingrese el motivo del rechazo (opcional):");
    if (observaciones === null) {
      // Usuario canceló el prompt
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/admin/registros/${capacidad.registro_id}/aprobar-rechazar`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            tipo: capacidad.tipo_registro,
            estado: 'rechazado',
            observaciones: observaciones || undefined
          })
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al rechazar la capacidad');
      }

      toast.success("Capacidad rechazada", { 
        description: `${nombre} ha sido rechazada` 
      });

      // Actualizar el estado local
      setCapacidades(prev => 
        prev.map(cap => 
          cap.registro_id === capacidad.registro_id && cap.tipo_registro === capacidad.tipo_registro
            ? { ...cap, estado: 'rechazado' }
            : cap
        )
      );
    } catch (err: any) {
      console.error("Error al rechazar:", err);
      toast.error("Error al rechazar", { description: err.message });
    }
  };

  // Separar capacidades por estado
  const capacidadesPendientes = capacidades.filter(
    cap => cap.estado === 'completado' || cap.estado === 'borrador' || cap.estado === 'en_revision'
  );
  const capacidadesAprobadas = capacidades.filter(
    cap => cap.estado === 'aprobado'
  );

  // --- Renderizado ---

  if (isLoading) return <p className="p-6 text-center text-neutral-600 animate-pulse">Cargando capacidades...</p>;
  if (error) return <p className="p-6 text-center text-red-600">⚠️ Error al cargar: {error}</p>;

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Capacidades UNSA Registradas</h1>
      </div>

      {/* Mensaje si no hay capacidades */}
      {capacidades.length === 0 ? (
        <div className="border rounded-lg p-10 text-center bg-gray-50 mt-4">
          <p className="text-neutral-500">Aún no se han registrado capacidades.</p>
        </div>
      ) : (
        <>
          {/* SECCIÓN 1: CAPACIDADES PENDIENTES DE APROBACIÓN */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-neutral-800">
                Pendientes de Aprobación
              </h2>
              <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                {capacidadesPendientes.length}
              </span>
            </div>

            {capacidadesPendientes.length === 0 ? (
              <div className="border border-dashed rounded-lg p-8 text-center bg-gray-50">
                <p className="text-neutral-500">No hay capacidades pendientes de aprobación.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {capacidadesPendientes.map((capacidad) => (
                  <CapacidadCard
                    key={`${capacidad.tipo_registro}-${capacidad.registro_id}`}
                    capacidad={capacidad}
                    onViewDetails={() => handleViewDetails(capacidad)}
                    onEdit={() => handleEdit(capacidad)}
                    onAprobar={() => handleAprobar(capacidad)}
                    onRechazar={() => handleRechazar(capacidad)}
                    showApprovalButtons={true}
                  />
                ))}
              </div>
            )}
          </div>

          {/* SECCIÓN 2: CAPACIDADES APROBADAS */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-neutral-800">
                Capacidades Aprobadas
              </h2>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                {capacidadesAprobadas.length}
              </span>
            </div>

            {capacidadesAprobadas.length === 0 ? (
              <div className="border border-dashed rounded-lg p-8 text-center bg-gray-50">
                <p className="text-neutral-500">No hay capacidades aprobadas aún.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {capacidadesAprobadas.map((capacidad) => (
                  <CapacidadCard
                    key={`${capacidad.tipo_registro}-${capacidad.registro_id}`}
                    capacidad={capacidad}
                    onViewDetails={() => handleViewDetails(capacidad)}
                    onEdit={() => handleEdit(capacidad)}
                    showApprovalButtons={false}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* El Modal (solo se renderiza si hay una capacidad seleccionada) */}
      {selectedCapacidad && (
        <CapacidadDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          capacidad={selectedCapacidad}
        />
      )}

      {/* Enlace opcional para volver */}
      <div className="pt-4">
        <Link href="/admin/dashboard" className="text-sm text-blue-600 hover:underline">
          ← Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}