"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketsRelations = exports.usersRelations = exports.tickets = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    googleId: (0, pg_core_1.text)('google_id').unique().notNull(),
    email: (0, pg_core_1.text)('email').unique().notNull(),
    name: (0, pg_core_1.text)('name').notNull(),
    avatar: (0, pg_core_1.text)('avatar'),
    mobile: (0, pg_core_1.text)('mobile'),
    mobileVisible: (0, pg_core_1.text)('mobile_visible').default('anyone'),
    isProfileComplete: (0, pg_core_1.boolean)('is_profile_complete').default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.tickets = (0, pg_core_1.pgTable)('tickets', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id')
        .references(() => exports.users.id, { onDelete: 'cascade' })
        .notNull(),
    trainNumber: (0, pg_core_1.text)('train_number').notNull(),
    trainName: (0, pg_core_1.text)('train_name').notNull(),
    fromStation: (0, pg_core_1.text)('from_station').notNull(),
    fromStationCode: (0, pg_core_1.text)('from_station_code').notNull(),
    toStation: (0, pg_core_1.text)('to_station').notNull(),
    toStationCode: (0, pg_core_1.text)('to_station_code').notNull(),
    journeyDate: (0, pg_core_1.text)('journey_date').notNull(),
    pnr: (0, pg_core_1.text)('pnr').notNull(),
    travelClass: (0, pg_core_1.text)('travel_class').notNull(),
    quota: (0, pg_core_1.text)('quota').notNull(),
    passengerName: (0, pg_core_1.text)('passenger_name').notNull(),
    passengerAge: (0, pg_core_1.integer)('passenger_age').notNull(),
    passengerGender: (0, pg_core_1.text)('passenger_gender').notNull(),
    seatNumber: (0, pg_core_1.text)('seat_number'),
    price: (0, pg_core_1.integer)('price').notNull(),
    status: (0, pg_core_1.text)('status').default('available').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    tickets: many(exports.tickets),
}));
exports.ticketsRelations = (0, drizzle_orm_1.relations)(exports.tickets, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.tickets.userId],
        references: [exports.users.id],
    }),
}));
//# sourceMappingURL=schema.js.map