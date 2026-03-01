"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const google_auth_library_1 = require("google-auth-library");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(jwtService, usersService, configService) {
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.configService = configService;
        this.googleClient = new google_auth_library_1.OAuth2Client(this.configService.get('GOOGLE_CLIENT_ID'));
    }
    async googleLogin(idToken) {
        let payload;
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken,
                audience: this.configService.get('GOOGLE_CLIENT_ID'),
            });
            payload = ticket.getPayload();
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid Google token');
        }
        if (!payload || !payload.sub || !payload.email) {
            throw new common_1.UnauthorizedException('Invalid Google token payload');
        }
        const user = await this.usersService.findOrCreate({
            googleId: payload.sub,
            email: payload.email,
            name: payload.name ?? payload.email,
            avatar: payload.picture,
        });
        const accessToken = this.jwtService.sign({
            sub: user.id,
            email: user.email,
        });
        return { accessToken, user };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map