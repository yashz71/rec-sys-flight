import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Country } from './country.model';

@ObjectType('City')
export class City {
  @Field(() => ID)
  cityID: string;

  @Field()
  cityName: string;

  @Field(() => Country)
  country: Country;
}