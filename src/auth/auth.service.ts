import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterInput } from './dto/register.input';
import * as bcrypt from 'bcrypt';
import { AuthResponse } from './dto/auth.response'; 
import { UpdateUserInput } from './dto/update-user.input';
import { User } from 'src/user/model/user.model';
import { AddUserInput } from './dto/add.user.input';
@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService){}
    async allUsers(): Promise<User[]>{
      const result = await this.userService.findAllUsers();
      console.log("all users res:",result);
      return result;
    }
    async validateUser(email: string, pass: string): Promise<any> {
      // Now 'user' is already the properties object thanks to your findByEmail change
      const user = await this.userService.findByEmail(email);
    
      // 1. Check if user exists
      if (!user){ 
        console.log('invalid user');
        return null;
      }

      // 2. Compare directly (user.password exists now)
      const isMatch = bcrypt.compareSync(pass, user.password);
      if (isMatch) {
        const {password,...result } = user;
        return result;
      }
      console.log('invalid pass');
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
          user: user,
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
      roles: newUser.roles,
      username: newUser.username

    };
    const { password, ...safeUser } = newUser;
    return {
      access_token: this.jwtService.sign(payload),
      user: safeUser,
    };
  }
  async addAdmin(input: AddUserInput){
    // 1. Check if the user already exists
    const existingUser = await this.userService.findByEmail(input.email!);
    if (existingUser) {
      throw new BadRequestException('A user with this email already exists.');
    }

    // 2. Hash the plain-text password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(input.password!, salt);

    // 3. Save to Neo4j (passing the hashed password)
    const newUser = await this.userService.createAdmin({
      ...input,
      password: hashedPassword,
    });
   
    const { password, ...safeUser } = newUser;
    return  safeUser;
    
  }
  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    const updateData: any = { ...input };
  
    // 1. If password exists in the input, hash it
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
  
    // 2. Pass the sanitized/hashed data to the Cypher-layer
    const updatedUser = await this.userService.update(id, updateData);
  
    // 3. Destructure to hide the hashed password from the GraphQL response
    const { password, ...safeUser } = updatedUser;
    return safeUser as User;
  }
  async deleteUser(id: string): Promise<boolean>{
    const result = await this.userService.delete(id);
    return result;

  }
  async updateAdmin(id: string, input: UpdateUserInput): Promise<User> {
    const updateData: any = { ...input };
  
    // 1. If password exists in the input, hash it
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
  
    // 2. Pass the sanitized/hashed data to the Cypher-layer
    const updatedUser = await this.userService.update(id, updateData);
  
    // 3. Destructure to hide the hashed password from the GraphQL response
    const { password, ...safeUser } = updatedUser;
    return safeUser as User;
  }
}
