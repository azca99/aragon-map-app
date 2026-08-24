/**
 * Calcula la puntuación obtenida en función de la distancia al objetivo.
 * Se utiliza una campana de Gauss adaptada a la escala de Aragón, donde:
 * - 0 km -> 5000 pts
 * - 1 km -> ~4998 pts
 * - 5 km -> ~4961 pts (muy alta)
 * - 10 km -> ~4846 pts (alta)
 * - 25 km -> ~4112 pts (buena)
 * - 50 km -> ~2288 pts (penalizada, a medio camino)
 * - 100 km -> ~219 pts (baja)
 * - 200 km -> ~0 pts (muy baja)
 * 
 * @param distanceKm Distancia en kilómetros entre la respuesta y la ubicación real
 * @returns Puntuación entera entre 0 y 5000
 */
export function calculateScore(distanceKm: number): number {
  const MAX_SCORE = 5000;
  const C = 40; // Parámetro que controla la caída de la curva (a mayor valor, es más permisivo)
  
  const score = MAX_SCORE * Math.exp(-(distanceKm * distanceKm) / (2 * C * C));
  
  return Math.round(score);
}
