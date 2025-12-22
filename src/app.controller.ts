import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Neo4jService } from './neo4j/neo4j.service';
import { FlightsService } from './flights/flights.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private neo4jService:Neo4jService, private flightService: FlightsService) {}
  
}
