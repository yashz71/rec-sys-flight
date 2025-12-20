import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Airline } from './airline.model';
import { Airport } from './airport.model';
import { SeatClass } from './seat-class.model';

@ObjectType('Flight')
export class Flight {
  @Field()
  flightNumber: string;

  @Field(() => Airline)
  airline: Airline;

  @Field(() => Airport)
  departureAirport: Airport;

  @Field(() => Airport)
  arrivalAirport: Airport;

  @Field()
  departure: Date; // DateTime

  @Field()
  arrival: Date; // DateTime

  @Field(() => Int)
  duration: number; // En minutes (INTEGER)


  @Field(() => [SeatClass])
  prices: SeatClass[]; // Tous les prix disponibles
}