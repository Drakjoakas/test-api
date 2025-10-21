import { IsString, IsNumber, IsOptional, Min, Max, IsDateString, MaxLength } from 'class-validator';

export class UpdateMovieDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsNumber()
  @Min(1888)
  @Max(2100)
  year?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  genre?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  rating?: number;

  @IsOptional()
  @IsDateString()
  watchDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
