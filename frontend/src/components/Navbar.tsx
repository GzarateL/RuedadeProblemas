// /frontend/src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User as UserIcon, Menu, X } from "lucide-react";
import SolicitudesNotification from "./SolicitudesNotification";
import { useState } from "react";

export function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isChatsPage = pathname?.startsWith('/chats');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className={`${isChatsPage ? 'fixed' : 'sticky'} top-0 left-0 right-0 w-full bg-white/95 border-b z-[9998] backdrop-blur-sm shadow-sm flex-shrink-0 h-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-neutral-900" onClick={closeMobileMenu}>
              Rueda de Problemas
            </Link>
          </div>

          {/* Botón Hamburguesa - Solo móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Menú Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/agenda"
              className={`text-sm transition-all px-3 py-2 rounded-md ${isActive('/agenda')
                ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-gray-50'
                }`}
            >
              Agenda
            </Link>

            {isLoading ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-md"></div>
            ) : user ? (
              <>
                {user.rol === 'externo' && (
                  <>
                    <Link
                      href="/desafio"
                      className={`text-sm transition-all px-3 py-2 rounded-md ${isActive('/desafio')
                        ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-gray-50'
                        }`}
                    >
                      Mis Desafíos
                    </Link>
                    <Link
                      href="/desafio/mis-matches"
                      className={`text-sm transition-all px-3 py-2 rounded-md ${isActive('/desafio/mis-matches')
                        ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-gray-50'
                        }`}
                    >
                      Matches
                    </Link>
                  </>
                )}
                {user.rol === 'unsa' && (
                  <>
                    <Link
                      href="/capacidad"
                      className={`text-sm transition-all px-3 py-2 rounded-md ${isActive('/capacidad')
                        ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-gray-50'
                        }`}
                    >
                      Mis Capacidades
                    </Link>
                    <Link
                      href="/capacidad/mis-matches"
                      className={`text-sm transition-all px-3 py-2 rounded-md ${isActive('/capacidad/mis-matches')
                        ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-gray-50'
                        }`}
                    >
                      Matches
                    </Link>
                  </>
                )}
                {user.rol === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    className={`text-sm transition-all px-3 py-2 rounded-md ${pathname?.startsWith('/admin')
                      ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-gray-50'
                      }`}
                  >
                    Dashboard Admin
                  </Link>
                )}

                {/* Chats/Mensajes */}
                {(user.rol === 'externo' || user.rol === 'unsa') && (
                  <Link
                    href="/chats"
                    className={`text-sm transition-all px-3 py-2 rounded-md ${isActive('/chats') || pathname?.startsWith('/chats/')
                      ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-gray-50'
                      }`}
                  >
                    Chats
                  </Link>
                )}

                {/* Solicitudes */}
                <SolicitudesNotification />

                {/* Dropdown de Usuario */}
                <div className="relative group">
                  <button className="flex items-center gap-2 text-sm text-neutral-700 hover:text-neutral-900 px-3 py-2 rounded-md hover:bg-gray-50 transition-all">
                    <UserIcon className="w-4 h-4" />
                    <span>{user.nombres_apellidos}</span>
                    {user.rol === 'admin' && <span className="text-xs text-red-600 font-semibold">(Admin)</span>}
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/registro">Registrarse</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Menú Mobile - Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white border-b shadow-2xl z-[9999]">
          <div className="px-4 py-3 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <Link
              href="/agenda"
              onClick={closeMobileMenu}
              className={`block text-sm transition-all px-3 py-2 rounded-md ${isActive('/agenda')
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-neutral-600 hover:bg-gray-50'
                }`}
            >
              Agenda
            </Link>

            {isLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded-md"></div>
            ) : user ? (
              <>
                {user.rol === 'externo' && (
                  <>
                    <Link
                      href="/desafio"
                      onClick={closeMobileMenu}
                      className={`block text-sm transition-all px-3 py-2 rounded-md ${isActive('/desafio')
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-neutral-600 hover:bg-gray-50'
                        }`}
                    >
                      Mis Desafíos
                    </Link>
                    <Link
                      href="/desafio/mis-matches"
                      onClick={closeMobileMenu}
                      className={`block text-sm transition-all px-3 py-2 rounded-md ${isActive('/desafio/mis-matches')
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-neutral-600 hover:bg-gray-50'
                        }`}
                    >
                      Matches
                    </Link>
                  </>
                )}
                {user.rol === 'unsa' && (
                  <>
                    <Link
                      href="/capacidad"
                      onClick={closeMobileMenu}
                      className={`block text-sm transition-all px-3 py-2 rounded-md ${isActive('/capacidad')
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-neutral-600 hover:bg-gray-50'
                        }`}
                    >
                      Mis Capacidades
                    </Link>
                    <Link
                      href="/capacidad/mis-matches"
                      onClick={closeMobileMenu}
                      className={`block text-sm transition-all px-3 py-2 rounded-md ${isActive('/capacidad/mis-matches')
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-neutral-600 hover:bg-gray-50'
                        }`}
                    >
                      Matches
                    </Link>
                  </>
                )}
                {user.rol === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    onClick={closeMobileMenu}
                    className={`block text-sm transition-all px-3 py-2 rounded-md ${pathname?.startsWith('/admin')
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-neutral-600 hover:bg-gray-50'
                      }`}
                  >
                    Dashboard Admin
                  </Link>
                )}

                {(user.rol === 'externo' || user.rol === 'unsa') && (
                  <Link
                    href="/chats"
                    onClick={closeMobileMenu}
                    className={`block text-sm transition-all px-3 py-2 rounded-md ${isActive('/chats') || pathname?.startsWith('/chats/')
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-neutral-600 hover:bg-gray-50'
                      }`}
                  >
                    Chats
                  </Link>
                )}

                <div className="px-3 py-2">
                  <SolicitudesNotification />
                </div>

                <div className="border-t pt-2 mt-2">
                  <div className="px-3 py-2 text-sm text-neutral-700 font-medium">
                    {user.nombres_apellidos}
                    {user.rol === 'admin' && <span className="text-xs text-red-600 ml-2">(Admin)</span>}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Link href="/login" onClick={closeMobileMenu}>
                  <Button variant="outline" size="sm" className="w-full">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/registro" onClick={closeMobileMenu}>
                  <Button size="sm" className="w-full">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}