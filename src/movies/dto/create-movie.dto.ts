import { IsString, IsNumber, IsOptional, Min, Max, IsDateString, MaxLength } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsNumber()
  @Min(1888)
  @Max(2100)
  year: number;

  @IsString()
  @MaxLength(50)
  genre: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  rating?: number;

  @IsDateString()
  watchDate: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
