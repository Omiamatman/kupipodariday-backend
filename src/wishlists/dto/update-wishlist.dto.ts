import { IsOptional, IsString, IsArray, Length, IsUrl } from 'class-validator';

export class UpdateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsArray()
  itemsId: number[];

  @Length(1, 1500)
  @IsOptional()
  description: string;
}
