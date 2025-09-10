import { IsString, IsInt, IsOptional, IsNotEmpty, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  isbn: string;

  @Transform(({ value }) => parseInt(String(value), 10))
  @IsInt()
  @Min(1000)
  publicationYear: number;

  @IsOptional()
  @IsString()
  coverImage?: string;
}
