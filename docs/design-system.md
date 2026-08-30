# Design System V1 - ¿Dónde está? Aragón

Esta guía documenta las decisiones fundamentales de diseño (V1/V1.1) aplicadas a la aplicación. 
El objetivo es mantener una estética cartográfica, contemporánea, elegante y cálida, ligada al territorio pero sin recurrir a tópicos excesivos o infantiles.

## 1. Colores (Semántica)

Centralizados en src/theme/theme.ts.

- **Primario (Terracota - #B84A32)**: Identidad principal de la app. Usado en botones de acción principal, límite administrativo de Aragón en el mapa y marcador del jugador (nuestra "chincheta").
- **Primario Oscuro (#8F3426)**: Usado para detalles de contraste, como la línea discontinua de resultado en el mapa o sombras de botones.
- **Secundario (Verde Monte - #53685A)**: Color de apoyo, usado sutilmente en el patrón topográfico de fondo.
- **Éxito (#477A5A)**: Usado para feedback positivo, marcador de la ubicación correcta en el mapa, y puntuaciones altas (>4000 pts).
- **Acento (Ocre - #D39A3A)**: Usado para puntuaciones intermedias o avisos neutros.
- **Error (#D2382D)**: Usado para puntuaciones muy bajas o estados negativos.
- **Superficie (#FCFAF5) / Fondo (#F5F1E8)**: Tonos marfil/crema que simulan papel cartográfico para las tarjetas y fondos de pantalla.

## 2. Tipografía

La aplicación utiliza la familia **Manrope** de Google Fonts para un aspecto geométrico moderno pero legible.

- **Display**: 32px / ExtraBold (800) - Títulos principales.
- **H1**: 22px / Bold (700) - Nombres de municipios en tarjetas.
- **H2**: 18px / SemiBold (600) - Subtítulos y valoraciones.
- **Body**: 14px / Regular (400) - Texto estándar.
- **Caption**: 12px / Regular (400) - Metadatos (población, etc.).
- **Data**: 24px-36px / ExtraBold (800) - Puntos y kilómetros.

## 3. Elementos Visuales y UI

### Espaciado y Radios
- Espaciado basado en una escala de múltiplos: 4, 8, 16, 24, 32.
- Radios de borde sutiles y modernos: pequeño (6px), medio (10px, botones), grande (16px, tarjetas principales). No usamos diseños de "píldora" completa (cápsula) en botones.

### Sombras
- Sombras muy suaves (opacidad del 5% al 15%). La jerarquía se define más por el uso del color de superficie (#FCFAF5) sobre el fondo (#F5F1E8) y un borde sutil piedra (#D7D0C3).

### Patrón Topográfico (TopoPattern.tsx)
- Un fondo de curvas de nivel creado mediante SVG.
- Extremadamente sutil (6% de opacidad).
- Aparece en la Home y en el encabezado de la pantalla final de partida para dar textura cartográfica sin entorpecer la legibilidad.

## 4. Diseño del Mapa (MapLibre)
- **Frontera de Aragón**: Terracota sólido, 2px.
- **Máscara Exterior**: Polígono que atenúa todo el territorio fuera de Aragón con un 15% de blanco/superficie, dejando ver carreteras y relieve pero focalizando el juego.
- **Línea de resultado**: Terracota oscuro, punteada (2-2), 2.5px.
- **Bloqueo de Cámara**: A zoom mínimo (6.3), la cámara está anclada para impedir que el jugador pierda de vista el marco territorial. Solo se permite el paneo (dragPan) cuando el usuario hace zoom hacia adentro, pero siempre restringido por la bounding box (MAP_MAX_BOUNDS).