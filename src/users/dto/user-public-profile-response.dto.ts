import { IsString, Length, IsUrl } from 'class-validator';

export class UserPublicProfileResponseDto {
  id: number;

  @IsString()
  @Length(1, 64)
  username: string;

  @IsString()
  @Length(1, 200)
  about: string;

  @IsUrl()
  avatar: string;

  createdAt: Date;
  updatedAt: Date;
}
