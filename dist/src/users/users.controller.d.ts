import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
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
    updateProfile(req: any, dto: UpdateProfileDto): Promise<{
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
