"use client";

import { FormularioAcademia } from "./FormularioAcademia";
import { FormularioGobierno } from "./FormularioGobierno";
import { FormularioEmpresa } from "./FormularioEmpresa";
import { FormularioSociedadCivil } from "./FormularioSociedadCivil";
import { FormularioUnsa } from "./FormularioUnsa";

interface Props {
  tipo: "academia" | "gobierno" | "empresa" | "sociedad_civil" | "unsa";
  onVolver: () => void;
}

export function FormularioRegistro({ tipo, onVolver }: Props) {
  switch (tipo) {
    case "academia":
      return <FormularioAcademia onBack={onVolver} />;
    case "gobierno":
      return <FormularioGobierno onBack={onVolver} />;
    case "empresa":
      return <FormularioEmpresa onBack={onVolver} />;
    case "sociedad_civil":
      return <FormularioSociedadCivil onBack={onVolver} />;
    case "unsa":
      return <FormularioUnsa onBack={onVolver} />;
    default:
      return <div>Tipo de formulario no válido</div>;
  }
}
