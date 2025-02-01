import {
  NotFoundException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { FindOneOptions, QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { WishPartialDto } from 'src/wishes/dto/wish-partial.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserProfileResponseDto> {
    const { password } = createUserDto;
    const passwordHash = await bcrypt.hash(password, 10);
    try {
      const user = await this.userRepository.save({
        ...createUserDto,
        password: passwordHash,
      });
      delete user.password;
      return {
        id: user.id,
        username: user.username,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      } as UserProfileResponseDto;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const err = error.driverError;
        if (err.code === '23505') {
          throw new ConflictException('Username already exist');
        }
      }
    }
  }

  async findOne(id: number): Promise<UserProfileResponseDto> {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    delete user.password;
    return {
      id: user.id,
      username: user.username,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as UserProfileResponseDto;
  }

  async updateOne(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<UserProfileResponseDto>> {
    for (const key in updateUserDto) {
      if (key === 'password') {
        const passwordHash = await bcrypt.hash(updateUserDto[key], 10);
        updateUserDto[key] = passwordHash;
      }
    }
    try {
      const updatedUser = await this.userRepository.update(id, updateUserDto);
      if (updatedUser.affected === 0) {
        throw new NotFoundException('User not found');
      }
      const user = await this.userRepository.findOneBy({ id: id });
      delete user.password;
      return {
        username: user.username,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      } as Partial<UserProfileResponseDto>;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const err = error.driverError;
        if (err.code === '23505') {
          throw new ConflictException('Username already exist');
        }
      }
    }
  }

  async findByUsername(
    username: string,
  ): Promise<UserPublicProfileResponseDto> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    delete user.password;

    return {
      id: user.id,
      username: user.username,
      about: user.about,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as UserPublicProfileResponseDto;
  }

  async checkUserPassword(username: string) {
    const user = await this.userRepository.findOne({
      select: { id: true, username: true, password: true },
      where: { username: username },
    });
    return user;
  }

  async getUserWishes(username: string): Promise<WishPartialDto[]> {
    const user = await this.userRepository.findOne({
      where: { username: username },
      relations: { wishes: true, offers: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.wishes.map((wish) => ({
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
    })) as WishPartialDto[];
  }

  async findUser(query: FindOneOptions<User>) {
    const users = await this.userRepository.find(query);
    return users.map((user) => ({
      id: user.id,
      username: user.username,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })) as UserProfileResponseDto[];
  }
}
