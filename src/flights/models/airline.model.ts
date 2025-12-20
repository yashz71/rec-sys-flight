import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('Airline')
export class Airline {
  @Field(() => ID)
  code: string;

  @Field()
  name: string;
}
