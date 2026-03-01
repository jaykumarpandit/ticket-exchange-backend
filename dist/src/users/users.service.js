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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const database_module_1 = require("../database/database.module");
const schema = require("../database/schema");
let UsersService = class UsersService {
    constructor(db) {
        this.db = db;
    }
    async findById(id) {
        const [user] = await this.db
            .select()
            .from(schema.users)
            .where((0, drizzle_orm_1.eq)(schema.users.id, id));
        return user ?? null;
    }
    async findOrCreate(data) {
        const [existing] = await this.db
            .select()
            .from(schema.users)
            .where((0, drizzle_orm_1.eq)(schema.users.googleId, data.googleId));
        if (existing)
            return existing;
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
    async updateProfile(userId, dto) {
        const [updated] = await this.db
            .update(schema.users)
            .set({
            name: dto.name,
            mobile: dto.mobile,
            mobileVisible: dto.mobileVisible ?? 'anyone',
            isProfileComplete: true,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema.users.id, userId))
            .returning();
        if (!updated)
            throw new common_1.NotFoundException('User not found');
        return updated;
    }
    async getProfile(userId) {
        const user = await this.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], UsersService);
//# sourceMappingURL=users.service.js.map