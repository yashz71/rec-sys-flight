import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Country } from './country.model';

@ObjectType('Airline')
export class Airline {
  @Field(() => ID)
  airlineID: string;

  @Field()
  airlineName: string;

  @Field(() => Country)
  country: Country;
}
