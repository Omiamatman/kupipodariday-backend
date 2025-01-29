import { WishesController } from './wishes.controller';
import { User } from '../users/entities/user.entity';
import { WishesService } from './wishes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Wish, User])],
  controllers: [WishesController],
  providers: [WishesService],
})
export class WishesModule {}
