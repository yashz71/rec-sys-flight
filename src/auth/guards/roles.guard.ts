import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Get the roles required for this specific resolver
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    
    // If no roles are required, let everyone in
    if (!requiredRoles) {
      return true;
    }

    // 2. Switch to GraphQL Context and get the user (populated by GqlAuthGuard)
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;

    if (!user || !user.roles) {
      throw new ForbiddenException('User roles not found');
    }

    // 3. Check if the user has at least one of the required roles
    const hasRole = () => user.roles.some((role) => requiredRoles.includes(role));

    if (!hasRole()) {
      throw new ForbiddenException('You do not have permission to perform this action');
    }

    return true;
  }
}