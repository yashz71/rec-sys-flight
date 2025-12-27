import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
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
import { auth } from 'neo4j-driver-core';
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'register' })
  
  async register(
    @Args('registerInput') registerInput: RegisterInput,@Context() context: any
  ) {
    const authResponse = await this.authService.register(registerInput);

  // Set the cookie
  context.res.cookie('access_token', authResponse.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
  const user =authResponse.user;
  // Return the object to the frontend (the token is now also in the header)
  return {user};
  }

  
@Mutation(() => AuthResponse)
async login(@Args('loginInput') loginInput: LoginInput,@Context() context: any) {
  const user = await this.authService.validateUser(loginInput.email, loginInput.password);
  if (!user) throw new UnauthorizedException();
  
  const { access_token } = await this.authService.login(user);

  // Set the cookie on the response object
  context.res.cookie('access_token', access_token, {
    httpOnly: true,    // (XSS protection)
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS
    sameSite: 'lax',   // Protects against CSRF
    maxAge: 1000 * 60 * 60 * 24 * 7,  
  });

  return { user};
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
@Query(() => User)
@UseGuards(GqlAuthGuard) 
async me(@CurrentUser() user: any) {
  return user; 
}
}