import {
  Controller,
  UseGuards,
  Param,
  Patch,
  Body,
  Post,
  Get,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  getCurrentUser(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Get('me/wishes')
  getCurrentUserWishes(@Req() req) {
    return this.usersService.getUserWishes(req.user.username);
  }

  @Patch('me')
  updateUser(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOne(req.user.id, updateUserDto);
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Get(':username/wishes')
  getUserWishes(@Param('username') username: string) {
    return this.usersService.getUserWishes(username);
  }

  @Post('find')
  findUser(@Body('query') query: string) {
    return this.usersService.findUser({ where: { username: query } });
  }
}
