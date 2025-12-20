import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType('SeatClass')
export class SeatClass {
  @Field()
  type: string; // Economy, Business, First

  @Field(() => Float)
  amount: number;

  @Field()
  currency: string;
}