"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { BouncingBall } from "@/components/BouncingBall";
import { RainEffect } from "@/components/RainDrop";

export default function RegistroUsuarioPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombres_apellidos: '',
    rol: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirme su contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.nombres_apellidos.trim()) {
      newErrors.nombres_apellidos = 'Los nombres y apellidos son obligatorios';
    }

    if (!formData.rol) {
      newErrors.rol = 'Debe seleccionar un tipo de usuario';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nombres_apellidos: formData.nombres_apellidos,
          rol: formData.rol
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registro exitoso, hacer auto-login
        toast.success('¡Cuenta creada!', { description: 'Iniciando sesión automáticamente...' });

        // Hacer login automático
        const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          }),
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok) {
          login(loginData.user, loginData.token);
          toast.success('¡Bienvenido!', { description: 'Registro completado exitosamente.' });

          // Redirigir según el rol
          if (loginData.user.rol === 'interno') {
            router.push('/registro-helice-interna');
          } else if (loginData.user.rol === 'externo') {
            router.push('/desafio/registrar');
          } else {
            router.push('/');
          }
        } else {
          // Si falla el auto-login, redirigir al login manual
          router.push('/login?message=Registro exitoso. Inicie sesión con sus credenciales.');
        }
      } else {
        // Error del servidor
        setErrors({ submit: data.message || 'Error al registrar usuario' });
        toast.error('Error en el registro', { description: data.message || 'Error al registrar usuario' });
      }
    } catch (error) {
      setErrors({ submit: 'Error de conexión. Intente nuevamente.' });
      toast.error('Error de conexión', { description: 'Intente nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white p-4 overflow-hidden">
      {/* Animación de gotas cayendo */}
      <RainEffect />

      <div className="w-full max-w-md relative z-10 animate-[fadeInScale_0.35s_ease-out_forwards] opacity-0">
        <div className="relative bg-white border-2 border-black rounded-2xl overflow-hidden transition-[border-color] duration-300 group">
          {/* Canvas abarca toda la tarjeta */}
          <BouncingBall />

          {/* Formulario */}
          <div className="p-8 space-y-6 relative z-10">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Crear Cuenta</h1>
              <p className="text-gray-600">Regístrese para acceder a la Rueda de Problemas</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nombres_apellidos" className="text-gray-900 font-medium">Nombres y Apellidos *</Label>
                <Input
                  id="nombres_apellidos"
                  type="text"
                  value={formData.nombres_apellidos}
                  onChange={(e) => handleInputChange('nombres_apellidos', e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none ${errors.nombres_apellidos ? 'border-red-500' : ''}`}
                  placeholder="Ingrese sus nombres y apellidos"
                />
                {errors.nombres_apellidos && (
                  <p className="text-red-500 text-sm mt-1">{errors.nombres_apellidos}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-900 font-medium">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="ejemplo@correo.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="rol" className="text-gray-900 font-medium">Tipo de Usuario *</Label>
                <Select value={formData.rol} onValueChange={(value) => handleInputChange('rol', value)}>
                  <SelectTrigger className={`w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none ${errors.rol ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Seleccione su tipo de usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interno">Hélice Interna (Docente/Investigador)</SelectItem>
                    <SelectItem value="externo">Hélice Externa (Empresa/Gobierno/Sociedad Civil)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.rol && (
                  <p className="text-red-500 text-sm mt-1">{errors.rol}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-900 font-medium">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-gray-900 font-medium">Confirmar Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20 outline-none pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="Repita su contraseña"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-white border-2 border-black text-black font-semibold py-3 rounded-lg transition-colors duration-300 hover:bg-electric hover:border-electric hover:text-white group-hover:[&~*]:!border-[#FF0000]"
                disabled={isLoading}
                onMouseEnter={(e) => {
                  const card = e.currentTarget.closest('.group');
                  if (card) card.classList.add('!border-[#FF0000]');
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget.closest('.group');
                  if (card) card.classList.remove('!border-[#FF0000]');
                }}
              >
                {isLoading ? 'Registrando...' : 'Crear Cuenta'}
              </button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tiene una cuenta?{' '}
                <Link href="/login" className="text-[#FF0033] hover:text-[#FF3366] font-medium transition-colors">
                  Iniciar Sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}