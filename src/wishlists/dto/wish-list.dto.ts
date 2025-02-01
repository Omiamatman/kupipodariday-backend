import { IsString, Length, IsUrl, IsArray, IsOptional } from 'class-validator';
import { UserPublicProfileResponseDto } from 'src/users/dto/user-public-profile-response.dto';
import { WishPartialDto } from 'src/wishes/dto/wish-partial.dto';

export class WishlistDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  @IsOptional()
  image: string;

  owner: UserPublicProfileResponseDto;

  @IsArray()
  items: WishPartialDto[];
}
