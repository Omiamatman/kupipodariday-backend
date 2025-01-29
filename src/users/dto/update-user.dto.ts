import {
  IsOptional,
  MinLength,
  IsString,
  IsEmail,
  Length,
  IsUrl,
} from 'class-validator';

export class UpdateUserDto {
  @Length(2, 30)
  @IsString()
  @IsOptional()
  username: string;

  @Length(2, 200)
  @IsOptional()
  about: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(5)
  @IsOptional()
  password: string;
}
