import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private jwtService;
    private usersService;
    private configService;
    private googleClient;
    constructor(jwtService: JwtService, usersService: UsersService, configService: ConfigService);
    googleLogin(idToken: string): Promise<{
        accessToken: string;
        user: {
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
        };
    }>;
}
