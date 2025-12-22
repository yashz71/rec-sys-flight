import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    // 1. Convert the standard Nest execution context to a GraphQL context
    const ctx = GqlExecutionContext.create(context);
    
    // 2. Access the request object
    const request = ctx.getContext().req;
    
    // 3. Return the user object (which was populated by the JwtStrategy)
    return request.user;
  },
);