import { Wishlist } from './wishlists/entities/wishlist.entity';
import { WishlistsModule } from './wishlists/wishlists.module';
import { Offer } from './offers/entities/offer.entity';
import { WishesModule } from './wishes/wishes.module';
import { OffersModule } from './offers/offers.module';
import { Wish } from './wishes/entities/wish.entity';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'student',
      password: 'student',
      database: 'nest_project',
      schema: 'kupipodariday',
      entities: [Wishlist, Offer, User, Wish],
      synchronize: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
