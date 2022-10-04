import {
  Controller,
  Get,
  UseGuards,
  Body,
  Res,
  HttpStatus,
  forwardRef,
  Inject,
  Render,
} from '@nestjs/common';
import { User } from 'libs/db/models/user/user.model';
import { Crud } from 'nestjs-mongoose-crud';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { RtGuard, LocalAuthGuard } from 'src/auth/guards';
import { GetCurrentEmail, GetCurrentUser, Public } from 'libs/decorators';
import { UsersService } from './users.service';
import { RegisterDto } from './dto';
import { Response } from 'express';
import { EmailService } from 'src/email/email.service';

@Crud({
  model: User,
})
@Controller('user')
@ApiTags('用户')
export class UsersController {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  @Public()
  @Get()
  @Render('index')
  root() {
    return { message: 'hellow world' };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Get('login')
  login(@GetCurrentUser() user: any) {
    return this.authService.login(user);
  }

  @Public()
  @Get('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const data = await this.usersService.findOne(dto.email);
    if (!data) {
      await this.usersService.register(dto);
      await this.emailService.sendRegisterEmail(dto.email, dto);
      const token = await this.authService.register(dto);
      res.status(HttpStatus.CREATED).send(token);
    } else if (data.status === 0) {
      await this.emailService.sendRegisterEmail(dto.email, dto);
      res.status(HttpStatus.PRECONDITION_FAILED).send({
        msg: '账号邮箱已经注册,但还未激活，请前往邮箱激活',
      });
    } else {
      res.status(HttpStatus.PRECONDITION_FAILED).send({
        msg: '账号邮箱已经注册,请前往登入',
      });
    }
  }

  @Public()
  @UseGuards(RtGuard)
  @Get('active')
  async active(@GetCurrentEmail() email: string) {
    await this.usersService.active(email);
    return {
      msg: '激活成功',
    };
  }

  @Get('info')
  async Information(@GetCurrentEmail() email: string, @Res() res: Response) {
    const data = await this.usersService.findOne(email);
    if (!data) {
      res.status(HttpStatus.NOT_FOUND).send({
        msg: '账号不存在',
      });
    }
    return data;
  }

  @Get('out')
  async loginOut(@GetCurrentEmail() email: string) {
    await this.usersService.loginOut(email);
    return {
      msg: '退出登陆成功',
    };
  }
}
