import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.response';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { UnauthorizedException } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard'; 
import { UseGuards } from '@nestjs/common';
import { User } from '../user/model/user.model';
import { CurrentUser } from './decorators/current-user.decorator'; // The decorator
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'register' })
  async register(
    @Args('registerInput') registerInput: RegisterInput,
  ): Promise<AuthResponse> {
    return await this.authService.register(registerInput);
  }

  
  @Mutation(() => AuthResponse)
async login(@Args('loginInput') loginInput: LoginInput) {
  const user = await this.authService.validateUser(loginInput.email, loginInput.password);
  if (!user) throw new UnauthorizedException();
  
  return this.authService.login(user); // Now returns token AND user
}
// PROTECTED: Only users with a valid JWT can run this
@Query(() => User)
@UseGuards(GqlAuthGuard) 
async me(@CurrentUser() user: any) {
  return user; 
}
}