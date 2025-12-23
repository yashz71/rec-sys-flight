import { Injectable,NotFoundException } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { User } from './model/user.model';
@Injectable()
export class UserService {
    constructor(private readonly neo4jService: Neo4jService) {}

    async findAllUsers(): Promise<User[]> {
      const cypher = `
        MATCH (u:User)
        RETURN u { .id, .username, .email, .roles } as user
      `;
    
      const results = await this.neo4jService.read(cypher);
    
      // We map the results to return the 'user' object defined in the Cypher map
      return results.map(record => record.user);
    }
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
  async update(id: string, properties: any): Promise<User> {
    const cypher = `
      MATCH (u:User {id: $id})
      SET u += $properties
      RETURN u
    `;
    const result = await this.neo4jService.write(cypher, { id, properties });
    
    if (result.length === 0) throw new NotFoundException('User not found');
    return result[0].u.properties;
  }
  
  async delete(id: string): Promise<boolean> {
    const cypher = `
      MATCH (u:User {id: $id})
      DETACH DELETE u
      RETURN count(u) as deletedCount
    `;
    const result = await this.neo4jService.write(cypher, { id });
    return result[0].deletedCount > 0;
  }
  async findByEmail(email: string) {
    const res = await this.neo4jService.read(
      `MATCH (u:User {email: $email}) RETURN u`, 
      { email }
    );
    return res[0]?.u?.properties || null;
    }
}
