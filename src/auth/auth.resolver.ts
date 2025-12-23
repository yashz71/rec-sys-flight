import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.response';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { UnauthorizedException,ForbiddenException } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard'; 
import { UseGuards } from '@nestjs/common';
import { User } from '../user/model/user.model';
import { CurrentUser } from './decorators/current-user.decorator';
import { RolesGuard } from './guards/roles.guard';
import { UpdateUserInput } from './dto/update-user.input';
import { Roles } from './decorators/roles.decorator';
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
  
  return this.authService.login(user); 
}

@Mutation(() => User)
@UseGuards(GqlAuthGuard)
async updateProfile(
  @CurrentUser() currentUser: any,
  @Args('id') id: string, // The ID of the user to update
  @Args('input') input: UpdateUserInput,
) {
  // Security: Only allow update if the user is an Admin OR updating themselves
  if (currentUser.roles.includes('ADMIN') || currentUser.id === id) {
    return this.authService.updateUser(id, input);
  }
  
  throw new ForbiddenException('You do not have permission to update this profile');
}

@Mutation(() => Boolean)
@Roles('ADMIN')
@UseGuards(GqlAuthGuard, RolesGuard)
async removeUser(@Args('id') id: string) {
  return this.authService.deleteUser(id);
}
@Query(() => [User], { 
  name: 'users',
  description: 'Get all available users'
})
@Roles('ADMIN')
@UseGuards(GqlAuthGuard, RolesGuard)
async allUsers() {
  return this.authService.allUsers();
}
// PROTECTED: Only users with a valid JWT can run this
@Query(() => User)
@UseGuards(GqlAuthGuard) 
async me(@CurrentUser() user: any) {
  return user; 
}
}