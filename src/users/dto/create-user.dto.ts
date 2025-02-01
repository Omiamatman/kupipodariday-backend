import {
  IsOptional,
  MinLength,
  IsString,
  IsEmail,
  Length,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  @Length(1, 64)
  @IsString()
  username: string;

  @Length(1, 200)
  @IsOptional()
  about: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}
