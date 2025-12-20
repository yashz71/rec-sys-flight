import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class PriceInput {
  @Field()
  seatClassType: string; // Economy, Business, First

  @Field(() => Float)
  amount: number; // Prix (FLOAT pour les décimales)

  @Field({ defaultValue: 'USD' })
  currency: string;
}