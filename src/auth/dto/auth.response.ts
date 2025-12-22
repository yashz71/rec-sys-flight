import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/model/user.model'; // Import your existing User model

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field(() => User)
  user: User;
}