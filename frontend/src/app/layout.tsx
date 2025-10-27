"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { PageTransitionProvider } from "@/components/PageTransitionProvider";
import { usePathname } from "next/navigation";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isChatsPage = pathname?.startsWith('/chats');
  const isHomePage = pathname === '/';

  return (
    <html lang="es">
      <Head>
        <title>Rueda de Problemas - UNSA</title>
        <meta name="description" content="Conectando Desafíos con Soluciones" />
      </Head>
      <body 
        className={`${inter.className} bg-neutral-50`}
        style={{ 
          margin: 0, 
          padding: 0, 
          height: '100vh',
          width: '100vw',
          overflow: isChatsPage ? 'hidden' : 'auto'
        }}
      >
        <AuthProvider>
          {isChatsPage ? (
            // Layout para chats: estructura de altura fija
            <div style={{ 
              height: '100vh', 
              width: '100%',
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              <div style={{ flexShrink: 0 }}>
                <Navbar />
              </div>
              <div style={{ 
                flex: 1,
                minHeight: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}>
                <PageTransitionProvider>
                  {children}
                </PageTransitionProvider>
              </div>
            </div>
          ) : (
            // Layout normal
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              minHeight: '100vh',
              overflow: 'auto'
            }}>
              <Navbar />
              <main className={isHomePage ? "flex-grow" : "flex-grow pt-16"}>
                <PageTransitionProvider>
                  {children}
                </PageTransitionProvider>
              </main>
              {!isHomePage && <Footer />}
            </div>
          )}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}