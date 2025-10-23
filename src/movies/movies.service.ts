import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class MoviesService {
  private movies: Movie[] = [];

  create(createMovieDto: CreateMovieDto): Movie {
    const now = new Date().toISOString();
    const movie = new Movie({
      id: randomUUID(),
      ...createMovieDto,
      createdAt: now,
      updatedAt: now,
    });
    this.movies.push(movie);
    return movie;
  }

  findAll(filters?: { genre?: string; minRating?: number; year?: number }): {
    movies: Movie[];
    total: number;
  } {
    let filteredMovies = this.movies;

    if (filters?.genre) {
      filteredMovies = filteredMovies.filter((movie) =>
        movie.genres.some(
          (g) => g.toLowerCase() === filters.genre!.toLowerCase(),
        ),
      );
    }

    if (filters?.minRating !== undefined) {
      filteredMovies = filteredMovies.filter(
        (movie) => movie.rating && movie.rating >= filters.minRating!,
      );
    }

    if (filters?.year !== undefined) {
      filteredMovies = filteredMovies.filter(
        (movie) => movie.year === filters.year!,
      );
    }

    return {
      movies: filteredMovies,
      total: filteredMovies.length,
    };
  }

  findOne(id: string): Movie {
    const movie = this.movies.find((m) => m.id === id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  update(id: string, updateMovieDto: UpdateMovieDto): Movie {
    const movieIndex = this.movies.findIndex((m) => m.id === id);
    if (movieIndex === -1) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    // Only update fields that are defined in the DTO
    const updateData: Partial<UpdateMovieDto> = {};
    for (const [key, value] of Object.entries(updateMovieDto)) {
      if (value !== undefined) {
        (updateData as Record<string, unknown>)[key] = value;
      }
    }

    const updatedMovie = new Movie({
      ...this.movies[movieIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    this.movies[movieIndex] = updatedMovie;
    return updatedMovie;
  }

  remove(id: string): void {
    const movieIndex = this.movies.findIndex((m) => m.id === id);
    if (movieIndex === -1) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    this.movies.splice(movieIndex, 1);
  }
}
