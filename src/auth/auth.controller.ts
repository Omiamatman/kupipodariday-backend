import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LocalGuard } from 'src/guards/auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('signin')
  @UseGuards(LocalGuard)
  @HttpCode(HttpStatus.OK)
  async signin(@Req() req) {
    const acceptHeader = req.headers['accept'];
    if (!acceptHeader || !acceptHeader.includes('application/json')) {
      throw new UnsupportedMediaTypeException('Unsupported Media Type');
    }

    return this.authService.auth(req.user);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() createUserDto: CreateUserDto, @Req() req) {
    const acceptHeader = req.headers['accept'];
    if (!acceptHeader || !acceptHeader.includes('application/json')) {
      throw new UnsupportedMediaTypeException('Unsupported Media Type');
    }

    const createdUser = await this.userService.create(createUserDto);
    return {
      ...createdUser,
      access_token: this.authService.auth({ id: createdUser.id }).access_token,
    };
  }
}
