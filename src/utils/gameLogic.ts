import { Municipality } from '../models/Municipality';
import { MUNICIPALITIES } from '../data/municipalities';

/**
 * Mezcla un array aleatoriamente (algoritmo Fisher-Yates).
 */
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Selecciona una muestra aleatoria de tamaño 'count' de un array.
 */
function getRandomSample<T>(array: T[], count: number): T[] {
  return shuffleArray(array).slice(0, count);
}

/**
 * Genera una partida equilibrada de 10 municipios:
 * - 3 de dificultad 1
 * - 4 de dificultad 2
 * - 3 de dificultad 3
 * Y devuelve el array mezclado para que el orden sea aleatorio.
 */
export function generateGameMunicipalities(): Municipality[] {
  const easy = MUNICIPALITIES.filter(m => m.difficulty === 1);
  const medium = MUNICIPALITIES.filter(m => m.difficulty === 2);
  const hard = MUNICIPALITIES.filter(m => m.difficulty === 3);

  const selectedEasy = getRandomSample(easy, 3);
  const selectedMedium = getRandomSample(medium, 4);
  const selectedHard = getRandomSample(hard, 3);

  const combined = [...selectedEasy, ...selectedMedium, ...selectedHard];
  
  // Mezclamos para que el jugador no sepa cuándo le toca un fácil o difícil
  return shuffleArray(combined);
}
