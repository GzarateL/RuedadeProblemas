// /frontend/src/app/agenda/page.tsx

// Reutiliza o define las interfaces aquí también
interface SesionEvento {
    sesion_id: number;
    horario_display: string;
    hora_inicio?: string | null;
    hora_fin?: string | null;
    bloque_tematico: string;
    foco_objetivos?: string | null;
    entregable_clave?: string | null;
}
interface DiaConSesiones {
    dia_id: number;
    dia_numero: number;
    nombre_dia: string;
    fecha: string;
    sesiones: SesionEvento[];
}

// Función para obtener los datos (Server Component)
async function getScheduleData(): Promise<DiaConSesiones[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cronograma`, {
            cache: 'no-store' // Para asegurar datos frescos, o ajusta el cache
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error("Failed to fetch schedule:", error);
        return []; // Devuelve array vacío en caso de error
    }
}

// Helper para formatear fecha (opcional)
function formatDate(dateString: string): string {
    try {
        const date = new Date(dateString + 'T00:00:00'); // Asegura zona horaria local
        return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    } catch {
        return dateString; // Fallback
    }
}

export default async function AgendaPage() {
    const schedule = await getScheduleData();

    return (
        <div className="min-h-screen bg-[linear-gradient(#0001_1px,transparent_1px),linear-gradient(90deg,#0001_1px,transparent_1px)] bg-[size:24px_24px] p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">Agenda del Evento</h1>
                <p className="text-xl text-gray-600 text-center mb-12">Rueda de Problemas 2025</p>

                {schedule.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                        <p className="text-gray-500">El cronograma aún no está disponible. Vuelve pronto.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {schedule.map((dia) => (
                            <div 
                                key={dia.dia_id}
                                className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-200"
                            >
                                {/* Header de la tarjeta del día */}
                                <div className="mb-4 pb-4 border-b border-gray-200">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                                        {dia.nombre_dia}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        {formatDate(dia.fecha)}
                                    </p>
                                </div>

                                {/* Sesiones del día */}
                                {dia.sesiones.length === 0 ? (
                                    <p className="text-gray-500 text-sm italic">
                                        No hay sesiones programadas para este día.
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {dia.sesiones.map((sesion) => (
                                            <div 
                                                key={sesion.sesion_id}
                                                className="border-l-4 border-red-500 pl-3 py-2"
                                            >
                                                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                                                    {sesion.bloque_tematico}
                                                </h3>
                                                <p className="text-xs text-gray-600 font-medium mb-2">
                                                    {sesion.horario_display}
                                                </p>
                                                {sesion.foco_objetivos && (
                                                    <p className="text-xs text-gray-600 mb-1">
                                                        <span className="font-medium">Foco:</span> {sesion.foco_objetivos}
                                                    </p>
                                                )}
                                                {sesion.entregable_clave && (
                                                    <p className="text-xs text-gray-600">
                                                        <span className="font-medium">Entregable:</span> {sesion.entregable_clave}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}