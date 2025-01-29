import {
  ForbiddenException,
  ConflictException,
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

  async create(createWishDto: CreateWishDto, id: number) {
    const user = await this.userRepository.findOneBy({ id: id });
    return await this.wishRepository.save({
      ...createWishDto,
      owner: user,
    });
  }

  async findLastWish() {
    return await this.wishRepository.find({
      relations: { owner: true },
      order: {
        createdAt: 'DESC',
      },
      take: 30,
    });
  }

  async findTopWish() {
    return await this.wishRepository.find({
      relations: { owner: true, offers: true },
      order: {
        copied: 'DESC',
      },
      take: 10,
    });
  }

  async findOneWish(query: FindOneOptions<Wish>) {
    return await this.wishRepository.findOneOrFail(query);
  }

  async update(id: number, updateWishDto: UpdateWishDto, userId: number) {
    const { price } = updateWishDto;
    const wish = await this.wishRepository.findOne({
      where: { id: id },
      relations: ['owner'],
    });
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('You cant edit other peoples gifts');
    }
    if (wish.raised > 0 && price) {
      throw new ConflictException('The fundraising is already underway');
    }
    return this.wishRepository.save({ ...wish, ...updateWishDto });
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

    wish.copied = (wish.copied || 0) + 1;
    await this.wishRepository.save(wish);

    const isWishAlreadyInUserWishes = user.wishes.some(
      (userWish) => userWish.id === wish.id,
    );
    if (isWishAlreadyInUserWishes) {
      throw new Error('Your list already contains this gift');
    }

    user.wishes.push(wish);
    return await this.userRepository.save(user);
  }

  async remove(wishId: number, userId: number) {
    const wish = await this.wishRepository.findOne({
      relations: {
        owner: true,
      },
      where: {
        id: wishId,
      },
    });
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('You cant delete someone elses gifts');
    }
    return this.wishRepository.remove(wish);
  }
}
