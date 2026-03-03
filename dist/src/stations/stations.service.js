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
exports.StationsService = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../database/database.module");
const schema = require("../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
let StationsService = class StationsService {
    constructor(db) {
        this.db = db;
    }
    async search(query, limit = 10) {
        const q = query.trim();
        console.log('[StationsService] search', { query, q, limit });
        if (!q || q.length < 2) {
            console.log('[StationsService] query too short, returning []');
            return [];
        }
        const results = await this.db
            .select({
            code: schema.stations.code,
            name: schema.stations.name,
            state: schema.stations.state,
            address: schema.stations.address,
            zone: schema.stations.zone,
        })
            .from(schema.stations)
            .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema.stations.name, `%${q}%`), (0, drizzle_orm_1.ilike)(schema.stations.code, `%${q}%`)))
            .limit(limit)
            .execute();
        console.log('results 123 ', results);
        console.log('[StationsService] DB returned', results.length, 'rows');
        return results.map((s) => ({
            code: s.code,
            name: s.name,
            city: s.address ?? s.state ?? s.zone ?? '',
        }));
    }
};
exports.StationsService = StationsService;
exports.StationsService = StationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], StationsService);
//# sourceMappingURL=stations.service.js.map