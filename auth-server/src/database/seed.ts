import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { DatabaseSeeder } from './seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const seeder = app.get(DatabaseSeeder);

  try {
    await seeder.seed();
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await app.close();
  }
}

bootstrap(); 