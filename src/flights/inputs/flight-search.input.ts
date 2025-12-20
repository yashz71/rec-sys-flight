import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class FlightSearchInput {
  @Field({ nullable: true })
  departureAirportCode?: string;

  @Field({ nullable: true })
  arrivalAirportCode?: string;

  @Field({ nullable: true })
  airlineCode?: string;

  @Field({ nullable: true })
  departureCity?: string;

  @Field({ nullable: true })
  arrivalCity?: string;

  @Field({ nullable: true })
  departureCountry?: string;

  @Field({ nullable: true })
  arrivalCountry?: string;

  @Field({ nullable: true })
  departureDate?: Date; // Filtre par date de départ

  @Field(() => Float, { nullable: true })
  maxPrice?: number; // Prix maximum (FLOAT)

  @Field({ nullable: true })
  seatClass?: string; // Economy, Business, First

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit?: number; 
}
