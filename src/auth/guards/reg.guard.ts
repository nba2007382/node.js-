import { AuthGuard } from "@nestjs/passport";

export class RegGuard extends AuthGuard('jwt-Register') {
  constructor() {
    super()
  }
}