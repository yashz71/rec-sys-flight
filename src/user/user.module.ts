import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { Neo4jModule } from 'src/neo4j/neo4j.module';

@Module({
  imports: [Neo4jModule],
  providers: [UserService],
  exports: [UserService],

})
export class UserModule {}
