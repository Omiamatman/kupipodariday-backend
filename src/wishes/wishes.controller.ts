import {
  ParseIntPipe,
  Controller,
  UseGuards,
  Delete,
  Param,
  Body,
  Get,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishesService } from './wishes.service';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() createWishDto: CreateWishDto, @Req() req) {
    return this.wishesService.create(createWishDto, req.user.id);
  }

  @Get('last')
  getLastWishes() {
    return this.wishesService.findLastWish();
  }

  @Get('top')
  getTopWishes() {
    return this.wishesService.findTopWish();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  getOneWish(@Param('id', ParseIntPipe) id: number) {
    return this.wishesService.findOneWish({
      where: { id: id },
      relations: { owner: true, offers: true },
    });
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req,
  ) {
    return this.wishesService.update(id, updateWishDto, req.user.id);
  }

  @Post(':id/copy')
  @UseGuards(JwtGuard)
  copy(@Param('id') id: number, @Req() req) {
    return this.wishesService.copy(id, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  remove(@Param('id') id: number, @Req() req) {
    return this.wishesService.remove(id, req.user.id);
  }
}
