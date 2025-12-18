import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('Country')
export class Country {
  @Field(() => ID)
  countryID: string;

  @Field()
  countryName: string;
}