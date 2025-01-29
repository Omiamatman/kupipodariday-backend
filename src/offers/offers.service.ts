import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number) {
    const { amount, itemId } = createOfferDto;

    const owner = await this.userRepository.findOneBy({ id: userId });
    const wish = await this.wishRepository.findOne({
      where: { id: itemId },
      relations: ['owner', 'offers'],
    });

    if (userId === wish.owner.id) {
      throw new ForbiddenException('You cannot contribute to your own gift');
    }

    const raised = wish.raised + amount;
    if (raised > wish.price) {
      throw new BadRequestException('The offer amount exceeds the gift price');
    }
    wish.raised += amount;

    await this.wishRepository.update(itemId, { raised: raised });

    return this.offerRepository.save({
      ...createOfferDto,
      owner: owner,
      item: wish,
    });
  }

  findAll() {
    return this.offerRepository.find({
      relations: {
        user: true,
        item: true,
      },
    });
  }

  findOne(id: number) {
    return this.offerRepository.findOneBy({ id });
  }
}
