import { InputType, Field, PartialType } from '@nestjs/graphql';
import { RegisterInput } from './register.input';

@InputType()
export class UpdateUserInput extends PartialType(RegisterInput) {
  // Inherits username, email, and password as optional fields
}