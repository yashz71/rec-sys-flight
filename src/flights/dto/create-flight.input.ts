import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateFlightInput {
    @Field()  
    @IsString()
    flightNumber: string;
    @Field() 
    @IsString()
    departure: string;
    @Field() 
    @IsString()
    arrival: string;
    @Field() 
    duration: number;
    @Field() 
    @IsString()
    airlineCode: string; // To link the existing Airline
    @Field() 
    @IsString()
    depAirportCode: string; // To link departure Airport
    @Field() 
    @IsString()
    arrAirportCode: string; // To link arrival Airport
}