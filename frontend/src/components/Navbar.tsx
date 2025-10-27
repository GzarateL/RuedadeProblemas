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
    <nav className={`${isChatsPage ? 'fixed' : 'sticky'} top-0 left-0 right-0 w-full bg-neutral-900/95 border-b border-neutral-800 z-[9998] backdrop-blur-sm shadow-sm flex-shrink-0 h-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-white" onClick={closeMobileMenu}>
              Rueda de Problemas
            </Link>
          </div>

          {/* Botón Hamburguesa - Solo móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Menú Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/agenda"
              className={`text-sm transition-all px-3 py-2 rounded-md ${isActive('/agenda')
                ? 'bg-red-600 text-white font-medium shadow-sm'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
            >
              Agenda
            </Link>

            {isLoading ? (
              <div className="h-8 w-24 bg-neutral-700 animate-pulse rounded-md"></div>
            ) : user ? (
              <>
                {user.rol === 'externo' && (
                  <>
                    <Link
                      href="/desafio"
                      className={`text-sm transition-all px-3 py-2 rounded-md ${isActive('/desafio')
                        ? 'bg-red-600 text-white font-medium shadow-sm'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                        }`}
                    >
                      Mis Desafíos
                    </Link>
                    <Link
                      href="/desafio/mis-matches"
                      className={`text-sm transition-all px-3 py-2 rounded-md ${isActive('/desafio/mis-matches')
                        ? 'bg-red-600 text-white font-medium shadow-sm'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
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
                        ? 'bg-red-600 text-white font-medium shadow-sm'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                        }`}
                    >
                      Mis Capacidades
                    </Link>
                    <Link
                      href="/capacidad/mis-matches"
                      className={`text-sm transition-all px-3 py-2 rounded-md ${isActive('/capacidad/mis-matches')
                        ? 'bg-red-600 text-white font-medium shadow-sm'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
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
                      ? 'bg-red-600 text-white font-medium shadow-sm'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
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
                      ? 'bg-red-600 text-white font-medium shadow-sm'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                      }`}
                  >
                    Chats
                  </Link>
                )}

                {/* Solicitudes */}
                <SolicitudesNotification />

                {/* Dropdown de Usuario */}
                <div className="relative group/dropdown">
                  <button className="flex items-center gap-2 text-sm text-neutral-300 hover:text-white px-3 py-2 rounded-md hover:bg-neutral-800 transition-all">
                    <UserIcon className="w-4 h-4" />
                    <span>{user.nombres_apellidos}</span>
                    {user.rol === 'admin' && <span className="text-xs text-red-500 font-semibold">(Admin)</span>}
                  </button>

                  {/* Dropdown Menu - con delay para evitar cierre rápido */}
                  <div className="absolute right-0 mt-2 w-48 bg-neutral-800 rounded-lg shadow-lg border border-neutral-700 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-300 z-50 before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2">
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-neutral-700 rounded-md transition-colors"
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
                <Button asChild variant="outline" size="sm" className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white">
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                  <Link href="/registro">Registrarse</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Menú Mobile - Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-neutral-900 border-b border-neutral-800 shadow-2xl z-[9999]">
          <div className="px-4 py-3 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <Link
              href="/agenda"
              onClick={closeMobileMenu}
              className={`block text-sm transition-all px-3 py-2 rounded-md ${isActive('/agenda')
                ? 'bg-red-600 text-white font-medium'
                : 'text-neutral-300 hover:bg-neutral-800'
                }`}
            >
              Agenda
            </Link>

            {isLoading ? (
              <div className="h-8 bg-neutral-700 animate-pulse rounded-md"></div>
            ) : user ? (
              <>
                {user.rol === 'externo' && (
                  <>
                    <Link
                      href="/desafio"
                      onClick={closeMobileMenu}
                      className={`block text-sm transition-all px-3 py-2 rounded-md ${isActive('/desafio')
                        ? 'bg-red-600 text-white font-medium'
                        : 'text-neutral-300 hover:bg-neutral-800'
                        }`}
                    >
                      Mis Desafíos
                    </Link>
                    <Link
                      href="/desafio/mis-matches"
                      onClick={closeMobileMenu}
                      className={`block text-sm transition-all px-3 py-2 rounded-md ${isActive('/desafio/mis-matches')
                        ? 'bg-red-600 text-white font-medium'
                        : 'text-neutral-300 hover:bg-neutral-800'
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
                        ? 'bg-red-600 text-white font-medium'
                        : 'text-neutral-300 hover:bg-neutral-800'
                        }`}
                    >
                      Mis Capacidades
                    </Link>
                    <Link
                      href="/capacidad/mis-matches"
                      onClick={closeMobileMenu}
                      className={`block text-sm transition-all px-3 py-2 rounded-md ${isActive('/capacidad/mis-matches')
                        ? 'bg-red-600 text-white font-medium'
                        : 'text-neutral-300 hover:bg-neutral-800'
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
                      ? 'bg-red-600 text-white font-medium'
                      : 'text-neutral-300 hover:bg-neutral-800'
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
                      ? 'bg-red-600 text-white font-medium'
                      : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                  >
                    Chats
                  </Link>
                )}

                <div className="px-3 py-2">
                  <SolicitudesNotification />
                </div>

                <div className="border-t border-neutral-800 pt-2 mt-2">
                  <div className="px-3 py-2 text-sm text-neutral-300 font-medium">
                    {user.nombres_apellidos}
                    {user.rol === 'admin' && <span className="text-xs text-red-500 ml-2">(Admin)</span>}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-neutral-800 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Link href="/login" onClick={closeMobileMenu}>
                  <Button variant="outline" size="sm" className="w-full border-red-600 text-red-500 hover:bg-red-600 hover:text-white">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/registro" onClick={closeMobileMenu}>
                  <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
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