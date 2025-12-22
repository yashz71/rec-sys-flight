import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterInput } from './dto/register.input';
import * as bcrypt from 'bcrypt';
import { AuthResponse } from './dto/auth.response'; 
@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService){}
    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (user && await bcrypt.compare(pass, user.password)) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      }

      async login(user: any): Promise<AuthResponse> {
        // 1. Ensure the payload keys match what your JwtStrategy expects
        const payload = { 
          email: user.email, 
          sub: user.id, 
          roles: user.roles, // Match the strategy: payload.roles
          username: user.username 
        };
      
        // 2. Return the full AuthResponse shape
        return {
          access_token: this.jwtService.sign(payload),
          user: user, // Return the user object so the frontend can use it immediately
        };
      }
  async register(input: RegisterInput): Promise<AuthResponse> {
    // 1. Check if the user already exists
    const existingUser = await this.userService.findByEmail(input.email);
    if (existingUser) {
      throw new BadRequestException('A user with this email already exists.');
    }

    // 2. Hash the plain-text password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(input.password, salt);

    // 3. Save to Neo4j (passing the hashed password)
    const newUser = await this.userService.create({
      ...input,
      password: hashedPassword,
    });
    // 4. Automatically log them in by generating a JWT
    const payload = { 
      sub: newUser.id, 
      email: newUser.email,
      roles: newUser.roles 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: newUser,
    };
  }
}
