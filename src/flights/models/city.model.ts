import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('City')
export class City {
  @Field(() => ID)
  code: string;

  @Field()
  name: string;

  @Field()
  country: string;
}
