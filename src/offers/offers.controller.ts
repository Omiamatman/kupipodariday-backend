import {
  ParseIntPipe,
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
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OffersService } from './offers.service';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('offers')
@UseGuards(JwtGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOfferDto: CreateOfferDto, @Req() req) {
    const acceptHeader = req.headers['accept'];
    if (!acceptHeader || !acceptHeader.includes('application/json')) {
      throw new UnsupportedMediaTypeException('Unsupported Media Type');
    }

    await this.offersService.create(createOfferDto, req.user.id);
    return {};
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(@Req() req) {
    const acceptHeader = req.headers['accept'];
    if (!acceptHeader || !acceptHeader.includes('application/json')) {
      throw new UnsupportedMediaTypeException('Unsupported Media Type');
    }

    return this.offersService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const acceptHeader = req.headers['accept'];
    if (!acceptHeader || !acceptHeader.includes('application/json')) {
      throw new UnsupportedMediaTypeException('Unsupported Media Type');
    }

    return this.offersService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOfferDto: UpdateOfferDto,
    @Req() req,
  ) {
    const acceptHeader = req.headers['accept'];
    if (!acceptHeader || !acceptHeader.includes('application/json')) {
      throw new UnsupportedMediaTypeException('Unsupported Media Type');
    }

    return this.offersService.update(id, updateOfferDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const acceptHeader = req.headers['accept'];
    if (!acceptHeader || !acceptHeader.includes('application/json')) {
      throw new UnsupportedMediaTypeException('Unsupported Media Type');
    }

    return this.offersService.remove(id, req.user.id);
  }
}
