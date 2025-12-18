import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';
import { Flight } from './models/flight.model';
import { FlightSearchInput } from './inputs/flight-search.input';

@Injectable()
export class FlightsService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getAllFlights(): Promise<Flight[]> {
    const cypher = `
      MATCH (f:Flight)-[:OF]->(airline:Airline)-[:BELONGS_TO]->(airlineCountry:Country)
      MATCH (f)-[:ORIGINATION]->(origin:Airport)-[:IS_IN]->(originCity:City)-[:EXISTS_IN]->(originCountry:Country)
      MATCH (f)-[:DESTINATION]->(dest:Airport)-[:IS_IN]->(destCity:City)-[:EXISTS_IN]->(destCountry:Country)
      RETURN f.flightID as flightID,
             airline.airlineID as airlineID,
             airline.airlineName as airlineName,
             airlineCountry.countryID as airlineCountryID,
             airlineCountry.countryName as airlineCountryName,
             origin.airportID as originAirportID,
             origin.airportName as originAirportName,
             originCity.cityID as originCityID,
             originCity.cityName as originCityName,
             originCountry.countryID as originCountryID,
             originCountry.countryName as originCountryName,
             dest.airportID as destAirportID,
             dest.airportName as destAirportName,
             destCity.cityID as destCityID,
             destCity.cityName as destCityName,
             destCountry.countryID as destCountryID,
             destCountry.countryName as destCountryName
    `;

    const results = await this.neo4jService.read(cypher);
    
    return results.map(r => ({
      flightID: r.flightID,
      airline: {
        airlineID: r.airlineID,
        airlineName: r.airlineName,
        country: {
          countryID: r.airlineCountryID,
          countryName: r.airlineCountryName,
        },
      },
      originAirport: {
        airportID: r.originAirportID,
        airportName: r.originAirportName,
        city: {
          cityID: r.originCityID,
          cityName: r.originCityName,
          country: {
            countryID: r.originCountryID,
            countryName: r.originCountryName,
          },
        },
      },
      destinationAirport: {
        airportID: r.destAirportID,
        airportName: r.destAirportName,
        city: {
          cityID: r.destCityID,
          cityName: r.destCityName,
          country: {
            countryID: r.destCountryID,
            countryName: r.destCountryName,
          },
        },
      },
    }));
  }

  async searchFlights(search: FlightSearchInput): Promise<Flight[]> {
    const conditions: any = [];
    const params: any = {};

    if (search.originAirportID) {
      conditions.push('origin.airportID = $originAirportID');
      params.originAirportID = search.originAirportID;
    }

    if (search.destinationAirportID) {
      conditions.push('dest.airportID = $destinationAirportID');
      params.destinationAirportID = search.destinationAirportID;
    }

    if (search.airlineID) {
      conditions.push('airline.airlineID = $airlineID');
      params.airlineID = search.airlineID;
    }

    if (search.originCityID) {
      conditions.push('originCity.cityID = $originCityID');
      params.originCityID = search.originCityID;
    }

    if (search.destinationCityID) {
      conditions.push('destCity.cityID = $destinationCityID');
      params.destinationCityID = search.destinationCityID;
    }

    if (search.originCountryID) {
      conditions.push('originCountry.countryID = $originCountryID');
      params.originCountryID = search.originCountryID;
    }

    if (search.destinationCountryID) {
      conditions.push('destCountry.countryID = $destinationCountryID');
      params.destinationCountryID = search.destinationCountryID;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const cypher = `
      MATCH (f:Flight)-[:OF]->(airline:Airline)-[:BELONGS_TO]->(airlineCountry:Country)
      MATCH (f)-[:ORIGINATION]->(origin:Airport)-[:IS_IN]->(originCity:City)-[:EXISTS_IN]->(originCountry:Country)
      MATCH (f)-[:DESTINATION]->(dest:Airport)-[:IS_IN]->(destCity:City)-[:EXISTS_IN]->(destCountry:Country)
      ${whereClause}
      RETURN f.flightID as flightID,
             airline.airlineID as airlineID,
             airline.airlineName as airlineName,
             airlineCountry.countryID as airlineCountryID,
             airlineCountry.countryName as airlineCountryName,
             origin.airportID as originAirportID,
             origin.airportName as originAirportName,
             originCity.cityID as originCityID,
             originCity.cityName as originCityName,
             originCountry.countryID as originCountryID,
             originCountry.countryName as originCountryName,
             dest.airportID as destAirportID,
             dest.airportName as destAirportName,
             destCity.cityID as destCityID,
             destCity.cityName as destCityName,
             destCountry.countryID as destCountryID,
             destCountry.countryName as destCountryName
    `;

    const results = await this.neo4jService.read(cypher, params);
    
    return results.map(r => ({
      flightID: r.flightID,
      airline: {
        airlineID: r.airlineID,
        airlineName: r.airlineName,
        country: {
          countryID: r.airlineCountryID,
          countryName: r.airlineCountryName,
        },
      },
      originAirport: {
        airportID: r.originAirportID,
        airportName: r.originAirportName,
        city: {
          cityID: r.originCityID,
          cityName: r.originCityName,
          country: {
            countryID: r.originCountryID,
            countryName: r.originCountryName,
          },
        },
      },
      destinationAirport: {
        airportID: r.destAirportID,
        airportName: r.destAirportName,
        city: {
          cityID: r.destCityID,
          cityName: r.destCityName,
          country: {
            countryID: r.destCountryID,
            countryName: r.destCountryName,
          },
        },
      },
    }));
  }

  async getFlightById(flightID: string): Promise<Flight> {
    const cypher = `
      MATCH (f:Flight {flightID: $flightID})-[:OF]->(airline:Airline)-[:BELONGS_TO]->(airlineCountry:Country)
      MATCH (f)-[:ORIGINATION]->(origin:Airport)-[:IS_IN]->(originCity:City)-[:EXISTS_IN]->(originCountry:Country)
      MATCH (f)-[:DESTINATION]->(dest:Airport)-[:IS_IN]->(destCity:City)-[:EXISTS_IN]->(destCountry:Country)
      RETURN f.flightID as flightID,
             airline.airlineID as airlineID,
             airline.airlineName as airlineName,
             airlineCountry.countryID as airlineCountryID,
             airlineCountry.countryName as airlineCountryName,
             origin.airportID as originAirportID,
             origin.airportName as originAirportName,
             originCity.cityID as originCityID,
             originCity.cityName as originCityName,
             originCountry.countryID as originCountryID,
             originCountry.countryName as originCountryName,
             dest.airportID as destAirportID,
             dest.airportName as destAirportName,
             destCity.cityID as destCityID,
             destCity.cityName as destCityName,
             destCountry.countryID as destCountryID,
             destCountry.countryName as destCountryName
    `;

    const results = await this.neo4jService.read(cypher, { flightID });
    
    if (results.length === 0) {
      throw new Error('Flight not found');
    }

    const r = results[0];
    return {
      flightID: r.flightID,
      airline: {
        airlineID: r.airlineID,
        airlineName: r.airlineName,
        country: {
          countryID: r.airlineCountryID,
          countryName: r.airlineCountryName,
        },
      },
      originAirport: {
        airportID: r.originAirportID,
        airportName: r.originAirportName,
        city: {
          cityID: r.originCityID,
          cityName: r.originCityName,
          country: {
            countryID: r.originCountryID,
            countryName: r.originCountryName,
          },
        },
      },
      destinationAirport: {
        airportID: r.destAirportID,
        airportName: r.destAirportName,
        city: {
          cityID: r.destCityID,
          cityName: r.destCityName,
          country: {
            countryID: r.destCountryID,
            countryName: r.destCountryName,
          },
        },
      },
    };
  }

  async findConnectingFlights(originAirportID: string, destAirportID: string) {
    const cypher = `
      MATCH path = (origin:Airport {airportID: $originAirportID})
                   <-[:ORIGINATION]-(f1:Flight)-[:DESTINATION]->
                   (hub:Airport)
                   <-[:ORIGINATION]-(f2:Flight)-[:DESTINATION]->
                   (dest:Airport {airportID: $destAirportID})
      WHERE origin <> hub AND hub <> dest
      WITH f1, f2, hub
      MATCH (f1)-[:OF]->(a1:Airline)-[:BELONGS_TO]->(ac1:Country)
      MATCH (f1)-[:ORIGINATION]->(o1:Airport)-[:IS_IN]->(oc1:City)-[:EXISTS_IN]->(occ1:Country)
      MATCH (f1)-[:DESTINATION]->(d1:Airport)-[:IS_IN]->(dc1:City)-[:EXISTS_IN]->(dcc1:Country)
      MATCH (f2)-[:OF]->(a2:Airline)-[:BELONGS_TO]->(ac2:Country)
      MATCH (f2)-[:ORIGINATION]->(o2:Airport)-[:IS_IN]->(oc2:City)-[:EXISTS_IN]->(occ2:Country)
      MATCH (f2)-[:DESTINATION]->(d2:Airport)-[:IS_IN]->(dc2:City)-[:EXISTS_IN]->(dcc2:Country)
      RETURN f1, f2, hub, a1, ac1, o1, oc1, occ1, d1, dc1, dcc1,
             a2, ac2, o2, oc2, occ2, d2, dc2, dcc2
      LIMIT 10
    `;

    return await this.neo4jService.read(cypher, { originAirportID, destAirportID });
  }
}
