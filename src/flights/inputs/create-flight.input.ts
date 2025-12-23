import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateFlightInput {
  @Field() flightNumber: string;
  @Field() departure: Date;
  @Field() arrival: Date;
  @Field() duration: number;
  @Field() airlineCode: string; // To link the existing Airline
  @Field() depAirportCode: string; // To link departure Airport
  @Field() arrAirportCode: string; // To link arrival Airport
}