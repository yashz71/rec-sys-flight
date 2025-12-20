import { Resolver, Query, Args, ID, Int } from '@nestjs/graphql';
import { FlightsService } from './flights.service';
import { Flight } from './models/flight.model';
import { FlightSearchInput } from './inputs/flight-search.input';

@Resolver(() => Flight)
export class FlightsResolver {
  constructor(private readonly flightsService: FlightsService) {}

  @Query(() => [Flight], { 
    name: 'flights',
    description: 'Get all available flights with prices'
  })
  async getFlights(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 }) 
    limit: number
  ): Promise<Flight[]> {
    return await this.flightsService.getAllFlights(limit);
  }

  @Query(() => Flight, { 
    name: 'flight',
    description: 'Get a specific flight by flight number'
  })
  async getFlight(
    @Args('flightNumber') flightNumber: string
  ): Promise<Flight> {
    return await this.flightsService.getFlightByNumber(flightNumber);
  }

  @Query(() => [Flight], { 
    name: 'searchFlights',
    description: 'Search flights with various filters including price and seat class'
  })
  async searchFlights(
    @Args('search') search: FlightSearchInput
  ): Promise<Flight[]> {
    return await this.flightsService.searchFlights(search);
  }

  @Query(() => [Flight], { 
    name: 'recommendedFlights',
    description: 'Get recommended similar flights based on a flight number'
  })
  async getRecommendedFlights(
    @Args('flightNumber') flightNumber: string
  ): Promise<Flight[]> {
    return await this.flightsService.getRecommendedFlights(flightNumber);
  }
}