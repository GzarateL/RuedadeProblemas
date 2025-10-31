"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import FormularioEditarCapacidad from "./components/FormularioEditarCapacidad";

export default function EditarCapacidadPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const capacidadId = params.id as string;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?error=unauthorized");
    } else if (!isLoading && user && user.rol !== 'unsa') {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.rol !== 'unsa') {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-theme(space.16))]">
        <p>Cargando...</p>
      </div>
    );
  }

  return <FormularioEditarCapacidad capacidadId={capacidadId} />;
}
