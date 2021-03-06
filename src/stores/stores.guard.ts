import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class StoresGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  //jwt
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    try {
      const jwt = request.cookies['jwt'];

      return this.jwtService.verify(jwt);
    } catch (error) {
      return false;
    }
  }
}
