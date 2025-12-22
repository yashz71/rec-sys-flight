import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

// This is CRITICAL for Code First. 
// It tells NestJS to include this Enum in your generated schema.gql file.
registerEnumType(Role, {
  name: 'Role',
});