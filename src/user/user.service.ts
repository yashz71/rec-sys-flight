import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { User } from './model/user.model';
@Injectable()
export class UserService {
    constructor(private readonly neo4jService: Neo4jService) {}

  // src/users/users.service.ts
async create(data: any): Promise<User> {
    const cypher = `
      CREATE (u:User {
        id: randomUUID(),
        username: $username,
        email: $email,
        password: $password,
        roles: ['USER']
      }) RETURN u
    `;
  
    const result = await this.neo4jService.write(cypher, data);
    
    
    return result[0].u.properties; 
  }
  async findByEmail(email: string) {
    const res = await this.neo4jService.read(
      `MATCH (u:User {email: $email}) RETURN u`, 
      { email }
    );
    return res[0]?.u;
  }
}
