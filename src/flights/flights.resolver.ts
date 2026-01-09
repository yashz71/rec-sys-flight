import { Resolver, Query, Args, ID, Int, Mutation } from '@nestjs/graphql';
import { FlightsService } from './flights.service';
import { Flight } from './models/flight.model';
import { FlightSearchInput } from './dto/flight-search.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateFlightInput } from './dto/create-flight.input';
import { BookingResponse } from './dto/book-flight';
import { FlightMetadata } from './dto/flight-metadata';
@Resolver(() => Flight)
export class FlightsResolver {
  constructor(private readonly flightsService: FlightsService) {}

@Query(() => [Flight],{
  name: 'getRecommendedFlightsByOthers',
  description: 'A query for flight service recommendation'
})
@UseGuards(GqlAuthGuard)
async getRecommendedFlightsByOthers(@Args('userId') userId: string): Promise<Flight[]> {
  return await this.flightsService.getRecommendationsByOthers(userId);
}
@Query(() => [Flight],{
  name: 'getRecommendedFlightsByBooking',
  description: 'A query for flight service recommendation'
})
@UseGuards(GqlAuthGuard)
async getRecommendedFlightsByBooking(@Args('userId') userId: string): Promise<Flight[]> {
  return await this.flightsService.getRecommendationsByHistory(userId);
}

  @Mutation(() => BookingResponse)
  @UseGuards(GqlAuthGuard)
  async bookFlight(
    @Args('flightNumber') flightNumber: string,
    @Args('userId') userId: string,
  ): Promise<BookingResponse> {
    try {
      return await this.flightsService.bookFlight(userId, flightNumber);
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Query(() => [Flight], { 
    name: 'getFlights',
    description: 'Get all available flights with prices'
  })
  @UseGuards(GqlAuthGuard)
  async getFlights(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) 
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
 @Query(() => FlightMetadata)
@UseGuards(GqlAuthGuard, RolesGuard)
@Roles('ADMIN')
async getFlightMetadata() {
return this.flightsService.getFlightMetaData();
}
 
}