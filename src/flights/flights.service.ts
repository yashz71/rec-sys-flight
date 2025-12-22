import { Injectable } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';
import { Flight } from './models/flight.model';
import { FlightSearchInput } from './inputs/flight-search.input';
import { int, Integer } from 'neo4j-driver';

@Injectable()
export class FlightsService {
  constructor(private readonly neo4jService: Neo4jService) {}

  // Récupérer tous les vols avec tous les détails
  async getAllFlights(limit: number = 50): Promise<Flight[]> {
    const cypher = `
      MATCH (f:Flight)-[:OPERATES]-(airline:Airline)
      MATCH (f)-[:DEPARTS_FROM]->(depAirport:Airport)-[:LOCATED_IN]->(depCity:City)
      MATCH (f)-[:ARRIVES_AT]->(arrAirport:Airport)-[:LOCATED_IN]->(arrCity:City)
      OPTIONAL MATCH (f)-[hp:HAS_PRICE]->(sc:SeatClass)
      WITH f, airline, depAirport, depCity, arrAirport, arrCity,
           collect({
             type: sc.type,
             amount: hp.amount,
             currency: hp.currency
           }) as prices
      RETURN f.flightNumber as flightNumber,
             f.departure as departure,
             f.arrival as arrival,
             f.duration as duration,
             airline.code as airlineCode,
             airline.name as airlineName,
             depAirport.code as depAirportCode,
             depCity.name as depCityName,
             depCity.country as depCountry,
             arrAirport.code as arrAirportCode,
             arrCity.name as arrCityName,
             arrCity.country as arrCountry,
             prices
      LIMIT $limit
    `;

    const results = await this.neo4jService.read(cypher, { 
      limit: int(limit)
    });
    
    return results.map(r => ({
      flightNumber: r.flightNumber,
      departure: new Date(r.departure),
      arrival: new Date(r.arrival),
      duration: r.duration.toNumber ? r.duration.toNumber() : r.duration,
      airline: {
        code: r.airlineCode,
        name: r.airlineName,
      },
      departureAirport: {
        code: r.depAirportCode,
        city: {
          code: r.depAirportCode,
          name: r.depCityName,
          country: r.depCountry,
        },
      },
      arrivalAirport: {
        code: r.arrAirportCode,
        city: {
          code: r.arrAirportCode,
          name: r.arrCityName,
          country: r.arrCountry,
        },
      },
      prices: r.prices.filter(p => p.type !== null),
    }));
  }

  // Recherche de vols avec filtres avancés
  async searchFlights(search: FlightSearchInput): Promise<Flight[]> {
    const conditions: String[] = [];
    const params: any = { 
      limit: int(search.limit || 50)  // ✅ Force Integer
    };
    if (search.departureAirportCode) {
      conditions.push('depAirport.code = $departureAirportCode');
      params.departureAirportCode = search.departureAirportCode;
    }

    if (search.arrivalAirportCode) {
      conditions.push('arrAirport.code = $arrivalAirportCode');
      params.arrivalAirportCode = search.arrivalAirportCode;
    }

    if (search.airlineCode) {
      conditions.push('airline.code = $airlineCode');
      params.airlineCode = search.airlineCode;
    }

    if (search.departureCity) {
      conditions.push('depCity.name = $departureCity');
      params.departureCity = search.departureCity;
    }

    if (search.arrivalCity) {
      conditions.push('arrCity.name = $arrivalCity');
      params.arrivalCity = search.arrivalCity;
    }

    if (search.departureCountry) {
      conditions.push('depCity.country = $departureCountry');
      params.departureCountry = search.departureCountry;
    }

    if (search.arrivalCountry) {
      conditions.push('arrCity.country = $arrivalCountry');
      params.arrivalCountry = search.arrivalCountry;
    }

    if (search.departureDate) {
      conditions.push('date(f.departure) = date($departureDate)');
      params.departureDate = search.departureDate;
    }

    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}` 
      : '';

    // Filtre par prix et classe de siège si spécifié
    let priceFilter = '';
    if (search.maxPrice) {
      priceFilter = `AND hp.amount <= $maxPrice`;
      params.maxPrice = int(search.maxPrice);  // ✅
    }

    if (search.seatClass) {
      priceFilter += ` AND sc.type = $seatClass`;
      params.seatClass = search.seatClass;
    }

    const cypher = `
      MATCH (f:Flight)-[:OPERATES]-(airline:Airline)
      MATCH (f)-[:DEPARTS_FROM]->(depAirport:Airport)-[:LOCATED_IN]->(depCity:City)
      MATCH (f)-[:ARRIVES_AT]->(arrAirport:Airport)-[:LOCATED_IN]->(arrCity:City)
      ${whereClause}
      OPTIONAL MATCH (f)-[hp:HAS_PRICE]->(sc:SeatClass)
      ${priceFilter ? 'WHERE 1=1 ' + priceFilter : ''}
      WITH f, airline, depAirport, depCity, arrAirport, arrCity,
           collect({
             type: sc.type,
             amount: hp.amount,
             currency: hp.currency
           }) as prices
      RETURN f.flightNumber as flightNumber,
             f.departure as departure,
             f.arrival as arrival,
             f.duration as duration,
             airline.code as airlineCode,
             airline.name as airlineName,
             depAirport.code as depAirportCode,
             depCity.name as depCityName,
             depCity.country as depCountry,
             arrAirport.code as arrAirportCode,
             arrCity.name as arrCityName,
             arrCity.country as arrCountry,
             prices
      LIMIT $limit
    `;

    const results = await this.neo4jService.read(cypher, params);
    
    return results.map(r => ({
      flightNumber: r.flightNumber,
      departure: new Date(r.departure),
      arrival: new Date(r.arrival),
      duration: r.duration.toNumber ? r.duration.toNumber() : r.duration,
      airline: {
        code: r.airlineCode,
        name: r.airlineName,
      },
      departureAirport: {
        code: r.depAirportCode,
        city: {
          code: r.depAirportCode,
          name: r.depCityName,
          country: r.depCountry,
        },
      },
      arrivalAirport: {
        code: r.arrAirportCode,
        city: {
          code: r.arrAirportCode,
          name: r.arrCityName,
          country: r.arrCountry,
        },
      },
      prices: r.prices.filter(p => p.type !== null),
    }));
  }

  // Récupérer un vol spécifique par son numéro
  async getFlightByNumber(flightNumber: string): Promise<Flight> {
    const cypher = `
      MATCH (f:Flight {flightNumber: $flightNumber})-[:OPERATES]-(airline:Airline)
      MATCH (f)-[:DEPARTS_FROM]->(depAirport:Airport)-[:LOCATED_IN]->(depCity:City)
      MATCH (f)-[:ARRIVES_AT]->(arrAirport:Airport)-[:LOCATED_IN]->(arrCity:City)
      OPTIONAL MATCH (f)-[hp:HAS_PRICE]->(sc:SeatClass)
      WITH f, airline, depAirport, depCity, arrAirport, arrCity,
           collect({
             type: sc.type,
             amount: hp.amount,
             currency: hp.currency
           }) as prices
      RETURN f.flightNumber as flightNumber,
             f.departure as departure,
             f.arrival as arrival,
             f.duration as duration,
             airline.code as airlineCode,
             airline.name as airlineName,
             depAirport.code as depAirportCode,
             depCity.name as depCityName,
             depCity.country as depCountry,
             arrAirport.code as arrAirportCode,
             arrCity.name as arrCityName,
             arrCity.country as arrCountry,
             prices
    `;

    const results = await this.neo4jService.read(cypher, { flightNumber });
    
    if (results.length === 0) {
      throw new Error('Flight not found');
    }

    const r = results[0];
    return {
      flightNumber: r.flightNumber,
      departure: new Date(r.departure),
      arrival: new Date(r.arrival),
      duration: r.duration.toNumber ? r.duration.toNumber() : r.duration,
      airline: {
        code: r.airlineCode,
        name: r.airlineName,
      },
      departureAirport: {
        code: r.depAirportCode,
        city: {
          code: r.depAirportCode,
          name: r.depCityName,
          country: r.depCountry,
        },
      },
      arrivalAirport: {
        code: r.arrAirportCode,
        city: {
          code: r.arrAirportCode,
          name: r.arrCityName,
          country: r.arrCountry,
        },
      },
      prices: r.prices.filter(p => p.type !== null),
    };
  }

  // Trouver des vols de connexion (1 escale)
  async findConnectingFlights(
    departureCode: string, 
    arrivalCode: string,
    maxPrice?: number
  ) {
    const cypher = `
      MATCH (f1:Flight)-[:DEPARTS_FROM]->(dep:Airport {code: $departureCode})
      MATCH (f1)-[:ARRIVES_AT]->(hub:Airport)
      MATCH (f2:Flight)-[:DEPARTS_FROM]->(hub)
      MATCH (f2)-[:ARRIVES_AT]->(arr:Airport {code: $arrivalCode})
      WHERE f1.arrival < f2.departure
        AND duration.between(f1.arrival, f2.departure).minutes >= 60
        AND duration.between(f1.arrival, f2.departure).minutes <= 360
      OPTIONAL MATCH (f1)-[hp1:HAS_PRICE]->(sc1:SeatClass)
      OPTIONAL MATCH (f2)-[hp2:HAS_PRICE]->(sc2:SeatClass)
      WHERE sc1.type = sc2.type
        ${maxPrice ? 'AND (hp1.amount + hp2.amount) <= $maxPrice' : ''}
      RETURN f1.flightNumber as flight1,
             f2.flightNumber as flight2,
             hub.code as hubCode,
             sc1.type as seatClass,
             (hp1.amount + hp2.amount) as totalPrice,
             hp1.currency as currency
      ORDER BY totalPrice
      LIMIT 10
    `;

    return await this.neo4jService.read(cypher, { 
      departureCode, 
      arrivalCode,
      ...(maxPrice && { maxPrice })
    });
  }

  // Recommandations de vols similaires
  async getRecommendedFlights(flightNumber: string): Promise<Flight[]> {
    const cypher = `
      MATCH (original:Flight {flightNumber: $flightNumber})
      MATCH (original)-[:DEPARTS_FROM]->(depAirport:Airport)
      MATCH (original)-[:ARRIVES_AT]->(arrAirport:Airport)
      
      // Trouver des vols similaires (même route ou compagnie)
      MATCH (similar:Flight)-[:DEPARTS_FROM]->(depAirport)
      MATCH (similar)-[:ARRIVES_AT]->(arrAirport)
      WHERE similar.flightNumber <> $flightNumber
      
      MATCH (similar)-[:OPERATES]-(airline:Airline)
      MATCH (depAirport)-[:LOCATED_IN]->(depCity:City)
      MATCH (arrAirport)-[:LOCATED_IN]->(arrCity:City)
      OPTIONAL MATCH (similar)-[hp:HAS_PRICE]->(sc:SeatClass)
      
      WITH similar, airline, depAirport, depCity, arrAirport, arrCity,
           collect({
             type: sc.type,
             amount: hp.amount,
             currency: hp.currency
           }) as prices
      
      RETURN similar.flightNumber as flightNumber,
             similar.departure as departure,
             similar.arrival as arrival,
             similar.duration as duration,
             airline.code as airlineCode,
             airline.name as airlineName,
             depAirport.code as depAirportCode,
             depCity.name as depCityName,
             depCity.country as depCountry,
             arrAirport.code as arrAirportCode,
             arrCity.name as arrCityName,
             arrCity.country as arrCountry,
             prices
      LIMIT $limit
    `;

    const results = await this.neo4jService.read(cypher, { flightNumber });
    
    return results.map(r => ({
      flightNumber: r.flightNumber,
      departure: new Date(r.departure),
      arrival: new Date(r.arrival),
      duration: r.duration.toNumber ? r.duration.toNumber() : r.duration,
      airline: {
        code: r.airlineCode,
        name: r.airlineName,
      },
      departureAirport: {
        code: r.depAirportCode,
        city: {
          code: r.depAirportCode,
          name: r.depCityName,
          country: r.depCountry,
        },
      },
      arrivalAirport: {
        code: r.arrAirportCode,
        city: {
          code: r.arrAirportCode,
          name: r.arrCityName,
          country: r.arrCountry,
        },
      },
      prices: r.prices.filter(p => p.type !== null),
    }));
  }
}