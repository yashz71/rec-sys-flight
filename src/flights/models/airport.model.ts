import { ObjectType, Field, ID } from '@nestjs/graphql';
import { City } from './city.model';

@ObjectType('Airport')
export class Airport {
  @Field(() => ID)
  airportID: string;

  @Field()
  airportName: string;

  @Field(() => City)
  city: City;
}