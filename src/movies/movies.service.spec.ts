import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a movie', () => {
      const createMovieDto: CreateMovieDto = {
        title: 'The Matrix',
        year: 1999,
        genre: 'Sci-Fi',
        rating: 9,
        watchDate: '2024-01-15',
        notes: 'Mind-blowing!',
      };

      const movie = service.create(createMovieDto);

      expect(movie).toHaveProperty('id');
      expect(movie).toHaveProperty('createdAt');
      expect(movie).toHaveProperty('updatedAt');
      expect(movie.title).toBe('The Matrix');
      expect(movie.year).toBe(1999);
      expect(movie.genre).toBe('Sci-Fi');
      expect(movie.rating).toBe(9);
      expect(movie.watchDate).toBe('2024-01-15');
      expect(movie.notes).toBe('Mind-blowing!');
    });

    it('should create a movie without optional fields', () => {
      const createMovieDto: CreateMovieDto = {
        title: 'Inception',
        year: 2010,
        genre: 'Sci-Fi',
        watchDate: '2024-02-01',
      };

      const movie = service.create(createMovieDto);

      expect(movie).toHaveProperty('id');
      expect(movie.title).toBe('Inception');
      expect(movie.rating).toBeUndefined();
      expect(movie.notes).toBeUndefined();
    });
  });

  describe('findAll', () => {
    beforeEach(() => {
      service.create({
        title: 'The Matrix',
        year: 1999,
        genre: 'Sci-Fi',
        rating: 9,
        watchDate: '2024-01-15',
      });
      service.create({
        title: 'Inception',
        year: 2010,
        genre: 'Sci-Fi',
        rating: 8.5,
        watchDate: '2024-02-01',
      });
      service.create({
        title: 'The Godfather',
        year: 1972,
        genre: 'Crime',
        rating: 10,
        watchDate: '2024-03-01',
      });
    });

    it('should return all movies', () => {
      const result = service.findAll();
      expect(result.movies).toHaveLength(3);
      expect(result.total).toBe(3);
    });

    it('should filter movies by genre', () => {
      const result = service.findAll({ genre: 'Sci-Fi' });
      expect(result.movies).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.movies.every((m) => m.genre === 'Sci-Fi')).toBe(true);
    });

    it('should filter movies by minimum rating', () => {
      const result = service.findAll({ minRating: 9 });
      expect(result.movies).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.movies.every((m) => m.rating! >= 9)).toBe(true);
    });

    it('should filter movies by year', () => {
      const result = service.findAll({ year: 1999 });
      expect(result.movies).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.movies[0].title).toBe('The Matrix');
    });

    it('should apply multiple filters', () => {
      const result = service.findAll({ genre: 'Sci-Fi', minRating: 9 });
      expect(result.movies).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.movies[0].title).toBe('The Matrix');
    });
  });

  describe('findOne', () => {
    it('should return a movie by id', () => {
      const created = service.create({
        title: 'The Matrix',
        year: 1999,
        genre: 'Sci-Fi',
        watchDate: '2024-01-15',
      });

      const found = service.findOne(created.id);
      expect(found).toEqual(created);
    });

    it('should throw NotFoundException when movie not found', () => {
      expect(() => service.findOne('non-existent-id')).toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const created = service.create({
        title: 'The Matrix',
        year: 1999,
        genre: 'Sci-Fi',
        watchDate: '2024-01-15',
      });

      // Small delay to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updateMovieDto: UpdateMovieDto = {
        rating: 9.5,
        notes: 'Even better on second watch!',
      };

      const updated = service.update(created.id, updateMovieDto);

      expect(updated.id).toBe(created.id);
      expect(updated.rating).toBe(9.5);
      expect(updated.notes).toBe('Even better on second watch!');
      expect(updated.title).toBe('The Matrix');
      expect(updated.updatedAt).not.toBe(created.updatedAt);
    });

    it('should throw NotFoundException when movie not found', () => {
      expect(() => service.update('non-existent-id', { rating: 5 })).toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a movie', () => {
      const created = service.create({
        title: 'The Matrix',
        year: 1999,
        genre: 'Sci-Fi',
        watchDate: '2024-01-15',
      });

      service.remove(created.id);

      expect(() => service.findOne(created.id)).toThrow(NotFoundException);
    });

    it('should throw NotFoundException when movie not found', () => {
      expect(() => service.remove('non-existent-id')).toThrow(NotFoundException);
    });
  });
});
