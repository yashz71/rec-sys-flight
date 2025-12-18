import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { FlightsService } from './flights.service';
import { Flight } from './models/flight.model';
import { FlightSearchInput } from './inputs/flight-search.input';

@Resolver(() => Flight)
export class FlightsResolver {
  constructor(private readonly flightsService: FlightsService) {}

  @Query(() => [Flight], { 
    name: 'flights',
    description: 'Get all available flights with full details'
  })
  async getFlights(): Promise<Flight[]> {
    return await this.flightsService.getAllFlights();
  }

  @Query(() => Flight, { 
    name: 'flight',
    description: 'Get a specific flight by ID'
  })
  async getFlight(
    @Args('flightID', { type: () => ID }) flightID: string
  ): Promise<Flight> {
    return await this.flightsService.getFlightById(flightID);
  }

  @Query(() => [Flight], { 
    name: 'searchFlights',
    description: 'Search flights with various filters'
  })
  async searchFlights(
    @Args('search') search: FlightSearchInput
  ): Promise<Flight[]> {
    return await this.flightsService.searchFlights(search);
  }

  @Query(() => [Flight], { 
    name: 'connectingFlights',
    description: 'Find flights with one connection between two airports',
    nullable: true
  })
  async getConnectingFlights(
    @Args('originAirportID', { type: () => ID }) originAirportID: string,
    @Args('destinationAirportID', { type: () => ID }) destinationAirportID: string,
  ) {
    return await this.flightsService.findConnectingFlights(
      originAirportID,
      destinationAirportID,
    );
  }
}

