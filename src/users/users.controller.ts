import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { User } from 'libs/db/models/user/user.model';
import { Crud } from 'nestjs-mongoose-crud';
import { InjectModel } from 'nestjs-typegoose';
import { ApiTags } from '@nestjs/swagger'
import { ReturnModelType } from '@typegoose/typegoose';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';

@Crud({
  model: User
})
@Controller('users')
@ApiTags('用户')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    @InjectModel(User) private readonly user: ReturnModelType<typeof User>
    ) {
    
  }

  @UseGuards(LocalAuthGuard)
  @Get('login')
  login (@Request() req) {
    return this.authService.login(req.user);
  }
}
