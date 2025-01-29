import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';
import { Wish } from '../wishes/entities/wish.entity';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, User, Wish])],
  controllers: [WishlistsController],
  providers: [WishlistsService],
})
export class WishlistsModule {}
