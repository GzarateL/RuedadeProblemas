"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import FormularioEditarDesafio from "./components/FormularioEditarDesafio";

export default function EditarDesafioPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const desafioId = params.id as string;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?error=unauthorized");
    } else if (!isLoading && user && user.rol !== 'externo') {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.rol !== 'externo') {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-theme(space.16))]">
        <p>Cargando...</p>
      </div>
    );
  }

  return <FormularioEditarDesafio desafioId={desafioId} />;
}
