import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
type DB = NodePgDatabase<typeof schema>;
export declare class UsersService {
    private db;
    constructor(db: DB);
    findById(id: string): Promise<{
        id: string;
        name: string;
        googleId: string;
        email: string;
        avatar: string;
        mobile: string;
        mobileVisible: string;
        isProfileComplete: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOrCreate(data: {
        googleId: string;
        email: string;
        name: string;
        avatar?: string;
    }): Promise<{
        id: string;
        name: string;
        googleId: string;
        email: string;
        avatar: string;
        mobile: string;
        mobileVisible: string;
        isProfileComplete: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        id: string;
        name: string;
        googleId: string;
        email: string;
        avatar: string;
        mobile: string;
        mobileVisible: string;
        isProfileComplete: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        name: string;
        googleId: string;
        email: string;
        avatar: string;
        mobile: string;
        mobileVisible: string;
        isProfileComplete: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
