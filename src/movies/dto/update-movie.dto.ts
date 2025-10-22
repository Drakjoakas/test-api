import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsDateString,
  MaxLength,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

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
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  genres?: string[]; // Changed from single genre to array

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
