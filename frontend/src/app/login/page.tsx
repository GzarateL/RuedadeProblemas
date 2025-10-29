"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RainEffect } from "@/components/RainDrop";

const formSchema = z.object({
  email: z.string().min(1, { message: "El correo es requerido." }),
  password: z.string().min(1, { message: "La contraseña es requerida." }),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error al iniciar sesión.");
      }
      login(data.user, data.token);
      toast.success("¡Bienvenido!", { description: "Has iniciado sesión correctamente." });

      // Redirigir según el rol
      if (data.user.rol === 'admin') {
        router.push("/admin/dashboard");
      } else {
        // (Aquí irán los dashboards de 'externo' y 'unsa')
        router.push("/"); // Por ahora al inicio
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al iniciar sesión.";
      toast.error("Error en el login", { description: message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 to-white px-4 py-12 overflow-hidden">
      {/* Animación de gotas cayendo */}
      <RainEffect />

      <Card
        className={`relative z-10 w-full max-w-lg border border-slate-200 shadow-2xl transform transition-all duration-500 ease-out ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
      >
        <div className="flex flex-col bg-white p-8 sm:p-10">
          <CardContent className="p-0">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>
                  {error === "unauthorized" && "No tiene permisos para acceder a esa página."}
                  {error === "session_expired" && "Tu sesión ha expirado. Por favor, inicia sesión de nuevo."}
                </AlertDescription>
              </Alert>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div
                  className={`space-y-10 text-center pb-3 transform transition-all duration-700 ease-out ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
                    }`}
                  style={{ transitionDelay: "120ms" }}
                >
                  <CardTitle className="text-3xl font-semibold text-slate-900">Iniciar sesión</CardTitle>
                  <CardDescription className="text-sm text-slate-500">
                    Ingresa tus credenciales institucionales para continuar con tu trabajo.
                  </CardDescription>
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <div
                      className={`transform transition-all duration-700 ease-out ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                        }`}
                      style={{ transitionDelay: "220ms" }}
                    >
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">Correo o usuario</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            autoComplete="email"
                            placeholder="ejemplo@unsa.edu.pe"
                            className="h-11 rounded-lg border-slate-200 bg-slate-50 text-sm transform transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm focus:-translate-y-0.5 focus:border-emerald-500 focus:bg-white focus:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-200/90"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <div
                      className={`transform transition-all duration-700 ease-out ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                        }`}
                      style={{ transitionDelay: "320ms" }}
                    >
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">Contraseña</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="current-password"
                            placeholder="Ingresa tu contraseña"
                            className="h-11 rounded-lg border-slate-200 bg-slate-50 text-sm transform transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm focus:-translate-y-0.5 focus:border-emerald-500 focus:bg-white focus:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-200/90"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </div>
                  )}
                />
                <div
                  className={`transform transition-all duration-700 ease-out ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}
                  style={{ transitionDelay: "420ms" }}
                >
                  <Button
                    type="submit"
                    className="w-full h-12 mt-4 transform transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#d80c0d] hover:shadow-md active:translate-y-0"
                    disabled={isLoading}
                  >
                    {isLoading ? "Ingresando..." : "Ingresar"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}