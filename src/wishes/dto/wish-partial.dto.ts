import { IsString, IsUrl, IsNumber, Min, Length } from 'class-validator';

export class WishPartialDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  @Min(1)
  price: number;

  @IsNumber()
  @Min(1)
  raised: number;

  copied: number;

  @IsString()
  @Length(1, 1024)
  description: string;
}
