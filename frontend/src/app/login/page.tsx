"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BouncingBall } from "@/components/BouncingBall";
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
  const { login } = useAuth();

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
    <div className="relative min-h-screen flex items-center justify-center bg-white p-4 overflow-hidden">
      {/* Animación de gotas cayendo */}
      <RainEffect />
      
      <div className="w-full max-w-md relative z-10">
        <div className="relative">
          {/* Borde neón exterior */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: "linear-gradient(45deg, hsl(350 100% 50%), hsl(350 100% 40%))",
              filter: "blur(2px)",
              boxShadow: "var(--neon-glow-strong)",
            }}
          />

          {/* Tarjeta con animación */}
          <div
            className="relative bg-white border-2 border-[#FF0033] rounded-2xl overflow-hidden"
            style={{ boxShadow: "var(--neon-glow)" }}
          >
            {/* Canvas abarca toda la tarjeta */}
            <BouncingBall />

            {/* Formulario */}
            <div className="p-8 space-y-6 relative z-10">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>
                    {error === "unauthorized" && "No tiene permisos para acceder a esa página."}
                    {error === "session_expired" && "Tu sesión ha expirado. Por favor, inicia sesión de nuevo."}
                  </AlertDescription>
                </Alert>
              )}

              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h1>
                <p className="text-gray-600">Ingresa tus credenciales</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-medium">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="tu@email.com"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-medium">Contraseña</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <button
                    type="submit"
                    className="w-full bg-electric text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:bg-white hover:text-electric focus:bg-white focus:text-electric hover:drop-shadow-[0_0_12px_hsl(0,100%,60%)] focus:drop-shadow-[0_0_12px_hsl(0,100%,60%)]"
                    disabled={isLoading}
                  >
                    {isLoading ? "Ingresando..." : "Entrar"}
                  </button>
                </form>
              </Form>

              <div className="text-center">
                <a
                  href="#"
                  className="text-sm text-[#FF0033] hover:text-[#FF3366] transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}