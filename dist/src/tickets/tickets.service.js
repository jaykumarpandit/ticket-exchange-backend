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
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const database_module_1 = require("../database/database.module");
const schema = require("../database/schema");
let TicketsService = class TicketsService {
    constructor(db) {
        this.db = db;
    }
    async create(userId, dto) {
        const { passengers, ...ticketBase } = dto;
        const createdTickets = await Promise.all(passengers.map((passenger) => this.db
            .insert(schema.tickets)
            .values({
            userId,
            trainNumber: ticketBase.trainNumber,
            trainName: ticketBase.trainName,
            fromStation: ticketBase.fromStation,
            fromStationCode: ticketBase.fromStationCode,
            toStation: ticketBase.toStation,
            toStationCode: ticketBase.toStationCode,
            journeyDate: ticketBase.journeyDate,
            pnr: ticketBase.pnr,
            travelClass: ticketBase.travelClass,
            quota: ticketBase.quota,
            price: ticketBase.price,
            passengerName: passenger.passengerName,
            passengerAge: passenger.passengerAge,
            passengerGender: passenger.passengerGender,
            seatNumber: passenger.seatNumber,
            status: 'available',
        })
            .returning()));
        return createdTickets.flat();
    }
    async findAll(search) {
        const conditions = [(0, drizzle_orm_1.eq)(schema.tickets.status, 'available')];
        if (search?.from) {
            conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema.tickets.fromStation, `%${search.from}%`), (0, drizzle_orm_1.ilike)(schema.tickets.fromStationCode, `%${search.from}%`)));
        }
        if (search?.to) {
            conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema.tickets.toStation, `%${search.to}%`), (0, drizzle_orm_1.ilike)(schema.tickets.toStationCode, `%${search.to}%`)));
        }
        const tickets = await this.db
            .select({
            ticket: schema.tickets,
            seller: {
                id: schema.users.id,
                name: schema.users.name,
                avatar: schema.users.avatar,
                mobile: schema.users.mobile,
                mobileVisible: schema.users.mobileVisible,
            },
        })
            .from(schema.tickets)
            .innerJoin(schema.users, (0, drizzle_orm_1.eq)(schema.tickets.userId, schema.users.id))
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.desc)(schema.tickets.createdAt));
        return tickets.map(({ ticket, seller }) => ({
            ...ticket,
            seller: {
                id: seller.id,
                name: seller.name,
                avatar: seller.avatar,
                mobile: seller.mobileVisible === 'anyone' ? seller.mobile : null,
                mobileVisible: seller.mobileVisible,
            },
        }));
    }
    async findMyTickets(userId) {
        return this.db
            .select()
            .from(schema.tickets)
            .where((0, drizzle_orm_1.eq)(schema.tickets.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema.tickets.createdAt));
    }
    async findOnePublic(ticketId) {
        const [row] = await this.db
            .select({
            ticket: schema.tickets,
            seller: {
                id: schema.users.id,
                name: schema.users.name,
                avatar: schema.users.avatar,
                mobile: schema.users.mobile,
                mobileVisible: schema.users.mobileVisible,
            },
        })
            .from(schema.tickets)
            .innerJoin(schema.users, (0, drizzle_orm_1.eq)(schema.tickets.userId, schema.users.id))
            .where((0, drizzle_orm_1.eq)(schema.tickets.id, ticketId));
        if (!row) {
            throw new common_1.NotFoundException('Ticket not found');
        }
        const { ticket, seller } = row;
        return {
            ...ticket,
            seller: {
                id: seller.id,
                name: seller.name,
                avatar: seller.avatar,
                mobile: seller.mobileVisible === 'anyone' ? seller.mobile : null,
                mobileVisible: seller.mobileVisible,
            },
        };
    }
    async markAsSold(ticketId, userId) {
        const [ticket] = await this.db
            .select()
            .from(schema.tickets)
            .where((0, drizzle_orm_1.eq)(schema.tickets.id, ticketId));
        if (!ticket)
            throw new common_1.NotFoundException('Ticket not found');
        if (ticket.userId !== userId)
            throw new common_1.ForbiddenException('You can only update your own tickets');
        const [updated] = await this.db
            .update(schema.tickets)
            .set({ status: 'sold', updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema.tickets.id, ticketId))
            .returning();
        return updated;
    }
    async delete(ticketId, userId) {
        const [ticket] = await this.db
            .select()
            .from(schema.tickets)
            .where((0, drizzle_orm_1.eq)(schema.tickets.id, ticketId));
        if (!ticket)
            throw new common_1.NotFoundException('Ticket not found');
        if (ticket.userId !== userId)
            throw new common_1.ForbiddenException('You can only delete your own tickets');
        await this.db
            .delete(schema.tickets)
            .where((0, drizzle_orm_1.eq)(schema.tickets.id, ticketId));
        return { message: 'Ticket deleted successfully' };
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map