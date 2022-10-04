import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(to: string, subject: string, content: string) {
    const mailOptions = {
      from: '1143571151@qq.com',
      to: to, //发给谁
      subject: subject, //标题
      html: content, //内容
    };
    this.mailerService
      .sendMail(mailOptions)
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async sendRegisterEmail(to: string, user: any) {
    const register_token = await this.authService.register(user);
    if (register_token) {
      const subject = '邮箱注册激活';
      const host = this.configService.get<string>('APP_HOST');
      const content = `<div><a>${host}/admin/register/active?token=${register_token}&account=${to}</a></div>`;
      this.sendEmail(to, subject, content);
    }
  }
}
