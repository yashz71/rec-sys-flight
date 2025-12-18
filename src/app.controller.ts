import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Neo4jService } from './neo4j/neo4j.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private neo4jService:Neo4jService) {}
  @Get('test-neo4j')
  async testNeo4j() {
    return await this.neo4jService.read('MATCH (n) RETURN count(n) as nodeCount');
  } 
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
