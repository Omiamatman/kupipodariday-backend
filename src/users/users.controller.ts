import {
  Controller,
  UseGuards,
  Param,
  Patch,
  Body,
  Post,
  Get,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getCurrentUser(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('me')
  updateUser(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOne(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  getCurrentUserWishes(@Req() req) {
    return this.usersService.getUserWishes(req.user.username);
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
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
