import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver, Session } from 'neo4j-driver';

@Injectable()
export class Neo4jService implements OnModuleInit, OnModuleDestroy {
  
  private driver: Driver;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const uri = this.configService.get<string>('NEO4J_URI')!;
    const username = this.configService.get<string>('NEO4J_USERNAME')!;
    const password = this.configService.get<string>('NEO4J_PASSWORD')!;

    this.driver = neo4j.driver(
      uri,
      neo4j.auth.basic(username, password),
      {
        maxConnectionPoolSize: 50,
        connectionAcquisitionTimeout: 2 * 60 * 1000, // 2 minutes
      }
    );

    // Verify connectivity
    try {
      await this.driver.verifyConnectivity();
      console.log('✅ Connected to Neo4j Aura successfully');
    } catch (error) {
      console.error('❌ Failed to connect to Neo4j Aura:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.driver.close();
  }

  getDriver(): Driver {
    return this.driver;
  }

  getSession(database?: string): Session {
    return this.driver.session({
      database: database || this.configService.get<string>('NEO4J_DATABASE'),
    });
  }

  async read(cypher: string, params?: any, database?: string) {
    const session = this.getSession(database);
    try {
      const result = await session.executeRead((tx) =>
        tx.run(cypher, params)
      );
      return result.records.map((record) => record.toObject());
    } finally {
      await session.close();
    }
  }

  async write(cypher: string, params?: any, database?: string) {
    const session = this.getSession(database);
    try {
      const result = await session.executeWrite((tx) =>
        tx.run(cypher, params)
      );
      return result.records.map((record) => record.toObject());
    } finally {
      await session.close();
    }
  }
}