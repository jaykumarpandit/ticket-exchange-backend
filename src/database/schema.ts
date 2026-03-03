import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  doublePrecision,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  googleId: text('google_id').unique().notNull(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  avatar: text('avatar'),
  mobile: text('mobile'),
  mobileVisible: text('mobile_visible').default('anyone'), // 'anyone' | 'buyer'
  isProfileComplete: boolean('is_profile_complete').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const stations = pgTable('stations', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').unique().notNull(),
  name: text('name').notNull(),
  state: text('state'),
  zone: text('zone'),
  address: text('address'),
  longitude: doublePrecision('longitude'),
  latitude: doublePrecision('latitude'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tickets = pgTable('tickets', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),

  // Train details
  trainNumber: text('train_number').notNull(),
  trainName: text('train_name').notNull(),

  // Journey
  fromStation: text('from_station').notNull(),
  fromStationCode: text('from_station_code').notNull(),
  toStation: text('to_station').notNull(),
  toStationCode: text('to_station_code').notNull(),
  journeyDate: text('journey_date').notNull(), // YYYY-MM-DD

  // Booking
  pnr: text('pnr').notNull(),
  travelClass: text('travel_class').notNull(), // SL, 3A, 2A, 1A, CC, EC, 2S
  quota: text('quota').notNull(), // GN, TQ, LD, etc.

  // Passenger
  passengerName: text('passenger_name').notNull(),
  passengerAge: integer('passenger_age').notNull(),
  passengerGender: text('passenger_gender').notNull(), // M, F, T
  seatNumber: text('seat_number'),

  // Pricing
  price: integer('price').notNull(), // in INR

  // Status
  status: text('status').default('available').notNull(), // 'available' | 'sold'

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const stationsRelations = relations(stations, () => ({}));

export const usersRelations = relations(users, ({ many }) => ({
  tickets: many(tickets),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  user: one(users, {
    fields: [tickets.userId],
    references: [users.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Station = typeof stations.$inferSelect;
export type NewStation = typeof stations.$inferInsert;
export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;
