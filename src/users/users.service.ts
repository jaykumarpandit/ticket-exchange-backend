import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

type DB = NodePgDatabase<typeof schema>;

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private db: DB) {}

  async findById(id: string) {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id));
    return user ?? null;
  }

  async findOrCreate(data: {
    googleId: string;
    email: string;
    name: string;
    avatar?: string;
  }) {
    const [existing] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.googleId, data.googleId));

    if (existing) return existing;

    const [created] = await this.db
      .insert(schema.users)
      .values({
        googleId: data.googleId,
        email: data.email,
        name: data.name,
        avatar: data.avatar,
        isProfileComplete: false,
      })
      .returning();

    return created;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const [updated] = await this.db
      .update(schema.users)
      .set({
        name: dto.name,
        mobile: dto.mobile,
        mobileVisible: dto.mobileVisible ?? 'anyone',
        isProfileComplete: true,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, userId))
      .returning();

    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async getProfile(userId: string) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
