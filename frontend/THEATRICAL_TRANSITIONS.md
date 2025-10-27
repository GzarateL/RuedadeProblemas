# 🎭 Theatrical Transitions - Guía de Uso

## ✨ Implementación Completada

Tu proyecto ahora tiene transiciones cinematográficas teatrales que se activan **solo al cambiar de página/ruta**.

---

## 🎬 Cómo Funciona

### Transiciones Automáticas
Las transiciones ya están configuradas globalmente en `layout.tsx`. **No necesitas hacer nada adicional** en tus páginas.

Cada vez que navegues entre rutas:
1. La página actual se desvanece con blur (como bajar las luces del escenario)
2. La nueva página aparece con fade-in suave (como subir las luces)
3. **No hay animaciones al hacer scroll** - el scroll es natural

### Ejemplo de Navegación
```tsx
import Link from 'next/link';

// Esto activará la transición teatral automáticamente
<Link href="/registro">
  <button>Ir a Registro</button>
</Link>
```

---

## 🎨 Estilos Cinematográficos Disponibles

### 1. Clases CSS Teatrales

#### Texto con Brillo Suave
```tsx
<h1 className="theatrical-text">
  Título con efecto de escenario
</h1>
```

#### Color de Acento (#E02020)
```tsx
<span className="theatrical-accent">Texto destacado</span>
<button className="theatrical-accent-bg">Botón destacado</button>
```

#### Tarjetas con Efecto Spotlight
```tsx
<div className="theatrical-card p-6 rounded-lg">
  <h2>Contenido de la tarjeta</h2>
  <p>Con efecto de iluminación al hover</p>
</div>
```

#### Efecto de Foco (Spotlight)
```tsx
<div className="spotlight-focus p-8">
  <h2>Contenido con spotlight</h2>
  <p>Se ilumina sutilmente al pasar el mouse</p>
</div>
```

---

## 🖼️ Componente de Imagen Flotante (Opcional)

Para imágenes que quieras que floten sutilmente:

```tsx
import { TheatricalImage } from '@/components/TheatricalImage';

// Imagen normal (sin flotación)
<TheatricalImage 
  src="/imagen.jpg" 
  alt="Descripción"
  width={500}
  height={300}
/>

// Imagen con flotación suave
<TheatricalImage 
  src="/imagen.jpg" 
  alt="Descripción"
  width={500}
  height={300}
  float={true}  // Activa la animación flotante
/>
```

---

## 🎭 Paleta de Colores Cinematográfica

```css
/* Fondo */
background: linear-gradient(135deg, #0B0B0B 0%, #111111 100%);

/* Texto principal */
color: #FFFFFF;
text-shadow: 0 0 18px rgba(255,255,255,0.08);

/* Acento */
color: #E02020;

/* Tarjetas */
background: rgba(17, 17, 17, 0.8);
border: 1px solid rgba(255, 255, 255, 0.05);
```

---

## 📝 Ejemplos de Uso

### Página de Inicio Teatral
```tsx
export default function HomePage() {
  return (
    <div className="min-h-screen p-8">
      <div className="spotlight-focus max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold theatrical-text mb-6">
          Bienvenido al Escenario
        </h1>
        
        <div className="theatrical-card p-8 mb-6">
          <h2 className="text-2xl mb-4">Contenido Principal</h2>
          <p className="text-gray-300">
            Este contenido tiene el efecto de tarjeta teatral
          </p>
        </div>

        <TheatricalImage 
          src="/hero.jpg"
          alt="Imagen principal"
          width={800}
          height={400}
          float={true}
          className="rounded-lg"
        />
      </div>
    </div>
  );
}
```

### Botón con Acento
```tsx
<button className="theatrical-accent-bg text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all">
  Acción Principal
</button>
```

### Card Grid Teatral
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {items.map(item => (
    <div key={item.id} className="theatrical-card p-6 rounded-lg">
      <h3 className="text-xl mb-2">{item.title}</h3>
      <p className="text-gray-400">{item.description}</p>
    </div>
  ))}
</div>
```

---

## ⚙️ Configuración de Transiciones

Las transiciones están configuradas en `TheatricalTransition.tsx`:

```tsx
transition={{
  duration: 0.55,           // Duración de la transición
  ease: [0.22, 1, 0.36, 1] // Curva de suavizado teatral
}}
```

Si quieres ajustar la velocidad, edita estos valores en:
`frontend/src/components/TheatricalTransition.tsx`

---

## 🚫 Lo que NO Hace

- ❌ No anima elementos al hacer scroll
- ❌ No tiene efectos de parallax
- ❌ No tiene animaciones de entrada de secciones
- ❌ No interfiere con el scroll natural

**Solo anima las transiciones entre páginas/rutas.**

---

## 🎯 Filosofía de Diseño

### Como un Teatro
- **Cambio de escena**: Suave, elegante, sin distracciones
- **Iluminación**: Spotlight sutil en elementos importantes
- **Espacio**: Mucho espacio negativo, como un escenario
- **Foco**: La atención se guía, no se arrastra

### No Como UI Tradicional
- Sin sliding
- Sin swiping
- Sin scaling/popping
- Sin animaciones excesivas

---

## 🔧 Troubleshooting

### Las transiciones no funcionan
1. Verifica que `framer-motion` esté instalado:
   ```bash
   npm list framer-motion
   ```

2. Asegúrate de que el layout incluye `PageTransitionProvider`

3. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Las transiciones son muy lentas/rápidas
Edita `duration` en `TheatricalTransition.tsx`:
```tsx
transition={{
  duration: 0.55, // Ajusta este valor (en segundos)
  ease: [0.22, 1, 0.36, 1]
}}
```

### Quiero deshabilitar en una página específica
Las transiciones son globales, pero puedes crear un layout específico sin el provider para páginas que no quieras que tengan transiciones.

---

## 📊 Performance

- ✅ **Optimizado**: Solo anima al cambiar de ruta
- ✅ **GPU Accelerated**: Usa `filter: blur()` y `opacity`
- ✅ **No bloquea**: `AnimatePresence mode="wait"` evita conflictos
- ✅ **Ligero**: Framer Motion es eficiente

---

## 🎨 Personalización Avanzada

### Cambiar el Efecto de Blur
En `TheatricalTransition.tsx`:
```tsx
initial={{ opacity: 0, filter: "blur(12px)" }}  // Más blur
initial={{ opacity: 0, filter: "blur(6px)" }}   // Menos blur
```

### Agregar Efecto de Escala (Opcional)
```tsx
initial={{ opacity: 0, filter: "blur(12px)", scale: 0.98 }}
animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
exit={{ opacity: 0, filter: "blur(12px)", scale: 0.98 }}
```

### Cambiar la Curva de Easing
```tsx
ease: [0.22, 1, 0.36, 1]  // Teatral (actual)
ease: "easeInOut"          // Suave estándar
ease: [0.4, 0, 0.2, 1]    // Material Design
```

---

## ✅ Checklist de Implementación

- ✅ Framer Motion instalado
- ✅ `TheatricalTransition.tsx` creado
- ✅ `PageTransitionProvider.tsx` creado
- ✅ Layout actualizado con el provider
- ✅ CSS cinematográfico agregado
- ✅ Componente `TheatricalImage` disponible
- ✅ Documentación completa

---

## 🎭 ¡Disfruta las Transiciones Teatrales!

Tu aplicación ahora tiene transiciones elegantes y cinematográficas que hacen que cada cambio de página se sienta como un cambio de escena en un teatro.

**Recuerda**: Las transiciones son automáticas. Solo navega entre páginas y disfruta el efecto.
