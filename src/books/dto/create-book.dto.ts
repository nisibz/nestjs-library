import { IsString, IsInt, IsOptional, IsNotEmpty, Min } from 'class-validator';

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

  @IsInt()
  @Min(1000)
  publicationYear: number;

  @IsOptional()
  @IsString()
  coverImage?: string;
}
