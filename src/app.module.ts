import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Neo4jModule } from './neo4j/neo4j.module';
import { ConfigModule } from '@nestjs/config';
import { FlightsService } from './flights/flights.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { FlightsResolver } from './flights/flights.resolver';
import { FlightsModule } from './flights/flights.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
  GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Auto-generated schema
    sortSchema: true, // Sort schema alphabetically
    introspection: true,
    context: ({ req, res }) => ({ req, res }),
    
      formatError: (error) => {
        return {
          message: error.message,
          code: error.extensions?.code,
          locations: error.locations,
          path: error.path,
        };
      },
      
    }), 
    Neo4jModule, FlightsModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, FlightsService, FlightsResolver],
})
export class AppModule {}
