"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";
import { toast } from "sonner";
import ProgressBar from "../components/ProgressBar";
import StepNavigation from "../components/StepNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import OCDESelector from "../components/OCDESelector";
import ODSSelector from "../components/ODSSelector";
import AporteSelector from "../components/AporteSelector";
import NivelesSelector from "../components/NivelesSelector";
import PIUSelector from "../components/PIUSelector";
import KeywordSelector from "../components/KeywordSelector";
import SolucionesEditor from "../components/SolucionesEditor";
import { Plus, Trash2 } from "lucide-react";

interface FormData {
  // Paso 1: Información de la Entidad
  nombreEntidad: string;
  nombreResponsable: string;
  emailCorporativo: string;
  telefono: string;
  oficinaDepartamento: string;

  // Paso 2: Áreas OCDE
  areasOCDE: number[];
  subAreasOCDE: number[];
  disciplinasOCDE: number[];

  // Paso 3: ODS
  objetivosODS: number[];
  metasODS: number[];

  // Paso 4: Nivel de Aporte
  nivelAporteDEL: number | null;
  nivelAporteDS: number | null;

  // Paso 5: CTI Vitae múltiple
  integrantesCTI: string[];

  // Paso 6: Niveles TRL/CRL
  nivelTRL: number | null;
  nivelCRL: number | null;

  // Paso 7: PIU
  tesis: number;
  libros: number;
  capitulosLibro: number;
  manuscritosPublicados: number;
  manuscritosAceptados: number;
  manuscritosEvaluacion: number;
  propiedadIntelectualPatente: number;
  propiedadIntelectualModalidadUso: number;
  propiedadIntelectualSuiGeneris: number;
  propiedadIntelectualSoftware: number;
  propiedadIntelectualObrasLiterarias: number;
  propiedadIntelectualOtras: number;

  // Paso 8: Palabras Clave
  palabrasClave: number[];

  // Paso 9: Soluciones
  soluciones: Array<{
    titulo: string;
    problema: string;
    solucion: string;
  }>;
}

const initialFormData: FormData = {
  nombreEntidad: '',
  nombreResponsable: '',
  emailCorporativo: '',
  telefono: '',
  oficinaDepartamento: '',
  areasOCDE: [],
  subAreasOCDE: [],
  disciplinasOCDE: [],
  objetivosODS: [],
  metasODS: [],
  nivelAporteDEL: null,
  nivelAporteDS: null,
  integrantesCTI: [''],
  nivelTRL: null,
  nivelCRL: null,
  tesis: 0,
  libros: 0,
  capitulosLibro: 0,
  manuscritosPublicados: 0,
  manuscritosAceptados: 0,
  manuscritosEvaluacion: 0,
  propiedadIntelectualPatente: 0,
  propiedadIntelectualModalidadUso: 0,
  propiedadIntelectualSuiGeneris: 0,
  propiedadIntelectualSoftware: 0,
  propiedadIntelectualObrasLiterarias: 0,
  propiedadIntelectualOtras: 0,
  palabrasClave: [],
  soluciones: [{ titulo: '', problema: '', solucion: '' }]
};

export default function RegistroLaboratorio() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const totalSteps = 9;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/registro-helice-interna&message=Debe iniciar sesión para continuar con el registro');
    } else if (!isLoading && user && user.rol !== 'interno') {
      router.push('/?error=Solo los miembros de la UNSA pueden registrarse en la hélice interna');
    } else if (!isLoading && user) {
      setFormData(prev => ({
        ...prev,
        nombreResponsable: user.nombres_apellidos || '',
        emailCorporativo: user.email || ''
      }));
    }
  }, [user, isLoading, router]);

  // Cargar datos en modo edición
  useEffect(() => {
    const cargarDatosRegistro = async () => {
      if (!editId || !user) return;

      setIsLoadingData(true);
      const token = Cookies.get('token');
      if (!token) {
        toast.error('No autenticado');
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/registros/${editId}?tipo=laboratorio`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (!res.ok) throw new Error('Error al cargar el registro');

        const data = await res.json();
        console.log('Datos cargados:', data);

        // Mapear los datos del backend al formulario
        // Eliminar duplicados usando Set
        const uniqueAreas = [...new Set(data.ocde?.map((o: any) => o.area_id).filter(Boolean))] as number[];
        const uniqueSubAreas = [...new Set(data.ocde?.map((o: any) => o.sub_area_id).filter(Boolean))] as number[];
        const uniqueDisciplinas = [...new Set(data.ocde?.map((o: any) => o.disciplina_id).filter(Boolean))] as number[];
        const uniqueObjetivos = [...new Set(data.ods?.map((o: any) => o.objetivo_id).filter(Boolean))] as number[];
        const uniqueMetas = [...new Set(data.ods?.map((o: any) => o.meta_id).filter(Boolean))] as number[];

        setFormData({
          nombreEntidad: data.nombre || '',
          nombreResponsable: data.nombre_completo_responsable || '',
          emailCorporativo: data.email || '',
          telefono: data.telefono || '',
          oficinaDepartamento: data.oficina_departamento_vinculado || '',
          areasOCDE: uniqueAreas,
          subAreasOCDE: uniqueSubAreas,
          disciplinasOCDE: uniqueDisciplinas,
          objetivosODS: uniqueObjetivos,
          metasODS: uniqueMetas,
          nivelAporteDEL: data.aportes?.nivel_aporte_del || null,
          nivelAporteDS: data.aportes?.nivel_aporte_ds || null,
          integrantesCTI: data.cti_vitae?.map((c: any) => c.url_cti) || [''],
          nivelTRL: data.niveles?.nivel_trl || null,
          nivelCRL: data.niveles?.nivel_crl || null,
          tesis: data.piu?.tesis || 0,
          libros: data.piu?.libros || 0,
          capitulosLibro: data.piu?.capitulos_libro || 0,
          manuscritosPublicados: data.piu?.manuscritos_publicados || 0,
          manuscritosAceptados: data.piu?.manuscritos_aceptados || 0,
          manuscritosEvaluacion: data.piu?.manuscritos_evaluacion || 0,
          propiedadIntelectualPatente: data.piu?.pi_patente_invencion || 0,
          propiedadIntelectualModalidadUso: data.piu?.pi_patente_modalidad_uso || 0,
          propiedadIntelectualSuiGeneris: data.piu?.pi_sui_generis || 0,
          propiedadIntelectualSoftware: data.piu?.pi_derecho_autor_software || 0,
          propiedadIntelectualObrasLiterarias: data.piu?.pi_derecho_obras_literarias || 0,
          propiedadIntelectualOtras: data.piu?.pi_otras || 0,
          palabrasClave: data.keywords?.map((k: any) => k.keyword_id) || [],
          soluciones: data.soluciones?.length > 0 ? data.soluciones : [{ titulo: '', problema: '', solucion: '' }]
        });

        setCurrentStep(data.paso_actual || 1);
        toast.success('Datos cargados correctamente');
      } catch (err: any) {
        console.error('Error cargando registro:', err);
        toast.error('Error al cargar el registro');
      } finally {
        setIsLoadingData(false);
      }
    };

    cargarDatosRegistro();
  }, [editId, user]);

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!user || user.rol !== 'interno') {
    return null;
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.nombreEntidad.trim()) newErrors.nombreEntidad = 'El nombre de la entidad es obligatorio';
        if (!formData.nombreResponsable.trim()) newErrors.nombreResponsable = 'El nombre del responsable es obligatorio';
        if (!formData.emailCorporativo.trim()) newErrors.emailCorporativo = 'El email es obligatorio';
        if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';
        if (!formData.oficinaDepartamento.trim()) newErrors.oficinaDepartamento = 'La oficina/departamento es obligatorio';
        break;

      case 2:
        // Validar que al menos haya seleccionado algo en OCDE
        if (formData.areasOCDE.length === 0 && formData.subAreasOCDE.length === 0 && formData.disciplinasOCDE.length === 0) {
          newErrors.ocde = 'Debe seleccionar al menos un área, sub-área o disciplina OCDE';
        }
        console.log('Validación OCDE:', {
          areas: formData.areasOCDE.length,
          subAreas: formData.subAreasOCDE.length,
          disciplinas: formData.disciplinasOCDE.length
        });
        break;

      case 3:
        if (formData.objetivosODS.length === 0) {
          newErrors.ods = 'Debe seleccionar al menos un objetivo ODS';
        }
        break;

      case 4:
        if (formData.nivelAporteDEL === null || formData.nivelAporteDEL < 1 || formData.nivelAporteDEL > 7) {
          newErrors.nivelAporteDEL = 'Debe seleccionar un nivel de aporte DEL (1-7)';
        }
        if (formData.nivelAporteDS === null || formData.nivelAporteDS < 1 || formData.nivelAporteDS > 7) {
          newErrors.nivelAporteDS = 'Debe seleccionar un nivel de aporte DS (1-7)';
        }
        break;

      case 5:
        formData.integrantesCTI.forEach((url, index) => {
          if (url.trim() && !url.match(/^https?:\/\/.+/)) {
            newErrors[`cti_${index}`] = 'Debe ser una URL válida (http:// o https://)';
          }
        });
        break;

      case 6:
        if (!formData.nivelTRL) newErrors.nivelTRL = 'Debe seleccionar un nivel TRL';
        if (!formData.nivelCRL) newErrors.nivelCRL = 'Debe seleccionar un nivel CRL';
        break;

      case 8:
        if (formData.palabrasClave.length === 0) {
          newErrors.palabrasClave = 'Debe seleccionar al menos una palabra clave';
        }
        break;

      case 9:
        formData.soluciones.forEach((sol, index) => {
          if (!sol.titulo.trim()) newErrors[`titulo_${index}`] = 'El título es obligatorio';
          if (!sol.problema.trim()) newErrors[`problema_${index}`] = 'El problema es obligatorio';
          if (!sol.solucion.trim()) newErrors[`solucion_${index}`] = 'La solución es obligatoria';
        });
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    console.log('Intentando avanzar del paso', currentStep);
    console.log('Datos actuales:', formData);
    console.log('Errores:', errors);

    if (validateStep(currentStep)) {
      console.log('Validación exitosa, avanzando...');
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      console.log('Validación falló, no se puede avanzar');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // Construir array de OCDE correctamente
      const ocdeArray = [];

      // Agregar áreas seleccionadas
      for (const areaId of formData.areasOCDE) {
        ocdeArray.push({
          area_id: areaId,
          sub_area_id: null,
          disciplina_id: null
        });
      }

      // Agregar sub-áreas seleccionadas
      for (const subAreaId of formData.subAreasOCDE) {
        ocdeArray.push({
          area_id: null,
          sub_area_id: subAreaId,
          disciplina_id: null
        });
      }

      // Agregar disciplinas seleccionadas
      for (const disciplinaId of formData.disciplinasOCDE) {
        ocdeArray.push({
          area_id: null,
          sub_area_id: null,
          disciplina_id: disciplinaId
        });
      }

      console.log('=== DEBUG OCDE FRONTEND ===');
      console.log('formData.areasOCDE:', formData.areasOCDE);
      console.log('formData.subAreasOCDE:', formData.subAreasOCDE);
      console.log('formData.disciplinasOCDE:', formData.disciplinasOCDE);
      console.log('ocdeArray construido:', ocdeArray);

      const datosRegistro = {
        tipo: 'laboratorio',
        nombre: formData.nombreEntidad,
        nombre_completo_responsable: formData.nombreResponsable,
        email: formData.emailCorporativo,
        telefono: formData.telefono,
        oficina_departamento_vinculado: formData.oficinaDepartamento,

        ocde: ocdeArray,

        ods: [
          // Agregar objetivos seleccionados
          ...formData.objetivosODS.map(objetivoId => ({
            objetivo_id: objetivoId,
            meta_id: null
          })),
          // Agregar metas seleccionadas (el backend buscará el objetivo_id)
          ...formData.metasODS.map(metaId => ({
            objetivo_id: null, // El backend lo completará
            meta_id: metaId
          }))
        ],

        nivel_aporte_del: formData.nivelAporteDEL,
        nivel_aporte_ds: formData.nivelAporteDS,

        cti_vitae_urls: formData.integrantesCTI.filter(url => url.trim()),

        nivel_trl: formData.nivelTRL,
        nivel_crl: formData.nivelCRL,

        piu: {
          tesis: formData.tesis,
          libros: formData.libros,
          capitulos_libro: formData.capitulosLibro,
          manuscritos_publicados: formData.manuscritosPublicados,
          manuscritos_aceptados: formData.manuscritosAceptados,
          manuscritos_evaluacion: formData.manuscritosEvaluacion,
          pi_patente_invencion: formData.propiedadIntelectualPatente,
          pi_patente_modalidad_uso: formData.propiedadIntelectualModalidadUso,
          pi_sui_generis: formData.propiedadIntelectualSuiGeneris,
          pi_derecho_autor_software: formData.propiedadIntelectualSoftware,
          pi_derecho_obras_literarias: formData.propiedadIntelectualObrasLiterarias,
          pi_otras: formData.propiedadIntelectualOtras
        },

        keywords: formData.palabrasClave,
        soluciones: formData.soluciones,
        paso_actual: totalSteps
      };

      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Determinar si es creación o edición
      const url = editId
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/registros/${editId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/registros`;

      const method = editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosRegistro)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Error al ${editId ? 'actualizar' : 'registrar'}`);
      }

      toast.success(editId ? 'Registro actualizado exitosamente' : 'Registro creado exitosamente');

      // Redirigir a la página de capacidades en lugar de confirmación
      router.push('/capacidad');
    } catch (error: any) {
      console.error('Error al enviar formulario:', error);
      toast.error(error.message || 'Error al procesar el registro');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addIntegrante = () => {
    setFormData(prev => ({
      ...prev,
      integrantesCTI: [...prev.integrantesCTI, '']
    }));
  };

  const removeIntegrante = (index: number) => {
    if (formData.integrantesCTI.length > 1) {
      setFormData(prev => ({
        ...prev,
        integrantesCTI: prev.integrantesCTI.filter((_, i) => i !== index)
      }));
    }
  };

  const updateIntegrante = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      integrantesCTI: prev.integrantesCTI.map((url, i) => i === index ? value : url)
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Información de la Entidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="nombreEntidad">Nombre del laboratorio *</Label>
                <Input
                  id="nombreEntidad"
                  value={formData.nombreEntidad}
                  onChange={(e) => updateFormData('nombreEntidad', e.target.value)}
                  placeholder="Registre el nombre del laboratorio de I+D+i+e"
                  className={errors.nombreEntidad ? 'border-red-500' : ''}
                />
                {errors.nombreEntidad && (
                  <p className="text-red-500 text-sm mt-1">{errors.nombreEntidad}</p>
                )}
              </div>

              <div>
                <Label htmlFor="nombreResponsable">Nombre completo del responsable *</Label>
                <Input
                  id="nombreResponsable"
                  value={formData.nombreResponsable}
                  onChange={(e) => updateFormData('nombreResponsable', e.target.value)}
                  placeholder="Registre sus nombres y apellidos"
                  className={errors.nombreResponsable ? 'border-red-500' : ''}
                />
                {errors.nombreResponsable && (
                  <p className="text-red-500 text-sm mt-1">{errors.nombreResponsable}</p>
                )}
              </div>

              <div>
                <Label htmlFor="emailCorporativo">Email *</Label>
                <Input
                  id="emailCorporativo"
                  type="email"
                  value={formData.emailCorporativo}
                  onChange={(e) => updateFormData('emailCorporativo', e.target.value)}
                  placeholder="Registre su correo corporativo"
                  className={errors.emailCorporativo ? 'border-red-500' : ''}
                />
                {errors.emailCorporativo && (
                  <p className="text-red-500 text-sm mt-1">{errors.emailCorporativo}</p>
                )}
              </div>

              <div>
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => updateFormData('telefono', e.target.value)}
                  placeholder="Registre su número de teléfono"
                  className={errors.telefono ? 'border-red-500' : ''}
                />
                {errors.telefono && (
                  <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
                )}
              </div>

              <div>
                <Label htmlFor="oficinaDepartamento">Oficina o departamento vinculado *</Label>
                <Input
                  id="oficinaDepartamento"
                  value={formData.oficinaDepartamento}
                  onChange={(e) => updateFormData('oficinaDepartamento', e.target.value)}
                  placeholder="Con quien se vincula directamente en su organigrama"
                  className={errors.oficinaDepartamento ? 'border-red-500' : ''}
                />
                {errors.oficinaDepartamento && (
                  <p className="text-red-500 text-sm mt-1">{errors.oficinaDepartamento}</p>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <div className="space-y-4">
            <OCDESelector
              selectedAreas={formData.areasOCDE}
              selectedSubAreas={formData.subAreasOCDE}
              selectedDisciplinas={formData.disciplinasOCDE}
              onSelectionChange={(areas, subAreas, disciplinas) => {
                console.log('OCDE seleccionado:', { areas, subAreas, disciplinas });
                setFormData(prev => ({
                  ...prev,
                  areasOCDE: areas,
                  subAreasOCDE: subAreas,
                  disciplinasOCDE: disciplinas
                }));
                // Limpiar error cuando se selecciona algo
                if (errors.ocde) {
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.ocde;
                    return newErrors;
                  });
                }
              }}
            />
            {errors.ocde && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.ocde}</p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <ODSSelector
            selectedObjetivos={formData.objetivosODS}
            selectedMetas={formData.metasODS}
            onSelectionChange={(objetivos, metas) => {
              setFormData(prev => ({
                ...prev,
                objetivosODS: objetivos,
                metasODS: metas
              }));
            }}
          />
        );

      case 4:
        return (
          <AporteSelector
            data={{
              nivelAporteDEL: formData.nivelAporteDEL,
              nivelAporteDS: formData.nivelAporteDS
            }}
            onChange={(field, value) => updateFormData(field, value)}
            errors={errors}
          />
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>CTI Vitae de los Integrantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Instrucciones:</strong> Copie los links de CTI Vitae de los integrantes
                  (deben iniciar con http:// o https://)
                </p>
              </div>

              {formData.integrantesCTI.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`cti-${index}`}>Integrante {index + 1}</Label>
                    <Input
                      id={`cti-${index}`}
                      value={url}
                      onChange={(e) => updateIntegrante(index, e.target.value)}
                      placeholder="https://ctivitae.concytec.gob.pe/..."
                      className={errors[`cti_${index}`] ? 'border-red-500' : ''}
                    />
                    {errors[`cti_${index}`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`cti_${index}`]}</p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeIntegrante(index)}
                    disabled={formData.integrantesCTI.length === 1}
                    className="mt-6"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addIntegrante}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar otro integrante
              </Button>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <NivelesSelector
            data={{
              nivelTRL: formData.nivelTRL,
              nivelCRL: formData.nivelCRL
            }}
            onChange={(field, value) => updateFormData(field, value)}
            errors={errors}
          />
        );

      case 7:
        return (
          <PIUSelector
            data={{
              tesis: formData.tesis,
              libros: formData.libros,
              capitulosLibro: formData.capitulosLibro,
              manuscritosPublicados: formData.manuscritosPublicados,
              manuscritosAceptados: formData.manuscritosAceptados,
              manuscritosEvaluacion: formData.manuscritosEvaluacion,
              propiedadIntelectualPatente: formData.propiedadIntelectualPatente,
              propiedadIntelectualModalidadUso: formData.propiedadIntelectualModalidadUso,
              propiedadIntelectualSuiGeneris: formData.propiedadIntelectualSuiGeneris,
              propiedadIntelectualSoftware: formData.propiedadIntelectualSoftware,
              propiedadIntelectualObrasLiterarias: formData.propiedadIntelectualObrasLiterarias,
              propiedadIntelectualOtras: formData.propiedadIntelectualOtras
            }}
            onChange={(field, value) => updateFormData(field, value)}
            errors={errors}
          />
        );

      case 8:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Palabras Clave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Instrucciones:</strong> De las soluciones que pueden otorgar, señale palabras claves.
                  Ej.: nanomateriales, bacterias, dislexia, rotación de personal, biorremediación, estructura civil, etc.
                </p>
              </div>
              <KeywordSelector
                selectedKeywords={formData.palabrasClave}
                onSelectionChange={(keywords) => updateFormData('palabrasClave', keywords)}
              />
              {errors.palabrasClave && (
                <p className="text-red-500 text-sm mt-2">{errors.palabrasClave}</p>
              )}
            </CardContent>
          </Card>
        );

      case 9:
        return (
          <SolucionesEditor
            soluciones={formData.soluciones}
            onChange={(soluciones) => updateFormData('soluciones', soluciones)}
            errors={errors}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Registro de Laboratorio
          </h1>
          <p className="text-gray-600">
            Complete todos los pasos para registrar su laboratorio de I+D+i+e
          </p>
        </div>

        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <div className="mt-8">
          {renderStep()}
        </div>

        <StepNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
