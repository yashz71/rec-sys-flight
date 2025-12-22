import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from '../enums/role.enum'; 

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  // We OMIT @Field() so it's hidden from the GraphQL schema entirely.
  password?: string;

  @Field(() => [Role])
  roles: Role[];
}