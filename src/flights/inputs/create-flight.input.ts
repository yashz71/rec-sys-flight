import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateFlightInput {
  @Field()
  flightNumber: string;

  @Field()
  airlineCode: string;

  @Field()
  departureAirportCode: string;

  @Field()
  arrivalAirportCode: string;

  @Field()
  departure: Date;

  @Field()
  arrival: Date;

  @Field()
  duration: number;
}