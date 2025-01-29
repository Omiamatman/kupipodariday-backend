import { IsOptional, IsString, IsArray, Length, IsUrl } from 'class-validator';

export class UpdateWishlistDto {
  @IsString()
  @Length(1, 250)
  @IsOptional()
  name: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  image: string;

  @IsArray()
  @IsOptional()
  itemsId: number[];

  @Length(1, 1500)
  @IsOptional()
  description: string;
}
