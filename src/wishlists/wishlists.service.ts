import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishPartialDto } from '../wishes/dto/wish-partial.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { WishlistDto } from './dto/wish-list.dto';

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

  async create(
    createWishlistDto: CreateWishlistDto,
    userId: number,
  ): Promise<WishlistDto> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const items = await this.wishRepository.findByIds(
      createWishlistDto.itemsId,
    );
    if (items.length !== createWishlistDto.itemsId.length) {
      throw new NotFoundException('One or more gifts not found');
    }

    const wishlist = this.wishlistRepository.create({
      ...createWishlistDto,
      owner: user,
      items: items,
    });

    await this.wishlistRepository.save(wishlist);

    return {
      id: wishlist.id,
      createdAt: wishlist.createdAt,
      updatedAt: wishlist.updatedAt,
      name: wishlist.name,
      image: wishlist.image,
      owner: {
        id: user.id,
        username: user.username,
        about: user.about,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      items: items.map((item) => ({
        id: item.id,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        name: item.name,
        link: item.link,
        image: item.image,
        price: item.price,
        raised: item.raised,
        copied: item.copied,
        description: item.description,
      })) as WishPartialDto[],
    } as WishlistDto;
  }

  async findAll(): Promise<WishlistDto[]> {
    const wishlists = await this.wishlistRepository.find({
      relations: ['owner', 'items'],
    });

    return wishlists.map((wishlist) => ({
      id: wishlist.id,
      createdAt: wishlist.createdAt,
      updatedAt: wishlist.updatedAt,
      name: wishlist.name,
      image: wishlist.image,
      owner: {
        id: wishlist.owner.id,
        username: wishlist.owner.username,
        about: wishlist.owner.about,
        avatar: wishlist.owner.avatar,
        createdAt: wishlist.owner.createdAt,
        updatedAt: wishlist.owner.updatedAt,
      },
      items: wishlist.items.map((item) => ({
        id: item.id,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        name: item.name,
        link: item.link,
        image: item.image,
        price: item.price,
        raised: item.raised,
        copied: item.copied,
        description: item.description,
      })) as WishPartialDto[],
    })) as WishlistDto[];
  }

  async findOne(id: number): Promise<WishlistDto> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id: id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    return {
      id: wishlist.id,
      createdAt: wishlist.createdAt,
      updatedAt: wishlist.updatedAt,
      name: wishlist.name,
      image: wishlist.image,
      owner: {
        id: wishlist.owner.id,
        username: wishlist.owner.username,
        about: wishlist.owner.about,
        avatar: wishlist.owner.avatar,
        createdAt: wishlist.owner.createdAt,
        updatedAt: wishlist.owner.updatedAt,
      },
      items: wishlist.items.map((item) => ({
        id: item.id,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        name: item.name,
        link: item.link,
        image: item.image,
        price: item.price,
        raised: item.raised,
        copied: item.copied,
        description: item.description,
      })) as WishPartialDto[],
    } as WishlistDto;
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ): Promise<WishlistDto> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id: id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('You cant edit other peoples wishlists');
    }

    if (updateWishlistDto.itemsId) {
      const items = await this.wishRepository.findByIds(
        updateWishlistDto.itemsId,
      );
      if (items.length !== updateWishlistDto.itemsId.length) {
        throw new NotFoundException('One or more gifts not found');
      }
      wishlist.items = items;
    }

    Object.assign(wishlist, updateWishlistDto);
    await this.wishlistRepository.save(wishlist);

    return this.findOne(id);
  }

  async remove(id: number, userId: number): Promise<WishlistDto> {
    const wishlist = await this.wishlistRepository.findOne({
      relations: {
        owner: true,
        items: true,
      },
      where: {
        id: id,
      },
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('You cant delete someone elses wishlists');
    }

    const removedWishlist = { ...wishlist };

    await this.wishlistRepository.remove(wishlist);

    return {
      id: removedWishlist.id,
      createdAt: removedWishlist.createdAt,
      updatedAt: removedWishlist.updatedAt,
      name: removedWishlist.name,
      image: removedWishlist.image,
      owner: {
        id: removedWishlist.owner.id,
        username: removedWishlist.owner.username,
        about: removedWishlist.owner.about,
        avatar: removedWishlist.owner.avatar,
        createdAt: removedWishlist.owner.createdAt,
        updatedAt: removedWishlist.owner.updatedAt,
      },
      items: removedWishlist.items.map((item) => ({
        id: item.id,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        name: item.name,
        link: item.link,
        image: item.image,
        price: item.price,
        raised: item.raised,
        copied: item.copied,
        description: item.description,
      })) as WishPartialDto[],
    } as WishlistDto;
  }
}
