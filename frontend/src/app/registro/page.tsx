"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Building, Users, ArrowRight } from "lucide-react";

export default function SeleccionHelicePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [selectedHelice, setSelectedHelice] = useState<string>("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const tiposHelice = [
    {
      id: 'interna',
      titulo: 'Hélice Interna',
      descripcion: 'Registro para miembros de la UNSA: docentes, investigadores, grupos, centros, institutos, laboratorios y centros de producción',
      icono: <Building className="h-12 w-12 text-blue-600" />,
      disponible: true,
      ruta: '/registro-helice-interna',
      color: 'border-blue-500 hover:border-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      textColor: 'text-blue-900',
      subtitulos: [
        'Docentes e Investigadores',
        'Grupos de Investigación',
        'Centros e Institutos',
        'Laboratorios',
        'Centros de Producción'
      ]
    },
    {
      id: 'externa',
      titulo: 'Hélice Externa',
      descripcion: 'Registro para actores externos: empresas, gobierno, sociedad civil y organizaciones que presentan desafíos',
      icono: <Users className="h-12 w-12 text-green-600" />,
      disponible: true,
      ruta: '/desafio/registrar',
      color: 'border-green-500 hover:border-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      textColor: 'text-green-900',
      subtitulos: [
        'Empresas y Corporaciones',
        'Entidades Gubernamentales',
        'Organizaciones de Sociedad Civil',
        'Instituciones Públicas'
      ]
    }
  ];

  const handleContinuar = (ruta: string) => {
    // Permitir acceso a la selección de sub-roles sin autenticación
    router.push(ruta);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Seleccione su Tipo de Registro
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            La Rueda de Problemas conecta dos hélices: la interna (UNSA) y la externa (actores del ecosistema).
            Seleccione el tipo de registro que corresponde a su perfil.
          </p>
          {!user && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Nota:</strong> Necesitará iniciar sesión para completar el registro. 
                Si no tiene cuenta, puede crearla durante el proceso.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {tiposHelice.map((helice) => (
            <Card
              key={helice.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${selectedHelice === helice.id
                ? `ring-2 ring-offset-2 ${helice.color.replace('border-', 'ring-').replace('hover:', '')}`
                : 'border-gray-200 hover:border-gray-300'
                }`}
              onClick={() => setSelectedHelice(helice.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto mb-4 p-4 rounded-full ${helice.bgColor}`}>
                  {helice.icono}
                </div>
                <CardTitle className="text-2xl mb-2">{helice.titulo}</CardTitle>
                <CardDescription className="text-base">
                  {helice.descripcion}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <h4 className={`font-semibold ${helice.textColor}`}>
                    Incluye:
                  </h4>
                  <ul className="space-y-2">
                    {helice.subtitulos.map((subtitulo, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <div className={`w-2 h-2 rounded-full mr-3 ${helice.bgColor.replace('bg-', 'bg-').replace('hover:bg-', 'bg-')}`}></div>
                        {subtitulo}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => handleContinuar(helice.ruta)}
                  className={`w-full mt-6 ${helice.id === 'interna'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                  {user ? `Continuar con ${helice.titulo}` : `Iniciar Registro - ${helice.titulo}`}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Información adicional */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                ¿Cómo funciona la Rueda de Problemas?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
                <div>
                  <h4 className="font-medium mb-2">Hélice Interna (UNSA)</h4>
                  <p>
                    Los miembros de la universidad registran sus capacidades, expertise y soluciones
                    que pueden ofrecer para abordar problemas reales del entorno.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Hélice Externa (Ecosistema)</h4>
                  <p>
                    Los actores externos presentan sus desafíos y problemas que requieren
                    soluciones innovadoras y conocimiento especializado.
                  </p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>El matching automático</strong> conecta las capacidades internas con los desafíos externos,
                  facilitando la colaboración y el desarrollo de proyectos de I+D+i+e.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/">
              Volver al Inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}