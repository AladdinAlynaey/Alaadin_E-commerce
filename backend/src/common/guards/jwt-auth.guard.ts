import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.user) throw new ForbiddenException('Authentication required');
    return true;
  }
}

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  canActivate(): boolean {
    return true;
  }
}
