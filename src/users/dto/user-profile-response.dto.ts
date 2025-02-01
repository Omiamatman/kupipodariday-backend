import { IsString, Length, IsUrl, IsEmail } from 'class-validator';

export class UserProfileResponseDto {
  id: number;

  @IsString()
  @Length(1, 64)
  username: string;

  @IsString()
  @Length(1, 200)
  about: string;

  @IsUrl()
  avatar: string;

  @IsEmail()
  email: string;

  createdAt: Date;

  updatedAt: Date;
}
