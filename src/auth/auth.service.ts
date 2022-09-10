import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
    ) {}

  async validateUser(accountEmail: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(accountEmail);
    if (user && user.password === pass && user.status === 1) {
      const { password, ...result } = user;
      return result;
    };
    return null;
  };

  async login (user: any) {
    const payload = { accountEmail: user.accountEmail, sub: user._id };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: jwtConstants.access_secret
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '8h',
        secret: jwtConstants.refresh_secret
      })
    ]);
    return {
      access_token,
      refresh_token
    };
  };

  async register (user: any) {
    const payload = { accountEmail: user.accountEmail, sub: user._id };
    const register_token = await this.jwtService.signAsync(payload, {
      expiresIn: '3h',
      secret: jwtConstants.register_secret
    });
    return register_token;
  }
}
