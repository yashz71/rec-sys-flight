import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class FlightMetadata {
  @Field(() => [CodeName])
  airlines: CodeName[];

  @Field(() => [CodeName])
  airports: CodeName[];
}

@ObjectType()
class CodeName {
  @Field()
  code: string;

  @Field()
  name: string;
}