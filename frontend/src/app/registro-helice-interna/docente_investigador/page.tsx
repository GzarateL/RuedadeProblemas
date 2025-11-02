"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
import { Plus, Trash2 } from "lucide-react";

interface FormData {
  // Paso 1: Información Personal
  nombreCompleto: string;
  emailCorporativo: string;
  telefono: string;
  oficinaDepartamento: string;
  ctiVitae: string;

  // Paso 2: Áreas OCDE
  areasOCDE: number[];
  subAreasOCDE: number[];
  disciplinasOCDE: number[];

  // Paso 3: ODS
  objetivosODS: number[];
  metasODS: number[];

  // Paso 4: Nivel de Aporte
  nivelAporte: 'alto' | 'medio' | 'bajo' | '';
  descripcionAporte: string;

  // Paso 5: Información Académica (solo niveles TRL/CRL para docentes individuales)
  nivelTRL: number | null;
  descripcionTRL: string;
  nivelCRL: number | null;
  descripcionCRL: string;

  // Paso 6: PIU (igual que otros formularios)
  articulosQ1: number;
  articulosQ2: number;
  articulosQ3: number;
  articulosQ4: number;
  articulosOtros: number;
  librosInvestigacion: number;
  capitulosLibro: number;
  patentesOtorgadas: number;
  patentesSolicitadas: number;
  modelosUtilidad: number;
  disenosIndustriales: number;
  softwareRegistrado: number;
  prototipos: number;
  tesisDoctorado: number;
  tesisMaestria: number;
  tesisPregrado: number;
  informesTecnicos: number;
  consultoriaEspecializada: number;

  // Paso 7: Soluciones
  soluciones: Array<{
    problema: string;
    solucion: string;
  }>;
}

const initialFormData: FormData = {
  nombreCompleto: '',
  emailCorporativo: '',
  telefono: '',
  oficinaDepartamento: '',
  ctiVitae: '',
  areasOCDE: [],
  subAreasOCDE: [],
  disciplinasOCDE: [],
  objetivosODS: [],
  metasODS: [],
  nivelAporte: '',
  descripcionAporte: '',
  nivelTRL: null,
  descripcionTRL: '',
  nivelCRL: null,
  descripcionCRL: '',
  articulosQ1: 0,
  articulosQ2: 0,
  articulosQ3: 0,
  articulosQ4: 0,
  articulosOtros: 0,
  librosInvestigacion: 0,
  capitulosLibro: 0,
  patentesOtorgadas: 0,
  patentesSolicitadas: 0,
  modelosUtilidad: 0,
  disenosIndustriales: 0,
  softwareRegistrado: 0,
  prototipos: 0,
  tesisDoctorado: 0,
  tesisMaestria: 0,
  tesisPregrado: 0,
  informesTecnicos: 0,
  consultoriaEspecializada: 0,
  soluciones: [{ problema: '', solucion: '' }]
};

export default function RegistroDocenteInvestigador() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 8;

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
        if (!formData.nombreCompleto.trim()) newErrors.nombreCompleto = 'El nombre completo es obligatorio';
        if (!formData.emailCorporativo.trim()) newErrors.emailCorporativo = 'El email corporativo es obligatorio';
        if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';
        if (!formData.oficinaDepartamento.trim()) newErrors.oficinaDepartamento = 'La oficina o departamento es obligatorio';
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
        if (!formData.nivelAporte) newErrors.nivelAporte = 'Debe seleccionar un nivel de aporte';
        break;

      case 7:
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
      
      // Guardar datos en localStorage para mostrar en confirmación
      localStorage.setItem('registro_confirmacion', JSON.stringify({
        tipo: 'docente_investigador',
        datos: formData,
        fecha: new Date().toISOString()
      }));
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/registro-helice-interna/confirmacion');
    } catch (error) {
      console.error('Error al enviar formulario:', error);
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
      soluciones: [...prev.soluciones, { problema: '', solucion: '' }]
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

  const updateSolucion = (index: number, field: 'problema' | 'solucion', value: string) => {
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
                <Label htmlFor="oficinaDepartamento">Oficina o departamento vinculado *</Label>
                <Input
                  id="oficinaDepartamento"
                  value={formData.oficinaDepartamento}
                  onChange={(e) => updateFormData('oficinaDepartamento', e.target.value)}
                  placeholder="Indique con quién se vincula directamente en el organigrama"
                  className={errors.oficinaDepartamento ? 'border-red-500' : ''}
                />
                {errors.oficinaDepartamento && (
                  <p className="text-red-500 text-sm mt-1">{errors.oficinaDepartamento}</p>
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
          <Card>
            <CardHeader>
              <CardTitle>Objetivos de Desarrollo Sostenible (ODS)</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Nivel de Aporte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Nivel de aporte *</Label>
                <Select
                  value={formData.nivelAporte}
                  onValueChange={(value) => updateFormData('nivelAporte', value)}
                >
                  <SelectTrigger className={errors.nivelAporte ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Seleccione el nivel de aporte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alto">Alto</SelectItem>
                    <SelectItem value="medio">Medio</SelectItem>
                    <SelectItem value="bajo">Bajo</SelectItem>
                  </SelectContent>
                </Select>
                {errors.nivelAporte && (
                  <p className="text-red-500 text-sm mt-1">{errors.nivelAporte}</p>
                )}
              </div>

              <div>
                <Label htmlFor="descripcionAporte">Descripción del aporte (opcional)</Label>
                <Textarea
                  id="descripcionAporte"
                  value={formData.descripcionAporte}
                  onChange={(e) => updateFormData('descripcionAporte', e.target.value)}
                  placeholder="Describa brevemente el tipo de aporte que puede realizar"
                  rows={4}
                />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nivelTRL">Nivel TRL (1-9)</Label>
                  <Select
                    value={formData.nivelTRL?.toString() || ''}
                    onValueChange={(value) => updateFormData('nivelTRL', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione nivel TRL" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9].map(level => (
                        <SelectItem key={level} value={level.toString()}>
                          TRL {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    value={formData.descripcionTRL}
                    onChange={(e) => updateFormData('descripcionTRL', e.target.value)}
                    placeholder="Descripción del nivel TRL"
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="nivelCRL">Nivel CRL (1-9)</Label>
                  <Select
                    value={formData.nivelCRL?.toString() || ''}
                    onValueChange={(value) => updateFormData('nivelCRL', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione nivel CRL" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9].map(level => (
                        <SelectItem key={level} value={level.toString()}>
                          CRL {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    value={formData.descripcionCRL}
                    onChange={(e) => updateFormData('descripcionCRL', e.target.value)}
                    placeholder="Descripción del nivel CRL"
                    className="mt-2"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Producción Intelectual Universitaria (PIU)</CardTitle>
              <p className="text-sm text-gray-600">
                Indique la cantidad de productos PIU que ha logrado como investigador
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Artículos Científicos</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <Label htmlFor="articulosQ1">Q1</Label>
                    <Input
                      id="articulosQ1"
                      type="number"
                      min="0"
                      value={formData.articulosQ1}
                      onChange={(e) => updateFormData('articulosQ1', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="articulosQ2">Q2</Label>
                    <Input
                      id="articulosQ2"
                      type="number"
                      min="0"
                      value={formData.articulosQ2}
                      onChange={(e) => updateFormData('articulosQ2', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="articulosQ3">Q3</Label>
                    <Input
                      id="articulosQ3"
                      type="number"
                      min="0"
                      value={formData.articulosQ3}
                      onChange={(e) => updateFormData('articulosQ3', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="articulosQ4">Q4</Label>
                    <Input
                      id="articulosQ4"
                      type="number"
                      min="0"
                      value={formData.articulosQ4}
                      onChange={(e) => updateFormData('articulosQ4', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="articulosOtros">Otros</Label>
                    <Input
                      id="articulosOtros"
                      type="number"
                      min="0"
                      value={formData.articulosOtros}
                      onChange={(e) => updateFormData('articulosOtros', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Libros y Capítulos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="librosInvestigacion">Libros de investigación</Label>
                    <Input
                      id="librosInvestigacion"
                      type="number"
                      min="0"
                      value={formData.librosInvestigacion}
                      onChange={(e) => updateFormData('librosInvestigacion', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="capitulosLibro">Capítulos de libro</Label>
                    <Input
                      id="capitulosLibro"
                      type="number"
                      min="0"
                      value={formData.capitulosLibro}
                      onChange={(e) => updateFormData('capitulosLibro', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Propiedad Intelectual</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patentesOtorgadas">Patentes otorgadas</Label>
                    <Input
                      id="patentesOtorgadas"
                      type="number"
                      min="0"
                      value={formData.patentesOtorgadas}
                      onChange={(e) => updateFormData('patentesOtorgadas', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="patentesSolicitadas">Patentes solicitadas</Label>
                    <Input
                      id="patentesSolicitadas"
                      type="number"
                      min="0"
                      value={formData.patentesSolicitadas}
                      onChange={(e) => updateFormData('patentesSolicitadas', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="modelosUtilidad">Modelos de utilidad</Label>
                    <Input
                      id="modelosUtilidad"
                      type="number"
                      min="0"
                      value={formData.modelosUtilidad}
                      onChange={(e) => updateFormData('modelosUtilidad', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="disenosIndustriales">Diseños industriales</Label>
                    <Input
                      id="disenosIndustriales"
                      type="number"
                      min="0"
                      value={formData.disenosIndustriales}
                      onChange={(e) => updateFormData('disenosIndustriales', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Productos Tecnológicos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="softwareRegistrado">Software registrado</Label>
                    <Input
                      id="softwareRegistrado"
                      type="number"
                      min="0"
                      value={formData.softwareRegistrado}
                      onChange={(e) => updateFormData('softwareRegistrado', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="prototipos">Prototipos</Label>
                    <Input
                      id="prototipos"
                      type="number"
                      min="0"
                      value={formData.prototipos}
                      onChange={(e) => updateFormData('prototipos', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Formación de Recursos Humanos</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="tesisDoctorado">Tesis de doctorado dirigidas</Label>
                    <Input
                      id="tesisDoctorado"
                      type="number"
                      min="0"
                      value={formData.tesisDoctorado}
                      onChange={(e) => updateFormData('tesisDoctorado', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tesisMaestria">Tesis de maestría dirigidas</Label>
                    <Input
                      id="tesisMaestria"
                      type="number"
                      min="0"
                      value={formData.tesisMaestria}
                      onChange={(e) => updateFormData('tesisMaestria', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tesisPregrado">Tesis de pregrado dirigidas</Label>
                    <Input
                      id="tesisPregrado"
                      type="number"
                      min="0"
                      value={formData.tesisPregrado}
                      onChange={(e) => updateFormData('tesisPregrado', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Otros Productos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="informesTecnicos">Informes técnicos</Label>
                    <Input
                      id="informesTecnicos"
                      type="number"
                      min="0"
                      value={formData.informesTecnicos}
                      onChange={(e) => updateFormData('informesTecnicos', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="consultoriaEspecializada">Consultoría especializada</Label>
                    <Input
                      id="consultoriaEspecializada"
                      type="number"
                      min="0"
                      value={formData.consultoriaEspecializada}
                      onChange={(e) => updateFormData('consultoriaEspecializada', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 7:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Soluciones que Ofrece</CardTitle>
              <p className="text-sm text-gray-600">
                Describa los problemas que puede solucionar y las soluciones que propone
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
                      <Label htmlFor={`problema_${index}`}>Descripción del problema *</Label>
                      <Textarea
                        id={`problema_${index}`}
                        value={solucion.problema}
                        onChange={(e) => updateSolucion(index, 'problema', e.target.value)}
                        placeholder="Describa el problema que puede abordar"
                        rows={3}
                        className={errors[`problema_${index}`] ? 'border-red-500' : ''}
                      />
                      {errors[`problema_${index}`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`problema_${index}`]}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor={`solucion_${index}`}>Propuesta de solución *</Label>
                      <Textarea
                        id={`solucion_${index}`}
                        value={solucion.solucion}
                        onChange={(e) => updateSolucion(index, 'solucion', e.target.value)}
                        placeholder="Describa la solución que propone"
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

      case 8:
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
                
                <div>
                  <h4 className="font-medium mb-2">Nivel de Aporte</h4>
                  <div className="text-sm">
                    <p><strong>Nivel:</strong> {formData.nivelAporte}</p>
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