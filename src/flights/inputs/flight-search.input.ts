import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FlightSearchInput {
  @Field({ nullable: true })
  originAirportID?: string;

  @Field({ nullable: true })
  destinationAirportID?: string;

  @Field({ nullable: true })
  airlineID?: string;

  @Field({ nullable: true })
  originCityID?: string;

  @Field({ nullable: true })
  destinationCityID?: string;

  @Field({ nullable: true })
  originCountryID?: string;

  @Field({ nullable: true })
  destinationCountryID?: string;
}