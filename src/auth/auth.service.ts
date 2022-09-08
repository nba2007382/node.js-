import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
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
    return {
      access_token: this.jwtService.sign(payload)
    };
  };
}
