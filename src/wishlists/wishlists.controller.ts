import {
  Controller,
  UseGuards,
  Delete,
  Param,
  Patch,
  Body,
  Post,
  Get,
  Req,
  HttpCode,
  HttpStatus,
  UnsupportedMediaTypeException,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistsService } from './wishlists.service';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('wishlistlists')
@UseGuards(JwtGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createWishlistDto: CreateWishlistDto, @Req() req) {
    const acceptHeader = req.headers['accept'];
    if (!acceptHeader || !acceptHeader.includes('application/json')) {
      throw new UnsupportedMediaTypeException('Unsupported Media Type');
    }

    return this.wishlistsService.create(createWishlistDto, req.user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req) {
    const acceptHeader = req.headers['accept'];
    if (!acceptHeader || !acceptHeader.includes('application/json')) {
      throw new UnsupportedMediaTypeException('Unsupported Media Type');
    }

    return this.wishlistsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const acceptHeader = req.headers['accept'];
    if (!acceptHeader || !acceptHeader.includes('application/json')) {
      throw new UnsupportedMediaTypeException('Unsupported Media Type');
    }

    return this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req,
  ) {
    const acceptHeader = req.headers['accept'];
    if (!acceptHeader || !acceptHeader.includes('application/json')) {
      throw new UnsupportedMediaTypeException('Unsupported Media Type');
    }

    return this.wishlistsService.update(id, updateWishlistDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const acceptHeader = req.headers['accept'];
    if (!acceptHeader || !acceptHeader.includes('application/json')) {
      throw new UnsupportedMediaTypeException('Unsupported Media Type');
    }

    return this.wishlistsService.remove(id, req.user.id);
  }
}
