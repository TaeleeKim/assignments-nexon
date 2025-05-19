import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseSeeder } from './seed.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  providers: [DatabaseSeeder],
  exports: [DatabaseSeeder],
})
export class SeedModule {} 