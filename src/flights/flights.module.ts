import { Module } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { FlightsResolver } from './flights.resolver';
import { Neo4jModule } from 'src/neo4j/neo4j.module';
@Module({
    imports:[Neo4jModule],
  providers: [FlightsService, FlightsResolver],
  exports: [FlightsService],
})
export class FlightsModule {}