import {
  ParseIntPipe,
  Controller,
  UseGuards,
  Param,
  Body,
  Post,
  Get,
  Req,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersService } from './offers.service';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('offers')
@UseGuards(JwtGuard)
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @Req() req) {
    return this.offersService.create(createOfferDto, req.user.id);
  }

  @Get()
  getAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.offersService.findOne(id);
  }
}
