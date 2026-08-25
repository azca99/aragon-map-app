// Constantes para el comportamiento del mapa
export const ARAGON_CENTER: [number, number] = [-0.66, 41.6]; // Aproximadamente el centro de Aragón
export const INITIAL_ZOOM = 6.5;
export const INITIAL_PITCH = 0;
export const INITIAL_BEARING = 0;

// Límites geográficos (Bounding Box) para restringir el movimiento de la cámara
// west, south, east, north
// Permite ver las comunidades vecinas (Navarra, Rioja, Cataluña, Valencia) pero bloquea el resto.
export const MAP_MAX_BOUNDS: [number, number, number, number] = [-2.8, 39.5, 1.5, 43.5];

// Zoom mínimo para evitar que el usuario se aleje demasiado
export const MAP_MIN_ZOOM = 6.0;

// Margen de seguridad para fitBounds (evitar crashes OpenGL en distancias cortas)
export const FIT_BOUNDS_MARGIN = 0.15; // grados (aprox 15km)
