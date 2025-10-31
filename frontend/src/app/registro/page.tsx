"use client";
import { useState } from "react";
import { SeleccionRol } from "./components/SeleccionRol";
import { SeleccionTipoExterno } from "./components/SeleccionTipoExterno";
import { FormularioRegistro } from "./components/FormularioRegistro";

type RolSeleccionado = "externo" | "unsa";
type TipoExterno = "academia" | "gobierno" | "empresa" | "sociedad_civil";
type VistaActual = "seleccion" | "tipo_externo" | "formulario";

export default function RegistroPage() {
  const [rol, setRol] = useState<RolSeleccionado | null>(null);
  const [tipoExterno, setTipoExterno] = useState<TipoExterno | null>(null);
  const [vista, setVista] = useState<VistaActual>("seleccion");

  const handleSelectRol = (rol: RolSeleccionado) => {
    setRol(rol);
    if (rol === "externo") {
      setVista("tipo_externo");
    } else {
      setVista("formulario");
    }
  };

  const handleSelectTipoExterno = (tipo: TipoExterno) => {
    setTipoExterno(tipo);
    setVista("formulario");
  };

  const handleVolverASeleccion = () => {
    setRol(null);
    setTipoExterno(null);
    setVista("seleccion");
  };

  const handleVolverATipoExterno = () => {
    setTipoExterno(null);
    setVista("tipo_externo");
  };

  if (vista === "seleccion") {
    return <SeleccionRol onSelectRol={handleSelectRol} />;
  }

  if (vista === "tipo_externo") {
    return (
      <SeleccionTipoExterno 
        onSelectTipo={handleSelectTipoExterno} 
        onBack={handleVolverASeleccion}
      />
    );
  }

  if (vista === "formulario") {
    const tipoFormulario = rol === "unsa" ? "unsa" : tipoExterno;
    if (!tipoFormulario) return <SeleccionRol onSelectRol={handleSelectRol} />;
    
    return (
      <FormularioRegistro 
        tipo={tipoFormulario} 
        onVolver={rol === "unsa" ? handleVolverASeleccion : handleVolverATipoExterno}
      />
    );
  }
  
  return <SeleccionRol onSelectRol={handleSelectRol} />;
}