export class Movie {
  id: string;
  title: string;
  year: number;
  genres: string[]; // Changed from single genre to array of genres
  rating?: number;
  watchDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;

  constructor(partial: Partial<Movie>) {
    Object.assign(this, partial);
  }
}
