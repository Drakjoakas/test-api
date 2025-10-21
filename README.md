# Movies Watched API

A NestJS REST API for tracking movies you've watched. Perfect for testing schema changes and test updates.

## Features

- Full CRUD operations for movies
- Input validation with class-validator
- Comprehensive unit and e2e tests
- In-memory storage (resets on restart)
- Filtering by genre, rating, and year

## Movie Schema (v1)

```typescript
{
  id: string;              // UUID, auto-generated
  title: string;           // Required, max 200 chars
  year: number;            // Required, 1888-2100
  genre: string;           // Required, max 50 chars
  rating?: number;         // Optional, 1-10
  watchDate: string;       // Required, ISO date format
  notes?: string;          // Optional, max 1000 chars
  createdAt: string;       // Auto-generated
  updatedAt: string;       // Auto-generated
}
```

## API Endpoints

### Create a Movie
```http
POST /api/movies
Content-Type: application/json

{
  "title": "The Matrix",
  "year": 1999,
  "genre": "Sci-Fi",
  "rating": 9,
  "watchDate": "2024-01-15",
  "notes": "Mind-blowing!"
}
```

### Get All Movies
```http
GET /api/movies
GET /api/movies?genre=Sci-Fi
GET /api/movies?minRating=9
GET /api/movies?year=1999
```

### Get Movie by ID
```http
GET /api/movies/:id
```

### Update Movie (Full)
```http
PUT /api/movies/:id
Content-Type: application/json

{
  "title": "The Matrix",
  "year": 1999,
  "genre": "Sci-Fi",
  "rating": 9.5,
  "watchDate": "2024-01-15",
  "notes": "Even better on second watch!"
}
```

### Update Movie (Partial)
```http
PATCH /api/movies/:id
Content-Type: application/json

{
  "rating": 9.5,
  "notes": "Updated notes"
}
```

### Delete Movie
```http
DELETE /api/movies/:id
```

## Installation

```bash
npm install
```

## Running the API

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## Future Schema Changes (for testing)

This project is designed to test handling of breaking schema changes. Planned changes:

### v2 (Non-breaking additions)
- `director: string` - Movie director
- `streamingService: string` - Where you watched it
- `rewatchCount: number` - How many times rewatched

### v3 (Breaking changes)
- `genre: string` → `genres: string[]` - Support multiple genres
- `rating: number` → `rating: { personal: number, imdb: number }` - Multiple rating sources

These changes will intentionally break tests to simulate real-world scenarios where API schema changes require test updates.

## Project Structure

```
src/
├── movies/
│   ├── dto/
│   │   ├── create-movie.dto.ts
│   │   └── update-movie.dto.ts
│   ├── entities/
│   │   └── movie.entity.ts
│   ├── movies.controller.ts
│   ├── movies.service.ts
│   ├── movies.service.spec.ts
│   └── movies.module.ts
├── app.module.ts
└── main.ts

test/
├── movies.e2e-spec.ts
└── app.e2e-spec.ts
```

## Error Responses

The API returns validation errors in this format:

```json
{
  "statusCode": 400,
  "message": [
    "rating must not be greater than 10",
    "rating must not be less than 1"
  ],
  "error": "Bad Request"
}
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
