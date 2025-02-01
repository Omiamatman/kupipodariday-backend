import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { OfferDto } from './dto/offer.dto';

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

  async create(
    createOfferDto: CreateOfferDto,
    userId: number,
  ): Promise<object> {
    const { amount, itemId } = createOfferDto;
    const owner = await this.userRepository.findOneBy({ id: userId });
    const wish = await this.wishRepository.findOne({
      where: { id: itemId },
      relations: ['owner', 'offers'],
    });

    if (!owner || !wish) {
      throw new NotFoundException('Owner or Wish not found');
    }

    if (userId === wish.owner.id) {
      throw new ForbiddenException('You cannot contribute to your own gift');
    }

    const raised = wish.raised + amount;
    if (raised > wish.price) {
      throw new BadRequestException('The offer amount exceeds the gift price');
    }

    wish.raised += amount;
    await this.wishRepository.update(itemId, { raised: raised });

    const offer = this.offerRepository.create({
      ...createOfferDto,
      user: owner,
      item: wish,
    });

    await this.offerRepository.save(offer);

    return {};
  }

  async findAll(): Promise<OfferDto[]> {
    const offers = await this.offerRepository.find({
      relations: {
        user: true,
        item: true,
      },
    });

    return offers.map((offer) => ({
      id: offer.id,
      createdAt: offer.createdAt,
      updatedAt: offer.updatedAt,
      item: offer.item.name,
      amount: offer.amount,
      hidden: offer.hidden,
      user: {
        id: offer.user.id,
        username: offer.user.username,
        about: offer.user.about,
        avatar: offer.user.avatar,
        createdAt: offer.user.createdAt,
        updatedAt: offer.user.updatedAt,
      },
    })) as OfferDto[];
  }

  async findOne(id: number): Promise<OfferDto> {
    const offer = await this.offerRepository.findOne({
      where: { id: id },
      relations: {
        user: true,
        item: true,
      },
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return {
      id: offer.id,
      createdAt: offer.createdAt,
      updatedAt: offer.updatedAt,
      item: offer.item.name,
      amount: offer.amount,
      hidden: offer.hidden,
      user: {
        id: offer.user.id,
        username: offer.user.username,
        about: offer.user.about,
        avatar: offer.user.avatar,
        createdAt: offer.user.createdAt,
        updatedAt: offer.user.updatedAt,
      },
    } as OfferDto;
  }

  async update(
    id: number,
    updateOfferDto: UpdateOfferDto,
    userId: number,
  ): Promise<OfferDto> {
    const offer = await this.offerRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    if (offer.user.id !== userId) {
      throw new ForbiddenException('You cant edit other peoples offers');
    }

    await this.offerRepository.update(id, updateOfferDto);

    const updatedOffer = await this.offerRepository.findOne({
      where: { id: id },
      relations: {
        user: true,
        item: true,
      },
    });

    return {
      id: updatedOffer.id,
      createdAt: updatedOffer.createdAt,
      updatedAt: updatedOffer.updatedAt,
      item: updatedOffer.item.name,
      amount: updatedOffer.amount,
      hidden: updatedOffer.hidden,
      user: {
        id: updatedOffer.user.id,
        username: updatedOffer.user.username,
        about: updatedOffer.user.about,
        avatar: updatedOffer.user.avatar,
        createdAt: updatedOffer.user.createdAt,
        updatedAt: updatedOffer.user.updatedAt,
      },
    } as OfferDto;
  }

  async remove(id: number, userId: number): Promise<OfferDto> {
    const offer = await this.offerRepository.findOne({
      relations: {
        user: true,
        item: true,
      },
      where: {
        id: id,
      },
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    if (offer.user.id !== userId) {
      throw new ForbiddenException('You cant delete someone elses offers');
    }

    const removedOffer = { ...offer };

    await this.offerRepository.remove(offer);

    return {
      id: removedOffer.id,
      createdAt: removedOffer.createdAt,
      updatedAt: removedOffer.updatedAt,
      item: removedOffer.item.name,
      amount: removedOffer.amount,
      hidden: removedOffer.hidden,
      user: {
        id: removedOffer.user.id,
        username: removedOffer.user.username,
        about: removedOffer.user.about,
        avatar: removedOffer.user.avatar,
        createdAt: removedOffer.user.createdAt,
        updatedAt: removedOffer.user.updatedAt,
      },
    } as OfferDto;
  }
}
