import { AuthService } from './auth.service';
import { GoogleAuthDto } from './dto/google-auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    googleLogin(dto: GoogleAuthDto): Promise<{
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
