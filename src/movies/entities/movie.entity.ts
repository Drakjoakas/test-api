export class Movie {
  id: string;
  title: string;
  year: number;
  genre: string;
  rating?: number;
  watchDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;

  constructor(partial: Partial<Movie>) {
    Object.assign(this, partial);
  }
}
