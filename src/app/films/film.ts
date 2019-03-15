/* Defines the film entity */
export interface Film {
  id: number;
  filmName: string;
  filmCode: string;
  category: string;
  acteurs?: string[];
  releaseDate: string;
  price: number;
  description: string;
  starRating: number;
  imageUrl: string;
}

export interface FilmResolved {
  film: Film;
  error?: any;
}
