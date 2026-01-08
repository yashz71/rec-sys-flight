import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class FlightSearchInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  departureAirportCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  arrivalAirportCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  airlineCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  departureCity?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  arrivalCity?: string;

  @Field({ nullable: true }) 
  @IsOptional()
  @IsString()
  departureCountry?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  arrivalCountry?: string;

  @Field({ nullable: true })
  @IsOptional() 
  @IsString()
  departureDate?: string; // Filtre par date de départ

  @Field(() => Float, { nullable: true })
  @IsOptional()
  maxPrice?: number; // Prix maximum (FLOAT)

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  seatClass?: string; // Economy, Business, First

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsOptional()
  limit?: number; 
}
