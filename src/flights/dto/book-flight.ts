import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class BookingResponse {
    @Field()
    success: boolean;
  
    @Field()
    message: string;
  }