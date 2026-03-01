import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private usersService;
    constructor(configService: ConfigService, usersService: UsersService);
    validate(payload: {
        sub: string;
        email: string;
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
}
export {};
