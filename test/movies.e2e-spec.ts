/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import type { Response } from 'supertest';

describe('Movies API (e2e)', () => {
  let app: INestApplication;
  let createdMovieId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/movies', () => {
    it('should create a new movie', () => {
      return request(app.getHttpServer())
        .post('/api/movies')
        .send({
          title: 'The Matrix',
          year: 1999,
          genre: 'Sci-Fi',
          rating: 9,
          watchDate: '2024-01-15',
          notes: 'Mind-blowing!',
        })
        .expect(201)
        .expect((res: Response) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
          expect(res.body.title).toBe('The Matrix');
          expect(res.body.year).toBe(1999);
          expect(res.body.genre).toBe('Sci-Fi');
          expect(res.body.rating).toBe(9);
          expect(res.body.watchDate).toBe('2024-01-15');
          expect(res.body.notes).toBe('Mind-blowing!');
          createdMovieId = res.body.id;
        });
    });

    it('should create a movie without optional fields', () => {
      return request(app.getHttpServer())
        .post('/api/movies')
        .send({
          title: 'Inception',
          year: 2010,
          genre: 'Sci-Fi',
          watchDate: '2024-02-01',
        })
        .expect(201)
        .expect((res: Response) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Inception');
          expect(res.body.rating).toBeUndefined();
          expect(res.body.notes).toBeUndefined();
        });
    });

    it('should return 400 for invalid rating (too high)', () => {
      return request(app.getHttpServer())
        .post('/api/movies')
        .send({
          title: 'Test Movie',
          year: 2020,
          genre: 'Action',
          rating: 15,
          watchDate: '2024-01-01',
        })
        .expect(400);
    });

    it('should return 400 for invalid rating (too low)', () => {
      return request(app.getHttpServer())
        .post('/api/movies')
        .send({
          title: 'Test Movie',
          year: 2020,
          genre: 'Action',
          rating: 0,
          watchDate: '2024-01-01',
        })
        .expect(400);
    });

    it('should return 400 for missing required fields', () => {
      return request(app.getHttpServer())
        .post('/api/movies')
        .send({
          title: 'Test Movie',
        })
        .expect(400);
    });

    it('should return 400 for invalid year (too old)', () => {
      return request(app.getHttpServer())
        .post('/api/movies')
        .send({
          title: 'Test Movie',
          year: 1800,
          genre: 'Drama',
          watchDate: '2024-01-01',
        })
        .expect(400);
    });

    it('should return 400 for invalid watchDate format', () => {
      return request(app.getHttpServer())
        .post('/api/movies')
        .send({
          title: 'Test Movie',
          year: 2020,
          genre: 'Action',
          watchDate: 'invalid-date',
        })
        .expect(400);
    });
  });

  describe('GET /api/movies', () => {
    beforeAll(async () => {
      // Clean up and add test movies
      await request(app.getHttpServer()).post('/api/movies').send({
        title: 'The Godfather',
        year: 1972,
        genre: 'Crime',
        rating: 10,
        watchDate: '2024-03-01',
      });
    });

    it('should return all movies', () => {
      return request(app.getHttpServer())
        .get('/api/movies')
        .expect(200)
        .expect((res: Response) => {
          expect(res.body).toHaveProperty('movies');
          expect(res.body).toHaveProperty('total');
          expect(Array.isArray(res.body.movies)).toBe(true);
          expect(res.body.movies.length).toBeGreaterThan(0);
        });
    });

    it('should filter movies by genre', () => {
      return request(app.getHttpServer())
        .get('/api/movies?genre=Sci-Fi')
        .expect(200)
        .expect((res: Response) => {
          expect(res.body.movies.every((m) => m.genre === 'Sci-Fi')).toBe(true);
        });
    });

    it('should filter movies by minimum rating', () => {
      return request(app.getHttpServer())
        .get('/api/movies?minRating=9')
        .expect(200)
        .expect((res: Response) => {
          expect(res.body.movies.every((m) => m.rating >= 9)).toBe(true);
        });
    });

    it('should filter movies by year', () => {
      return request(app.getHttpServer())
        .get('/api/movies?year=1999')
        .expect(200)
        .expect((res: Response) => {
          expect(res.body.movies.every((m) => m.year === 1999)).toBe(true);
        });
    });

    it('should apply multiple filters', () => {
      return request(app.getHttpServer())
        .get('/api/movies?genre=Sci-Fi&minRating=9')
        .expect(200)
        .expect((res: Response) => {
          expect(
            res.body.movies.every((m) => m.genre === 'Sci-Fi' && m.rating >= 9),
          ).toBe(true);
        });
    });
  });

  describe('GET /api/movies/:id', () => {
    it('should return a movie by id', () => {
      return request(app.getHttpServer())
        .get(`/api/movies/${createdMovieId}`)
        .expect(200)
        .expect((res: Response) => {
          expect(res.body.id).toBe(createdMovieId);
          expect(res.body).toHaveProperty('title');
        });
    });

    it('should return 404 for non-existent movie', () => {
      return request(app.getHttpServer())
        .get('/api/movies/non-existent-id')
        .expect(404);
    });
  });

  describe('PUT /api/movies/:id', () => {
    it('should update a movie completely', () => {
      return request(app.getHttpServer())
        .put(`/api/movies/${createdMovieId}`)
        .send({
          title: 'The Matrix Reloaded',
          year: 2003,
          genre: 'Sci-Fi',
          rating: 7.5,
          watchDate: '2024-01-20',
          notes: 'Sequel',
        })
        .expect(200)
        .expect((res: Response) => {
          expect(res.body?.id).toBe(createdMovieId);
          expect(res.body?.title).toBe('The Matrix Reloaded');
          expect(res.body?.year).toBe(2003);
          expect(res.body?.rating).toBe(7.5);
        });
    });

    it('should return 404 for non-existent movie', () => {
      return request(app.getHttpServer())
        .put('/api/movies/non-existent-id')
        .send({
          title: 'Test',
          year: 2020,
          genre: 'Action',
          watchDate: '2024-01-01',
        })
        .expect(404);
    });
  });

  describe('PATCH /api/movies/:id', () => {
    it('should partially update a movie', () => {
      return request(app.getHttpServer())
        .patch(`/api/movies/${createdMovieId}`)
        .send({
          rating: 8,
          notes: 'Updated notes again',
        })
        .expect(200)
        .expect((res: Response) => {
          expect(res.body.id).toBe(createdMovieId);
          expect(res.body.rating).toBe(8);
          expect(res.body.notes).toBe('Updated notes again');
          // Title should be preserved from PUT operation
          expect(res.body.title).toBeDefined();
          expect(res.body.year).toBe(2003);
        });
    });

    it('should return 404 for non-existent movie', () => {
      return request(app.getHttpServer())
        .patch('/api/movies/non-existent-id')
        .send({
          rating: 5,
        })
        .expect(404);
    });
  });

  describe('DELETE /api/movies/:id', () => {
    it('should delete a movie', () => {
      return request(app.getHttpServer())
        .delete(`/api/movies/${createdMovieId}`)
        .expect(204);
    });

    it('should return 404 when trying to get deleted movie', () => {
      return request(app.getHttpServer())
        .get(`/api/movies/${createdMovieId}`)
        .expect(404);
    });

    it('should return 404 for non-existent movie', () => {
      return request(app.getHttpServer())
        .delete('/api/movies/non-existent-id')
        .expect(404);
    });
  });
});
