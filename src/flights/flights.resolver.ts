import { Resolver, Query, Args, ID, Int, Mutation } from '@nestjs/graphql';
import { FlightsService } from './flights.service';
import { Flight } from './models/flight.model';
import { FlightSearchInput } from './inputs/flight-search.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateFlightInput } from './inputs/create-flight.input';

@Resolver(() => Flight)
export class FlightsResolver {
  constructor(private readonly flightsService: FlightsService) {}

  @Query(() => [Flight], { 
    name: 'flights',
    description: 'Get all available flights with prices'
  })
  @UseGuards(GqlAuthGuard)
  async getFlights(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 }) 
    limit: number
  ): Promise<Flight[]> {
    return await this.flightsService.getAllFlights(limit);
  }

  @Query(() => Flight, { 
    name: 'getFlight',
    description: 'Get a specific flight by flight number'
  })
  @UseGuards(GqlAuthGuard)
  async getFlight(
    @Args('flightNumber') flightNumber: string
  ): Promise<Flight> {
    console.log("testing flight N",flightNumber);
    return await this.flightsService.getFlightByNumber(flightNumber);
  }

  @Query(() => [Flight], { 
    name: 'searchFlights',
    description: 'Search flights with various filters including price and seat class'
  })
  @UseGuards(GqlAuthGuard)
  async searchFlights(
    @Args('search') search: FlightSearchInput
  ): Promise<Flight[]> {
    console.log('Search Params in res: ', search); // Should now show the data
    return await this.flightsService.searchFlights(search);
  }
  @Mutation(() => Flight)
  @Roles('ADMIN')
  @UseGuards(GqlAuthGuard, RolesGuard)
  async createFlight(@Args('input') input: CreateFlightInput) {
    return this.flightsService.createFlight(input);
  }

  @Mutation(() => Flight)
  @Roles('ADMIN')
  @UseGuards(GqlAuthGuard, RolesGuard)
  async updateFlight(
    @Args('flightNumber') flightNumber: string,
    @Args('input') input: CreateFlightInput // Or a partial UpdateInput
  ) {
    return this.flightsService.updateFlight(flightNumber, input);
  }

  @Mutation(() => Boolean)
  @Roles('ADMIN')
  @UseGuards(GqlAuthGuard, RolesGuard)
  async deleteFlight(@Args('flightNumber') flightNumber: string) {
    return this.flightsService.deleteFlight(flightNumber);
  }
 @Query(()=>[String])
 async cities(){
  return this.flightsService.getAllcities();
 }
 
}