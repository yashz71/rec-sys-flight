import { ObjectType, Field } from '@nestjs/graphql';
import { Flight } from './flight.model';
import { Airport } from './airport.model';

@ObjectType('ConnectingFlight')
export class ConnectingFlight {
  @Field(() => Flight)
  firstFlight: Flight;

  @Field(() => Flight)
  secondFlight: Flight;

  @Field(() => Airport)
  hubAirport: Airport;
}