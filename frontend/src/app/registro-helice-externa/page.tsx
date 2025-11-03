"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function RegistroHeliceExternaPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const tiposRegistro = [
    {
      id: 'gobierno',
      titulo: 'Gobierno',
      descripcion: 'Registro para entidades públicas (central, regional, provincial, distrital)',
      disponible: true
    },
    {
      id: 'colegio_profesional',
      titulo: 'Colegio Profesional',
      descripcion: 'Registro para colegios profesionales',
      disponible: true
    },
    {
      id: 'empresa',
      titulo: 'Empresa',
      descripcion: 'Registro para empresas (persona natural con negocio o persona jurídica)',
      disponible: true
    },
    {
      id: 'sociedad_civil',
      titulo: 'Sociedad Civil',
      descripcion: 'Registro para organizaciones de la sociedad civil',
      disponible: true
    }
  ];

  const handleContinuar = () => {
    if (selectedType) {
      if (!user) {
        localStorage.setItem('registro_helice_tipo', selectedType);
        router.push('/login?redirect=/registro-helice-externa&message=Debe iniciar sesión para continuar con el registro');
      } else if (user.rol !== 'externo') {
        alert('Solo los usuarios externos pueden registrarse en la hélice externa');
      } else {
        router.push(`/registro-helice-externa/${selectedType}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Registro Hélice Externa
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Seleccione el tipo de registro que desea realizar para formar parte de la hélice externa
          </p>

          {!user && (
            <div className="mt-6 max-w-2xl mx-auto p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>IMPORTANTE:</strong> Necesita tener una cuenta e iniciar sesión para completar el registro.
                Si no tiene cuenta, será redirigido para crear una.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {tiposRegistro.map((tipo) => (
            <Card
              key={tipo.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedType === tipo.id
                  ? 'ring-2 ring-red-500 border-red-500'
                  : 'border-gray-200 hover:border-gray-300'
              } ${!tipo.disponible ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => tipo.disponible && setSelectedType(tipo.id)}
            >
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{tipo.titulo}</CardTitle>
                <CardDescription className="text-sm">
                  {tipo.descripcion}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                {!tipo.disponible && (
                  <span className="text-sm text-gray-500 italic">
                    Próximamente disponible
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/">Cancelar</Link>
          </Button>
          <Button
            onClick={handleContinuar}
            disabled={!selectedType}
            className="bg-red-600 hover:bg-red-700"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
