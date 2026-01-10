import { InputType, Field, PartialType } from '@nestjs/graphql';
import { RegisterInput } from './register.input';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class AddUserInput extends PartialType(RegisterInput) {
  // Inherits username, email, and password as optional fields
  @Field(() => [String])
  @IsNotEmpty()
  roles: String[];
}    