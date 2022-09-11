import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.qq.com',
          port: 465,
          secure: true,
          auth: {
            user: '1143571151@qq.com',
            pass: 'ssthhxznovshhbac' //anzjtdlmvpuvbcjc.pmoayaasziaebcfj
          }
        },
        defaults: {
          from: '"监控管家" <1143571151@qq.com>'
        }
      })
    }),
    AuthModule
  ],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
