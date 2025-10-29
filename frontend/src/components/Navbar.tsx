// /frontend/src/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut, ChevronDown } from "lucide-react";
import SolicitudesNotification from "./SolicitudesNotification";
import { useEffect, useState, useRef } from "react";

export function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Si estamos en la parte superior, siempre mostrar
      if (currentScrollY < 10) {
        setIsVisible(true);
      } 
      // Si scrolleamos hacia abajo, ocultar
      else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } 
      // Si scrolleamos hacia arriba, mostrar
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 w-full bg-white/25 backdrop-blur-lg border border-white/30 shadow-lg z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`} suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16" suppressHydrationWarning>
          
          <div className="flex-shrink-0 flex items-center overflow-hidden h-12">
            <Link href="/" className="flex items-center justify-center">
              <Image
                src="/logo-rueda-problemas.svg"
                alt="Rueda de Problemas"
                width={189}
                height={189}
                className="cursor-pointer transition-all hover:scale-105"
                priority
                style={{ width: '189px', height: 'auto' }}
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <SolicitudesNotification />  {/* 👈 Aquí aparecerá la campana */}
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/agenda" 
              className={`text-sm transition-all duration-300 ${
                pathname === '/agenda' 
                  ? 'text-electric underline underline-offset-4' 
                  : 'text-neutral-900 hover:text-electric'
              }`}
            >
              Agenda
            </Link>

            {isLoading ? (
              <div className="h-8 w-24 bg-white/20 animate-pulse rounded-md"></div>
            ) : user ? (
              <>
               {user.rol === 'externo' && (
                 <>
                   <Link 
                     href="/desafio" 
                     className={`text-sm transition-all duration-300 ${
                       pathname === '/desafio' 
                         ? 'text-electric underline underline-offset-4' 
                         : 'text-neutral-900 hover:text-electric'
                     }`}
                   >
                     Mis Desafíos
                   </Link>
                   <Link 
                     href="/desafio/mis-matches" 
                     className={`text-sm transition-all duration-300 ${
                       pathname === '/desafio/mis-matches' 
                         ? 'text-electric underline underline-offset-4' 
                         : 'text-neutral-900 hover:text-electric'
                     }`}
                   >
                     Matches
                   </Link>
                   <Link 
                     href="/chats" 
                     className={`text-sm transition-all duration-300 ${
                       pathname === '/chats' 
                         ? 'text-electric underline underline-offset-4' 
                         : 'text-neutral-900 hover:text-electric'
                     }`}
                   >
                     Chats
                   </Link>
                 </>
               )}
               {user.rol === 'unsa' && (
                 <>
                   <Link 
                     href="/capacidad" 
                     className={`text-sm transition-all duration-300 ${
                       pathname === '/capacidad' 
                         ? 'text-electric underline underline-offset-4' 
                         : 'text-neutral-900 hover:text-electric'
                     }`}
                   >
                     Mis Capacidades
                   </Link>
                   <Link 
                     href="/capacidad/mis-matches" 
                     className={`text-sm transition-all duration-300 ${
                       pathname === '/capacidad/mis-matches' 
                         ? 'text-electric underline underline-offset-4' 
                         : 'text-neutral-900 hover:text-electric'
                     }`}
                   >
                     Matches
                   </Link>
                   <Link 
                     href="/chats" 
                     className={`text-sm transition-all duration-300 ${
                       pathname === '/chats' 
                         ? 'text-electric underline underline-offset-4' 
                         : 'text-neutral-900 hover:text-electric'
                     }`}
                   >
                     Chats
                   </Link>
                 </>
               )}
               {user.rol === 'admin' && (
                 <Link 
                   href="/admin/dashboard" 
                   className={`text-sm transition-all duration-300 ${
                     pathname === '/admin/dashboard' 
                       ? 'text-electric underline underline-offset-4' 
                       : 'text-neutral-900 hover:text-electric'
                   }`}
                 >
                   Dashboard Admin
                 </Link>
               )}

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 bg-white/20 text-neutral-900 px-3 py-2 rounded-md hover:bg-white/30 transition-all duration-300 border border-white/30 backdrop-blur-sm"
                  >
                    <span className="text-sm">
                      {user.nombres_apellidos}
                      {user.rol === 'admin' && <span className="ml-1 text-xs text-electric font-semibold">(Admin)</span>}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-md text-white border border-white/20 rounded-md shadow-lg z-50">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-white/10 transition-all duration-300 flex items-center gap-2 rounded-md"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button asChild variant="outline" size="sm" className="bg-white/20 text-neutral-900 border-white/30 hover:bg-electric hover:text-white hover:border-electric transition-all duration-300 backdrop-blur-sm">
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                 <Button asChild size="sm" className="bg-electric text-white hover:bg-white hover:text-electric transition-all duration-300 hover:drop-shadow-[0_0_12px_hsl(0,100%,60%)] focus:drop-shadow-[0_0_12px_hsl(0,100%,60%)]">
                   <Link href="/registro">Registrarse</Link>
                 </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}