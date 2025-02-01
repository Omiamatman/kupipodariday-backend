import {
  ForbiddenException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from '../users/entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createWishDto: CreateWishDto, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const wish = this.wishRepository.create({
      ...createWishDto,
      owner: user,
      raised: 0,
      copied: 0,
    });

    await this.wishRepository.save(wish);
  }

  async findLastWish() {
    const wishes = await this.wishRepository.find({
      relations: { owner: true, offers: true },
      order: {
        createdAt: 'DESC',
      },
      take: 30,
    });

    return wishes.map((wish) => ({
      id: wish.id,
      createdAt: wish.createdAt,
      updatedAt: wish.updatedAt,
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      raised: wish.raised,
      copied: wish.copied,
      description: wish.description,
      owner: {
        id: wish.owner.id,
        username: wish.owner.username,
        about: wish.owner.about,
        avatar: wish.owner.avatar,
        createdAt: wish.owner.createdAt,
        updatedAt: wish.owner.updatedAt,
      },
      offers: wish.offers.map((offer) => offer.id),
    }));
  }

  async findTopWish() {
    const wishes = await this.wishRepository.find({
      relations: { owner: true, offers: true },
      order: {
        copied: 'DESC',
      },
      take: 10,
    });

    return wishes.map((wish) => ({
      id: wish.id,
      createdAt: wish.createdAt,
      updatedAt: wish.updatedAt,
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      raised: wish.raised,
      copied: wish.copied,
      description: wish.description,
      owner: {
        id: wish.owner.id,
        username: wish.owner.username,
        about: wish.owner.about,
        avatar: wish.owner.avatar,
        createdAt: wish.owner.createdAt,
        updatedAt: wish.owner.updatedAt,
      },
      offers: wish.offers.map((offer) => offer.id),
    }));
  }

  async findOneWish(query: FindOneOptions<Wish>) {
    const wish = await this.wishRepository.findOneOrFail(query);

    return {
      id: wish.id,
      createdAt: wish.createdAt,
      updatedAt: wish.updatedAt,
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      raised: wish.raised,
      copied: wish.copied,
      description: wish.description,
      owner: {
        id: wish.owner.id,
        username: wish.owner.username,
        about: wish.owner.about,
        avatar: wish.owner.avatar,
        createdAt: wish.owner.createdAt,
        updatedAt: wish.owner.updatedAt,
      },
      offers: wish.offers.map((offer) => offer.id),
    };
  }

  async update(id: number, updateWishDto: UpdateWishDto, userId: number) {
    const wish = await this.wishRepository.findOne({
      where: { id: id },
      relations: ['owner'],
    });

    if (!wish) {
      throw new NotFoundException('Wish not found');
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenException('You cant edit other peoples gifts');
    }

    await this.wishRepository.update(id, updateWishDto);

    return this.findOneWish({
      where: { id: id },
      relations: { owner: true, offers: true },
    });
  }

  async copy(wishId: number, userId: number) {
    const wish = await this.wishRepository.findOneBy({ id: wishId });
    const user = await this.userRepository.findOne({
      relations: {
        wishes: true,
      },
      where: {
        id: userId,
      },
    });

    if (!wish) {
      throw new NotFoundException('Wish not found');
    }

    wish.copied = (wish.copied || 0) + 1;
    await this.wishRepository.save(wish);

    const isWishAlreadyInUserWishes = user.wishes.some(
      (userWish) => userWish.id === wish.id,
    );

    if (isWishAlreadyInUserWishes) {
      throw new Error('Your list already contains this gift');
    }

    user.wishes.push(wish);
    await this.userRepository.save(user);

    return wish;
  }

  async remove(id: number, userId: number) {
    const wish = await this.wishRepository.findOne({
      relations: {
        owner: true,
      },
      where: {
        id: id,
      },
    });

    if (!wish) {
      throw new NotFoundException('Wish not found');
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenException('You cant delete someone elses gifts');
    }

    await this.wishRepository.delete(id);
  }
}
