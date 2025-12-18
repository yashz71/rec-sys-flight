import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Airline } from './airline.model';
import { Airport } from './airport.model';

@ObjectType('Flight')
export class Flight {
  @Field(() => ID)
  flightID: string;

  @Field(() => Airline)
  airline: Airline;

  @Field(() => Airport)
  originAirport: Airport;

  @Field(() => Airport)
  destinationAirport: Airport;
}
