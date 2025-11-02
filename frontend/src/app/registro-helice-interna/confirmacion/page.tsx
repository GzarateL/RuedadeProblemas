"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, FileText, User, Mail, Phone, Building } from "lucide-react";
import Link from "next/link";

interface RegistroData {
  tipo: string;
  datos: any;
  fecha: string;
}

export default function ConfirmacionRegistro() {
  const [registroData, setRegistroData] = useState<RegistroData | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('registro_confirmacion');
    if (data) {
      setRegistroData(JSON.parse(data));
      // Limpiar después de leer
      localStorage.removeItem('registro_confirmacion');
    }
  }, []);

  const getTipoNombre = (tipo: string) => {
    const tipos: Record<string, string> = {
      'docente_investigador': 'Docente/Investigador',
      'grupo_centro_instituto': 'Grupo/Centro/Instituto',
      'laboratorio': 'Laboratorio',
      'centro_produccion': 'Centro de Producción'
    };
    return tipos[tipo] || tipo;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="text-center">
          <CardHeader className="pb-6">
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-gray-900">
              ¡Registro Completado y Aprobado!
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Su registro ha sido procesado exitosamente
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {registroData && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-left">
                <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-red-600" />
                  Resumen de su Registro
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Tipo de Registro</p>
                        <p className="text-base text-gray-900">{getTipoNombre(registroData.tipo)}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <User className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          {registroData.datos.nombreCompleto ? 'Nombre' : 'Entidad'}
                        </p>
                        <p className="text-base text-gray-900">
                          {registroData.datos.nombreCompleto || registroData.datos.nombreEntidad}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email Corporativo</p>
                        <p className="text-base text-gray-900">{registroData.datos.emailCorporativo}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Teléfono</p>
                        <p className="text-base text-gray-900">{registroData.datos.telefono}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-500 mb-2">Oficina/Departamento</p>
                    <p className="text-base text-gray-900">{registroData.datos.oficinaDepartamento}</p>
                  </div>

                  {registroData.datos.nivelAporte && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-500 mb-2">Nivel de Aporte</p>
                      <p className="text-base text-gray-900 capitalize">{registroData.datos.nivelAporte}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">
                ✓ Registro Aprobado Automáticamente
              </h3>
              <p className="text-sm text-green-800 text-left">
                Su registro ha sido aprobado y ya está activo en el sistema. Puede comenzar a 
                participar en el sistema de matching y colaboración inmediatamente.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">
                ¿Qué puede hacer ahora?
              </h3>
              <ul className="text-sm text-blue-800 space-y-1 text-left">
                <li>• Explorar oportunidades de colaboración en el sistema</li>
                <li>• Ver y gestionar sus registros en su perfil</li>
                <li>• Participar en el sistema de matching con empresas</li>
                <li>• Actualizar su información en cualquier momento</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button asChild variant="outline" className="flex items-center">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Ir al Inicio
                </Link>
              </Button>
              
              <Button asChild className="bg-red-600 hover:bg-red-700 flex items-center">
                <Link href="/capacidad">
                  <FileText className="h-4 w-4 mr-2" />
                  Ver Mis Registros
                </Link>
              </Button>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                ¿Tiene alguna pregunta? Contáctenos en{" "}
                <a href="mailto:soporte@unsa.edu.pe" className="text-red-600 hover:text-red-700">
                  soporte@unsa.edu.pe
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}