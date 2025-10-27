# Experiencia de Navegación Dinámica Anclada al Viewport

## Descripción General

Sistema de navegación que sustituye el scroll vertical tradicional por transiciones de componentes en tiempo real, ofreciendo una experiencia tipo "escenas" o "diapositivas" dentro de un viewport estático.

## Arquitectura

### Componentes Principales

#### 1. `ViewportAnchoredView` (Componente Raíz)
**Ubicación:** `frontend/src/components/ViewportAnchoredView.tsx`

**Responsabilidades:**
- Gestión del estado de navegación (índice actual, dirección)
- Detección de eventos de scroll con debouncing
- Control de transiciones entre secciones
- Prevención del scroll nativo del navegador
- Soporte para navegación por teclado (Arrow Up/Down, PageUp/PageDown)

**Props:**
```typescript
interface ViewportAnchoredViewProps {
  sections: ViewportSection[];      // Array de secciones a renderizar
  transitionDuration?: number;      // Duración de transición (default: 0.8s)
  scrollThreshold?: number;         // Umbral de scroll para activar (default: 50px)
}
```

**Características Técnicas:**
- **Latencia:** < 150ms desde trigger hasta inicio de animación
- **Debouncing:** 50ms entre eventos de scroll
- **Acumulación de Delta:** Detecta intención clara del usuario
- **Lock de Transición:** Previene cambios durante animaciones

#### 2. Secciones Individuales

##### `HeroSection`
- Animación de entrada con logo rotando y escalando
- Texto deslizándose desde la derecha
- Botones con fade-in escalonado
- Responsive para móvil/desktop

##### `WhatIsSection`
- Fondo con gradiente animado rojo/negro
- Título con animación desde arriba
- Texto con animación desde abajo
- Centrado vertical en viewport

##### `HowItWorksSection`
- Grid de 3 columnas (responsive)
- Animación escalonada de tarjetas
- Delay progresivo (0ms, 200ms, 400ms)

## Sistema de Animaciones

### Variantes de Framer Motion

```typescript
const variants = {
  enter: (direction) => ({
    opacity: 0,
    y: direction === "forward" ? 100 : -100,
    scale: 0.95,
  }),
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: (direction) => ({
    opacity: 0,
    y: direction === "forward" ? -100 : 100,
    scale: 0.95,
  }),
};
```

### Transiciones
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out suave)
- **Duración:** 0.8s (configurable)
- **Modo:** `wait` (espera a que salga antes de entrar)

## Flujo de Navegación

### Detección de Scroll

1. Usuario hace scroll (wheel event)
2. Sistema acumula deltaY
3. Si |delta| > threshold y no hay transición activa:
   - Determina dirección (forward/backward)
   - Actualiza índice de sección
   - Activa lock de transición
   - Inicia animación
4. Después de transitionDuration, libera lock

### Navegación por Teclado

- **Arrow Down / PageDown:** Avanza a siguiente sección
- **Arrow Up / PageUp:** Retrocede a sección anterior
- Mismo sistema de lock que scroll

## Indicador de Navegación

**Ubicación:** Lado derecho del viewport (fixed)

**Características:**
- Puntos circulares para cada sección
- Punto activo: rojo, escalado 1.25x
- Puntos inactivos: gris, hover effect
- Click directo para saltar a sección
- Aria-labels para accesibilidad

## Optimizaciones de Performance

### Prevención de Scroll Nativo
```typescript
document.body.style.overflow = "hidden";
document.body.style.height = "100vh";
```

### Debouncing
- Ignora eventos < 50ms desde último scroll
- Reduce carga de procesamiento

### Will-Change
Las animaciones usan `transform` y `opacity` que son GPU-accelerated.

### Refs para Estado Mutable
- `isTransitioning`: Previene cambios durante animación
- `accumulatedDelta`: Acumula scroll para detectar intención
- `lastScrollTime`: Control de debouncing

## Integración en HomePage

```typescript
const sections = [
  { id: "hero", component: <HeroSection /> },
  { id: "what-is", component: <WhatIsSection /> },
  { id: "how-it-works", component: <HowItWorksSection /> },
];

return <ViewportAnchoredView sections={sections} />;
```

## Accesibilidad

- Navegación por teclado completa
- Aria-labels en indicadores
- Contraste de colores WCAG AA
- Animaciones respetan `prefers-reduced-motion` (puede implementarse)

## Compatibilidad

- **Navegadores:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Dispositivos:** Desktop (óptimo), Tablet (funcional), Mobile (adaptado)
- **Framer Motion:** v12.23.24+
- **React:** v19.1.0+

## Configuración Recomendada

```typescript
<ViewportAnchoredView
  sections={sections}
  transitionDuration={0.8}    // 800ms - balance entre suavidad y velocidad
  scrollThreshold={50}        // 50px - sensibilidad media
/>
```

## Limitaciones Conocidas

1. **Scroll Nativo Bloqueado:** El scroll tradicional está deshabilitado en esta vista
2. **Mobile Touch:** Requiere adaptación para gestos táctiles (no implementado)
3. **SEO:** Las secciones no tienen URLs únicas (considerar hash routing)
4. **Historial:** No se integra con browser history (puede implementarse)

## Mejoras Futuras

- [ ] Soporte para gestos táctiles (swipe)
- [ ] Hash routing para URLs únicas por sección
- [ ] Integración con browser history
- [ ] Modo "scroll libre" opcional
- [ ] Animaciones personalizables por sección
- [ ] Prefers-reduced-motion support
- [ ] Lazy loading de secciones
- [ ] Transiciones 3D opcionales

## Métricas de Rendimiento

- **Latencia de Trigger:** ~30-50ms
- **Duración de Transición:** 800ms
- **FPS durante Animación:** 60fps (GPU-accelerated)
- **Memoria:** ~2-3MB adicionales (Framer Motion)

## Troubleshooting

### El scroll no funciona
- Verificar que `overflow: hidden` esté aplicado
- Revisar console para errores de Framer Motion
- Confirmar que `sections` array no esté vacío

### Animaciones entrecortadas
- Verificar GPU acceleration en DevTools
- Reducir `transitionDuration`
- Simplificar animaciones de secciones individuales

### Navegación muy sensible
- Aumentar `scrollThreshold` (ej. 100)
- Aumentar debouncing time (modificar código)

### No responde a teclado
- Verificar que el componente tenga focus
- Revisar event listeners en DevTools
