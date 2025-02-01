import {
  UnsupportedMediaTypeException,
  NotFoundException,
  ParseIntPipe,
  Controller,
  HttpStatus,
  UseGuards,
  HttpCode,
  Delete,
  Param,
  Patch,
  Body,
  Post,
  Get,
  Req,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishesService } from './wishes.service';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createWishDto: CreateWishDto, @Req() req) {
    const acceptHeader = req.headers['accept'];
    if (!acceptHeader || !acceptHeader.includes('application/json')) {
      throw new UnsupportedMediaTypeException('Unsupported Media Type');
    }

    await this.wishesService.create(createWishDto, req.user.id);
    return {};
  }

  @Get('last')
  getLastWishes() {
    return this.wishesService.findLastWish();
  }

  @Get('top')
  getTopWishes() {
    return this.wishesService.findTopWish();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getOneWish(@Param('id', ParseIntPipe) id: number) {
    const wish = await this.wishesService.findOneWish({
      where: { id: id },
      relations: { owner: true, offers: true },
    });

    if (!wish) {
      throw new NotFoundException('Wish not found');
    }

    return wish;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req,
  ) {
    const updatedWish = await this.wishesService.update(
      id,
      updateWishDto,
      req.user.id,
    );

    if (!updatedWish) {
      throw new NotFoundException('Wish not found');
    }

    return {};
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const acceptHeader = req.headers['accept'];
    if (!acceptHeader || !acceptHeader.includes('application/json')) {
      throw new UnsupportedMediaTypeException('Unsupported Media Type');
    }

    await this.wishesService.remove(id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  @HttpCode(HttpStatus.CREATED)
  async copy(@Param('id') id: number, @Req() req) {
    const acceptHeader = req.headers['accept'];
    if (!acceptHeader || !acceptHeader.includes('application/json')) {
      throw new UnsupportedMediaTypeException('Unsupported Media Type');
    }

    await this.wishesService.copy(id, req.user.id);
    return {};
  }
}
