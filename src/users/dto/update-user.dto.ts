import { IsOptional, IsString, IsEmail, Length, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @Length(1, 64)
  @IsString()
  @IsOptional()
  username: string;

  @Length(1, 200)
  @IsOptional()
  about: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @Length(2, 100)
  @IsOptional()
  password: string;
}
