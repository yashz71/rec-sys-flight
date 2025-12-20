import { ObjectType, Field, ID } from '@nestjs/graphql';
import { City } from './city.model';

@ObjectType('Airport')
export class Airport {
  @Field(() => ID)
  code: string;

  @Field(() => City)
  city: City;
}