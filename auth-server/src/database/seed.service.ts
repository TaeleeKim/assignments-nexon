import { Injectable, Logger } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { UserRole } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseSeeder {
  private readonly logger = new Logger(DatabaseSeeder.name);
  private readonly client: MongoClient;

  constructor() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined');
    }
    this.client = new MongoClient(uri);
  }

  async seed() {
    this.logger.log('Starting database seeding...');

    try {
      await this.client.connect();
      const db = this.client.db('auth');
      const usersCollection = db.collection('users');

      const defaultUsers = [
        {
          username: 'admin',
          email: 'admin@example.com',
          password: await bcrypt.hash('admin123', 10),
          role: UserRole.ADMIN,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'auditor',
          email: 'auditor@example.com',
          password: await bcrypt.hash('auditor123', 10),
          role: UserRole.AUDITOR,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'operator',
          email: 'operator@example.com',
          password: await bcrypt.hash('operator123', 10),
          role: UserRole.OPERATOR,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'user',
          email: 'user@example.com',
          password: await bcrypt.hash('user123', 10),
          role: UserRole.USER,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      for (const userData of defaultUsers) {
        try {
          const result = await usersCollection.updateOne(
            { email: userData.email },
            { $setOnInsert: userData },
            { upsert: true }
          );
          
          if (result.upsertedCount > 0) {
            this.logger.log(`Created user: ${userData.email}`);
          } else {
            this.logger.log(`User already exists: ${userData.email}`);
          }
        } catch (error) {
          this.logger.error(`Error creating user ${userData.email}:`, error);
        }
      }

      this.logger.log('Database seeding completed');
    } catch (error) {
      this.logger.error('Database connection failed:', error);
    } finally {
      await this.client.close();
    }
  }
} 