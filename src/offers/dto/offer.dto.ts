import { UserPublicProfileResponseDto } from 'src/users/dto/user-public-profile-response.dto';

export class OfferDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  item: string;

  amount: number;
  hidden: boolean;

  user: UserPublicProfileResponseDto;
}
