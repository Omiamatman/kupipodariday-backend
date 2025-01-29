import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, userId: number) {
    const { itemsId } = createWishlistDto;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const wishes = await this.wishRepository.findByIds(itemsId);
    if (wishes.length !== itemsId.length) {
      throw new NotFoundException('One or more gifts not found');
    }

    const wishlist = this.wishlistRepository.create({
      ...createWishlistDto,
      owner: user,
      items: wishes,
    });

    return this.wishlistRepository.save(wishlist);
  }

  async findAll() {
    return await this.wishlistRepository.find({
      relations: { owner: true },
    });
  }

  async findOneWishlist(id: number) {
    return await this.wishlistRepository.findOne({
      relations: {
        items: true,
        owner: true,
      },
      where: {
        id: id,
      },
    });
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishList = await this.wishlistRepository.findOne({
      relations: {
        owner: true,
      },
      where: {
        id: id,
        owner: { id: userId },
      },
    });

    return this.wishlistRepository.update(wishList, {
      ...updateWishlistDto,
    });
  }

  async remove(id: number, userId: number) {
    const wishList = await this.wishlistRepository.findOne({
      relations: {
        owner: true,
      },
      where: {
        id: id,
        owner: {
          id: userId,
        },
      },
    });
    return await this.wishlistRepository.remove(wishList);
  }
}
