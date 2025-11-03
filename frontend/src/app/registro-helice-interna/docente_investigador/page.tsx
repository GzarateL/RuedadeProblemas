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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OCDESelector from "../components/OCDESelector";
import ODSSelector from "../components/ODSSelector";
import KeywordSelector from "../components/KeywordSelector";
import { Plus, Trash2 } from "lucide-react";

interface FormData {
  // Paso 1: Información Personal
  nombreCompleto: string;
  emailCorporativo: string;
  telefono: string;
  programaEstudio: string;
  ctiVitae: string;

  // Paso 2: Áreas OCDE
  areasOCDE: number[];
  subAreasOCDE: number[];
  disciplinasOCDE: number[];

  // Paso 3: ODS
  objetivosODS: number[];
  metasODS: number[];

  // Paso 4: Nivel de Aporte
  nivelAporteDEL: number | null; // 1-7
  nivelAporteDS: number | null; // 1-7

  // Paso 5: Información Académica (solo niveles TRL/CRL para docentes individuales)
  nivelTRL: number | null;
  descripcionTRL: string;
  nivelCRL: number | null;
  descripcionCRL: string;

  // Paso 6: PIU (Producción Intelectual Universitaria)
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

  // Paso 7: Palabras Clave
  palabrasClave: number[]; // IDs de keywords_catalog

  // Paso 8: Soluciones
  soluciones: Array<{
    titulo: string;
    problema: string;
    solucion: string;
  }>;
}

const initialFormData: FormData = {
  nombreCompleto: '',
  emailCorporativo: '',
  telefono: '',
  programaEstudio: '',
  ctiVitae: '',
  areasOCDE: [],
  subAreasOCDE: [],
  disciplinasOCDE: [],
  objetivosODS: [],
  metasODS: [],
  nivelAporteDEL: null,
  nivelAporteDS: null,
  nivelTRL: null,
  descripcionTRL: '',
  nivelCRL: null,
  descripcionCRL: '',
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

export default function RegistroDocenteInvestigador() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const totalSteps = 9; // Actualizado: ahora son 9 pasos

  useEffect(() => {
    if (!isLoading && !user) {
      // Guardar el tipo de registro para continuar después del login
      localStorage.setItem('registro_helice_tipo', 'docente_investigador');
      router.push('/login?redirect=/registro-helice-interna&message=Debe iniciar sesión para continuar con el registro');
    } else if (!isLoading && user && user.rol !== 'interno') {
      router.push('/?error=Solo los miembros de la UNSA pueden registrarse en la hélice interna');
    } else if (!isLoading && user) {
      // Auto-rellenar datos del usuario
      setFormData(prev => ({
        ...prev,
        nombreCompleto: user.nombres_apellidos || '',
        emailCorporativo: user.email || ''
      }));
    }
  }, [user, isLoading, router]);

  // Cargar datos del registro si estamos editando
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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/registros/${editId}?tipo=docente_investigador`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Error al cargar el registro');
        }

        const registro = await response.json();
        console.log('Registro cargado para edición:', registro);

        // Mapear los datos del registro al formulario
        setFormData({
          nombreCompleto: registro.nombre_completo || '',
          emailCorporativo: registro.email || '',
          telefono: registro.telefono || '',
          programaEstudio: registro.programa_estudio || '',
          ctiVitae: registro.url_cti_vitae || '',
          
          // OCDE
          areasOCDE: registro.ocde?.map((o: any) => o.area_id).filter(Boolean) || [],
          subAreasOCDE: registro.ocde?.map((o: any) => o.sub_area_id).filter(Boolean) || [],
          disciplinasOCDE: registro.ocde?.map((o: any) => o.disciplina_id).filter(Boolean) || [],
          
          // ODS
          objetivosODS: registro.ods?.map((o: any) => o.objetivo_id).filter(Boolean) || [],
          metasODS: registro.ods?.map((o: any) => o.meta_id).filter(Boolean) || [],
          
          // Aportes
          nivelAporteDEL: registro.aportes?.nivel_aporte_del || null,
          nivelAporteDS: registro.aportes?.nivel_aporte_ds || null,
          
          // Niveles tecnológicos
          nivelTRL: registro.niveles?.nivel_trl || null,
          descripcionTRL: '',
          nivelCRL: registro.niveles?.nivel_crl || null,
          descripcionCRL: '',
          
          // PIU
          tesis: registro.piu?.tesis || 0,
          libros: registro.piu?.libros || 0,
          capitulosLibro: registro.piu?.capitulos_libro || 0,
          manuscritosPublicados: registro.piu?.manuscritos_publicados || 0,
          manuscritosAceptados: registro.piu?.manuscritos_aceptados || 0,
          manuscritosEvaluacion: registro.piu?.manuscritos_evaluacion || 0,
          propiedadIntelectualPatente: registro.piu?.pi_patente_invencion || 0,
          propiedadIntelectualModalidadUso: registro.piu?.pi_patente_modalidad_uso || 0,
          propiedadIntelectualSuiGeneris: registro.piu?.pi_sui_generis || 0,
          propiedadIntelectualSoftware: registro.piu?.pi_derecho_autor_software || 0,
          propiedadIntelectualObrasLiterarias: registro.piu?.pi_derecho_obras_literarias || 0,
          propiedadIntelectualOtras: registro.piu?.pi_otras || 0,
          
          // Keywords
          palabrasClave: registro.keywords?.map((k: any) => k.keyword_id) || [],
          
          // Soluciones
          soluciones: registro.soluciones?.length > 0 
            ? registro.soluciones.map((s: any) => ({
                titulo: s.titulo || '',
                problema: s.problema || '',
                solucion: s.solucion || ''
              }))
            : [{ titulo: '', problema: '', solucion: '' }]
        });

        // Establecer el paso actual
        setCurrentStep(registro.paso_actual || 1);

        toast.success('Datos cargados correctamente');
      } catch (error: any) {
        console.error('Error al cargar registro:', error);
        toast.error('Error al cargar el registro para edición');
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

  if (!user || user.rol !== 'interno') {
    return null;
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.nombreCompleto.trim()) newErrors.nombreCompleto = 'El nombre completo es obligatorio';
        if (!formData.emailCorporativo.trim()) newErrors.emailCorporativo = 'El email corporativo es obligatorio';
        if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';
        if (!formData.programaEstudio.trim()) newErrors.programaEstudio = 'El programa de estudio es obligatorio';
        if (!formData.ctiVitae.trim()) newErrors.ctiVitae = 'El enlace CTI Vitae es obligatorio';

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.emailCorporativo && !emailRegex.test(formData.emailCorporativo)) {
          newErrors.emailCorporativo = 'Formato de email inválido';
        }

        // Validar URL CTI Vitae
        const urlRegex = /^https?:\/\/.+/;
        if (formData.ctiVitae && !urlRegex.test(formData.ctiVitae)) {
          newErrors.ctiVitae = 'La URL debe comenzar con http:// o https://';
        }
        break;

      case 2:
        if (formData.areasOCDE.length === 0 && formData.subAreasOCDE.length === 0 && formData.disciplinasOCDE.length === 0) {
          newErrors.ocde = 'Debe seleccionar al menos un área OCDE';
        }
        break;

      case 3:
        if (formData.objetivosODS.length === 0) {
          newErrors.ods = 'Debe seleccionar al menos un ODS';
        }
        break;

      case 4:
        if (!formData.nivelAporteDEL) newErrors.nivelAporteDEL = 'Debe seleccionar el nivel de aporte al DEL';
        if (!formData.nivelAporteDS) newErrors.nivelAporteDS = 'Debe seleccionar el nivel de aporte al DS';
        break;

      case 7:
        if (formData.palabrasClave.length === 0) {
          newErrors.palabrasClave = 'Debe seleccionar al menos una palabra clave';
        }
        break;

      case 8:
        formData.soluciones.forEach((solucion, index) => {
          if (!solucion.problema.trim()) {
            newErrors[`problema_${index}`] = 'La descripción del problema es obligatoria';
          }
          if (!solucion.solucion.trim()) {
            newErrors[`solucion_${index}`] = 'La propuesta de solución es obligatoria';
          }
        });
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      saveProgress();
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const saveProgress = async () => {
    console.log('Guardando progreso...', formData);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      console.log('Enviando formulario completo...', formData);

      const isEditing = !!editId;

      // Preparar datos según la estructura de la BD
      const datosRegistro = {
        tipo: 'docente_investigador',
        nombre_completo: formData.nombreCompleto,
        email: formData.emailCorporativo,
        telefono: formData.telefono,
        programa_estudio: formData.programaEstudio,
        url_cti_vitae: formData.ctiVitae,
        
        // OCDE
        ocde: formData.disciplinasOCDE.map((disciplinaId, index) => ({
          area_id: formData.areasOCDE[index] || null,
          sub_area_id: formData.subAreasOCDE[index] || null,
          disciplina_id: disciplinaId
        })),
        
        // ODS
        ods: formData.objetivosODS.map((objetivoId, index) => ({
          objetivo_id: objetivoId,
          meta_id: formData.metasODS[index] || null
        })),
        
        // Aportes (escala 1-7)
        nivel_aporte_del: formData.nivelAporteDEL,
        nivel_aporte_ds: formData.nivelAporteDS,
        
        // Niveles tecnológicos
        nivel_trl: formData.nivelTRL,
        nivel_crl: formData.nivelCRL,
        
        // PIU
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
        
        // Keywords
        keywords: formData.palabrasClave,
        
        // Soluciones
        soluciones: formData.soluciones,
        
        paso_actual: totalSteps
      };

      // Enviar al backend
      const token = Cookies.get('token');
      
      if (!token) {
        throw new Error('No se encontró el token de autenticación. Por favor, inicie sesión nuevamente.');
      }
      
      console.log('Token encontrado:', token ? 'Sí' : 'No');
      console.log('Modo:', isEditing ? 'Editando' : 'Creando nuevo');
      
      const url = isEditing 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/registros/${editId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/registros`;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosRegistro)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al registrar');
      }

      const resultado = await response.json();
      console.log('Registro exitoso:', resultado);

      toast.success(isEditing ? 'Registro actualizado exitosamente' : 'Registro creado exitosamente');
      
      // Redirigir a la página de capacidades
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

  const addSolucion = () => {
    setFormData(prev => ({
      ...prev,
      soluciones: [{ titulo: '', problema: '', solucion: '' }]
    }));
  };

  const removeSolucion = (index: number) => {
    if (formData.soluciones.length > 1) {
      setFormData(prev => ({
        ...prev,
        soluciones: prev.soluciones.filter((_, i) => i !== index)
      }));
    }
  };

  const updateSolucion = (index: number, field: 'titulo' | 'problema' | 'solucion', value: string) => {
    setFormData(prev => ({
      ...prev,
      soluciones: prev.soluciones.map((sol, i) =>
        i === index ? { ...sol, [field]: value } : sol
      )
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="nombreCompleto">Nombre completo *</Label>
                <Input
                  id="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={(e) => updateFormData('nombreCompleto', e.target.value)}
                  className={errors.nombreCompleto ? 'border-red-500' : ''}
                />
                {errors.nombreCompleto && (
                  <p className="text-red-500 text-sm mt-1">{errors.nombreCompleto}</p>
                )}
              </div>

              <div>
                <Label htmlFor="emailCorporativo">Email corporativo *</Label>
                <Input
                  id="emailCorporativo"
                  type="email"
                  value={formData.emailCorporativo}
                  onChange={(e) => updateFormData('emailCorporativo', e.target.value)}
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
                  className={errors.telefono ? 'border-red-500' : ''}
                />
                {errors.telefono && (
                  <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
                )}
              </div>

              <div>
                <Label htmlFor="programaEstudio">Programa de estudio *</Label>
                <Input
                  id="programaEstudio"
                  value={formData.programaEstudio}
                  onChange={(e) => updateFormData('programaEstudio', e.target.value)}
                  placeholder="Registre el programa de estudio principal"
                  className={errors.programaEstudio ? 'border-red-500' : ''}
                />
                <p className="text-sm text-gray-600 mt-1">
                  U: ingresa
                </p>
                {errors.programaEstudio && (
                  <p className="text-red-500 text-sm mt-1">{errors.programaEstudio}</p>
                )}
              </div>

              <div>
                <Label htmlFor="ctiVitae">Enlace CTI Vitae *</Label>
                <Input
                  id="ctiVitae"
                  value={formData.ctiVitae}
                  onChange={(e) => updateFormData('ctiVitae', e.target.value)}
                  placeholder="https://ctivitae.concytec.gob.pe/..."
                  className={errors.ctiVitae ? 'border-red-500' : ''}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Ingrese el enlace a su perfil CTI Vitae (debe comenzar con http:// o https://)
                </p>
                {errors.ctiVitae && (
                  <p className="text-red-500 text-sm mt-1">{errors.ctiVitae}</p>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Áreas OCDE</CardTitle>
            </CardHeader>
            <CardContent>
              <OCDESelector
                selectedAreas={formData.areasOCDE}
                selectedSubAreas={formData.subAreasOCDE}
                selectedDisciplinas={formData.disciplinasOCDE}
                onSelectionChange={(areas, subAreas, disciplinas) => {
                  updateFormData('areasOCDE', areas);
                  updateFormData('subAreasOCDE', subAreas);
                  updateFormData('disciplinasOCDE', disciplinas);
                }}
              />
              {errors.ocde && (
                <p className="text-red-500 text-sm mt-2">{errors.ocde}</p>
              )}
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">Objetivos de Desarrollo Sostenible (ODS)</h2>
              <p className="text-sm text-gray-600 mt-2">
                Seleccione los ODS con los que su trabajo se alinea
              </p>
            </div>
            <ODSSelector
              selectedObjetivos={formData.objetivosODS}
              selectedMetas={formData.metasODS}
              onSelectionChange={(objetivos, metas) => {
                updateFormData('objetivosODS', objetivos);
                updateFormData('metasODS', metas);
              }}
            />
            {errors.ods && (
              <p className="text-red-500 text-sm mt-2">{errors.ods}</p>
            )}
          </div>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Nivel de Aporte</CardTitle>
              <p className="text-sm text-gray-600">
                Indique el nivel de aporte que su capacidad puede ofrecer (Máximo aporte: 7 - Mínimo aporte: 1)
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="nivelAporteDEL" className="text-base font-medium">
                  Aporte al DEL (Desarrollo Económico Local) *
                </Label>
                <p className="text-sm text-gray-600 mt-1 mb-3">
                  Destinado a las personas: mejorar la calidad de vida y sus ingresos
                </p>
                <Select
                  value={formData.nivelAporteDEL?.toString() || ''}
                  onValueChange={(value) => updateFormData('nivelAporteDEL', parseInt(value))}
                >
                  <SelectTrigger className={errors.nivelAporteDEL ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Seleccione el nivel de aporte al DEL" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7].map(nivel => (
                      <SelectItem key={nivel} value={nivel.toString()}>
                        Nivel {nivel} {nivel === 7 ? '(Máximo)' : nivel === 1 ? '(Mínimo)' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.nivelAporteDEL && (
                  <p className="text-red-500 text-sm mt-1">{errors.nivelAporteDEL}</p>
                )}
              </div>

              <div>
                <Label htmlFor="nivelAporteDS" className="text-base font-medium">
                  Aporte al DS (Desarrollo Social) *
                </Label>
                <p className="text-sm text-gray-600 mt-1 mb-3">
                  Destinado a las políticas y gestión pública (Gobiernos): educación, salud, infraestructura, transporte, seguridad, cultura, etc.
                </p>
                <Select
                  value={formData.nivelAporteDS?.toString() || ''}
                  onValueChange={(value) => updateFormData('nivelAporteDS', parseInt(value))}
                >
                  <SelectTrigger className={errors.nivelAporteDS ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Seleccione el nivel de aporte al DS" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7].map(nivel => (
                      <SelectItem key={nivel} value={nivel.toString()}>
                        Nivel {nivel} {nivel === 7 ? '(Máximo)' : nivel === 1 ? '(Mínimo)' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.nivelAporteDS && (
                  <p className="text-red-500 text-sm mt-1">{errors.nivelAporteDS}</p>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Niveles Tecnológicos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="nivelTRL" className="text-base font-medium">Nivel TRL</Label>
                <p className="text-sm text-gray-600 mt-1 mb-3">
                  Señale su máximo nivel de TRL que podría alcanzar al día de hoy
                </p>
                <Select
                  value={formData.nivelTRL?.toString() || ''}
                  onValueChange={(value) => updateFormData('nivelTRL', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione nivel de TRL" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
                      <SelectItem key={level} value={level.toString()}>
                        TRL {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="nivelCRL" className="text-base font-medium">Nivel CRL</Label>
                <p className="text-sm text-gray-600 mt-1 mb-3">
                  Señale su máximo nivel de CRL que podría alcanzar al día de hoy
                </p>
                <Select
                  value={formData.nivelCRL?.toString() || ''}
                  onValueChange={(value) => updateFormData('nivelCRL', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione nivel de CRL" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
                      <SelectItem key={level} value={level.toString()}>
                        CRL {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle>PIU alcanzada</CardTitle>
              <p className="text-sm text-gray-600">
                Permite número de 0 a 999. Indique la cantidad de productos de PIU ha logrado
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tesis">Tesis</Label>
                <Input
                  id="tesis"
                  type="number"
                  min="0"
                  max="999"
                  value={formData.tesis}
                  onChange={(e) => updateFormData('tesis', parseInt(e.target.value) || 0)}
                  placeholder="Ingrese un número"
                />
              </div>

              <div>
                <Label htmlFor="libros">Libros</Label>
                <Input
                  id="libros"
                  type="number"
                  min="0"
                  max="999"
                  value={formData.libros}
                  onChange={(e) => updateFormData('libros', parseInt(e.target.value) || 0)}
                  placeholder="Ingrese un número"
                />
              </div>

              <div>
                <Label htmlFor="capitulosLibro">Capítulos de libro</Label>
                <Input
                  id="capitulosLibro"
                  type="number"
                  min="0"
                  max="999"
                  value={formData.capitulosLibro}
                  onChange={(e) => updateFormData('capitulosLibro', parseInt(e.target.value) || 0)}
                  placeholder="Ingrese un número"
                />
              </div>

              <div>
                <Label htmlFor="manuscritosPublicados">Manuscritos publicados</Label>
                <Input
                  id="manuscritosPublicados"
                  type="number"
                  min="0"
                  max="999"
                  value={formData.manuscritosPublicados}
                  onChange={(e) => updateFormData('manuscritosPublicados', parseInt(e.target.value) || 0)}
                  placeholder="Ingrese un número"
                />
              </div>

              <div>
                <Label htmlFor="manuscritosAceptados">Manuscritos aceptados para publicación</Label>
                <Input
                  id="manuscritosAceptados"
                  type="number"
                  min="0"
                  max="999"
                  value={formData.manuscritosAceptados}
                  onChange={(e) => updateFormData('manuscritosAceptados', parseInt(e.target.value) || 0)}
                  placeholder="Ingrese un número"
                />
              </div>

              <div>
                <Label htmlFor="manuscritosEvaluacion">Manuscritos en evaluación</Label>
                <Input
                  id="manuscritosEvaluacion"
                  type="number"
                  min="0"
                  max="999"
                  value={formData.manuscritosEvaluacion}
                  onChange={(e) => updateFormData('manuscritosEvaluacion', parseInt(e.target.value) || 0)}
                  placeholder="Ingrese un número"
                />
              </div>

              <div>
                <Label htmlFor="propiedadIntelectualPatente">Propiedad intelectual Patente de invención</Label>
                <Input
                  id="propiedadIntelectualPatente"
                  type="number"
                  min="0"
                  max="999"
                  value={formData.propiedadIntelectualPatente}
                  onChange={(e) => updateFormData('propiedadIntelectualPatente', parseInt(e.target.value) || 0)}
                  placeholder="Ingrese un número"
                />
              </div>

              <div>
                <Label htmlFor="propiedadIntelectualModalidadUso">Propiedad intelectual Patente modalidad de uso</Label>
                <Input
                  id="propiedadIntelectualModalidadUso"
                  type="number"
                  min="0"
                  max="999"
                  value={formData.propiedadIntelectualModalidadUso}
                  onChange={(e) => updateFormData('propiedadIntelectualModalidadUso', parseInt(e.target.value) || 0)}
                  placeholder="Ingrese un número"
                />
              </div>

              <div>
                <Label htmlFor="propiedadIntelectualSuiGeneris">Propiedad intelectual Sui generis</Label>
                <Input
                  id="propiedadIntelectualSuiGeneris"
                  type="number"
                  min="0"
                  max="999"
                  value={formData.propiedadIntelectualSuiGeneris}
                  onChange={(e) => updateFormData('propiedadIntelectualSuiGeneris', parseInt(e.target.value) || 0)}
                  placeholder="Ingrese un número"
                />
              </div>

              <div>
                <Label htmlFor="propiedadIntelectualSoftware">Propiedad intelectual Derecho de Autor Software</Label>
                <Input
                  id="propiedadIntelectualSoftware"
                  type="number"
                  min="0"
                  max="999"
                  value={formData.propiedadIntelectualSoftware}
                  onChange={(e) => updateFormData('propiedadIntelectualSoftware', parseInt(e.target.value) || 0)}
                  placeholder="Ingrese un número"
                />
              </div>

              <div>
                <Label htmlFor="propiedadIntelectualObrasLiterarias">Propiedad intelectual Derecho de Obras literarias</Label>
                <Input
                  id="propiedadIntelectualObrasLiterarias"
                  type="number"
                  min="0"
                  max="999"
                  value={formData.propiedadIntelectualObrasLiterarias}
                  onChange={(e) => updateFormData('propiedadIntelectualObrasLiterarias', parseInt(e.target.value) || 0)}
                  placeholder="Ingrese un número"
                />
              </div>

              <div>
                <Label htmlFor="propiedadIntelectualOtras">Propiedad intelectual (otras)</Label>
                <Input
                  id="propiedadIntelectualOtras"
                  type="number"
                  min="0"
                  max="999"
                  value={formData.propiedadIntelectualOtras}
                  onChange={(e) => updateFormData('propiedadIntelectualOtras', parseInt(e.target.value) || 0)}
                  placeholder="Ingrese un número"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 7:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Palabras Clave de Soluciones</CardTitle>
              <p className="text-sm text-gray-600">
                De las soluciones que puede otorgar, señale palabras claves. Ej.: nanomateriales, bacterias, dislexia, rotación de personal, biorremediación, estructura civil, etc.
              </p>
            </CardHeader>
            <CardContent>
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

      case 8:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Soluciones</CardTitle>
              <p className="text-sm text-gray-600">
                Indique brevemente problemas que puede solucionar, ir
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.soluciones.map((solucion, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Solución #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSolucion(index)}
                      disabled={formData.soluciones.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`titulo_${index}`}>S: Título</Label>
                      <Input
                        id={`titulo_${index}`}
                        value={solucion.titulo}
                        onChange={(e) => updateSolucion(index, 'titulo', e.target.value)}
                        placeholder="Ingrese información"
                        className={errors[`titulo_${index}`] ? 'border-red-500' : ''}
                      />
                      {errors[`titulo_${index}`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`titulo_${index}`]}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`problema_${index}`}>S: Problema</Label>
                      <Textarea
                        id={`problema_${index}`}
                        value={solucion.problema}
                        onChange={(e) => updateSolucion(index, 'problema', e.target.value)}
                        placeholder="Ingrese información"
                        rows={3}
                        className={errors[`problema_${index}`] ? 'border-red-500' : ''}
                      />
                      {errors[`problema_${index}`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`problema_${index}`]}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`solucion_${index}`}>S: Solución</Label>
                      <Textarea
                        id={`solucion_${index}`}
                        value={solucion.solucion}
                        onChange={(e) => updateSolucion(index, 'solucion', e.target.value)}
                        placeholder="Ingrese información"
                        rows={3}
                        className={errors[`solucion_${index}`] ? 'border-red-500' : ''}
                      />
                      {errors[`solucion_${index}`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`solucion_${index}`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addSolucion}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar otra solución
              </Button>
            </CardContent>
          </Card>
        );
      case 9:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Confirmación</CardTitle>
              <p className="text-sm text-gray-600">
                Revise la información antes de enviar su registro
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Información Personal</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Nombre:</strong> {formData.nombreCompleto}</p>
                    <p><strong>Email:</strong> {formData.emailCorporativo}</p>
                    <p><strong>Teléfono:</strong> {formData.telefono}</p>
                  </div>
                </div>


              </div>

              <div>
                <h4 className="font-medium mb-2">Áreas OCDE Seleccionadas</h4>
                <p className="text-sm text-gray-600">
                  {formData.areasOCDE.length + formData.subAreasOCDE.length + formData.disciplinasOCDE.length} áreas seleccionadas
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">ODS Seleccionados</h4>
                <p className="text-sm text-gray-600">
                  {formData.objetivosODS.length} objetivos seleccionados
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Soluciones</h4>
                <p className="text-sm text-gray-600">
                  {formData.soluciones.length} soluciones registradas
                </p>
              </div>
            </CardContent>
          </Card>
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
            Registro de Docente - Investigador
          </h1>
          <p className="text-gray-600">
            Complete su información como docente e investigador de la UNSA
          </p>
        </div>

        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            {renderStep()}
          </div>

          <div className="px-6 pb-6">
            <StepNavigation
              currentStep={currentStep}
              totalSteps={totalSteps}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSubmit={handleSubmit}
              isNextDisabled={false}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}