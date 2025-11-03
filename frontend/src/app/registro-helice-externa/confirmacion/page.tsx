"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ConfirmacionHeliceExternaPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-20 h-20 text-green-500" />
            </div>
            <CardTitle className="text-3xl">¡Registro Completado!</CardTitle>
            <CardDescription className="text-lg mt-2">
              Su registro en la hélice externa ha sido completado exitosamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">¿Qué sigue?</h3>
              <ul className="text-left space-y-2 text-gray-700">
                <li>• Su registro en la hélice externa ha sido completado</li>
                <li>• Ahora puede registrar desafíos desde su panel</li>
                <li>• El sistema buscará coincidencias con capacidades de la hélice interna</li>
                <li>• Recibirá notificaciones cuando haya matches disponibles</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/desafio/registrar">Registrar un Desafío</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Ir al Inicio</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
