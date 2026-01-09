import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AirlineInfo {
  @Field()
  code: string;

  @Field()
  name: string; // Matches 'a.name'
}

@ObjectType()
export class AirportInfo {
  @Field()
  code: string; // We will map 'airportCode' to this

  @Field()
  city: string; // Matches 'c.name as city'
}

@ObjectType()
export class FlightMetadata {
  @Field(() => [AirlineInfo])
  airlines: AirlineInfo[];

  @Field(() => [AirportInfo])
  airports: AirportInfo[];
}