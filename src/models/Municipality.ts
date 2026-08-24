export type Province = 'Huesca' | 'Zaragoza' | 'Teruel';
export type Difficulty = 1 | 2 | 3;

export interface Municipality {
  id: string;
  name: string;
  province: Province;
  comarca: string;
  latitude: number;
  longitude: number;
  difficulty: Difficulty;
  population: number;
  populationYear: number;
  funFact?: string;
}
