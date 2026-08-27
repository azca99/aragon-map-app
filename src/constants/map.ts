// Constantes para el comportamiento del mapa
export const ARAGON_CENTER: [number, number] = [-0.65, 41.45]; 
export const INITIAL_ZOOM = 6.3;
export const INITIAL_PITCH = 0;
export const INITIAL_BEARING = 0;

// Límites absolutos de navegación (west, south, east, north)
// Coinciden de cerca con la vista inicial, impidiendo desplazar el mapa fuera de este recuadro.
export const MAP_MAX_BOUNDS: [number, number, number, number] = [-2.75, 39.65, 1.45, 43.25];

// Zoom mínimo igual al inicial para impedir alejarse más
export const MAP_MIN_ZOOM = 6.3;

// Margen de seguridad para fitBounds (evitar crashes OpenGL en distancias cortas)
export const FIT_BOUNDS_MARGIN = 0.15; // grados
