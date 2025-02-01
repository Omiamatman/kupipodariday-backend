import { UsersService } from 'src/users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  auth(user: { id: number }) {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(
    username: string,
    password: string,
  ): Promise<{ id: number; username: string }> {
    const user = await this.usersService.checkUserPassword(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { id, username } = user;
      return { id, username };
    }
    return null;
  }
}
