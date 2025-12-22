import { SetMetadata } from '@nestjs/common';

// This allows us to use @Roles('ADMIN') on our methods
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);