import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { eq, and, or, ilike, desc } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { SearchTicketsDto } from './dto/search-tickets.dto';

type DB = NodePgDatabase<typeof schema>;

@Injectable()
export class TicketsService {
  constructor(@Inject(DRIZZLE) private db: DB) {}

  async create(userId: string, dto: CreateTicketDto) {
    const { passengers, ...ticketBase } = dto;

    const createdTickets = await Promise.all(
      passengers.map((passenger) =>
        this.db
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
          .returning(),
      ),
    );

    return createdTickets.flat();
  }

  async findAll(search?: SearchTicketsDto) {
    const conditions = [eq(schema.tickets.status, 'available')];

    if (search?.from) {
      conditions.push(
        or(
          ilike(schema.tickets.fromStation, `%${search.from}%`),
          ilike(schema.tickets.fromStationCode, `%${search.from}%`),
        ) as any,
      );
    }

    if (search?.to) {
      conditions.push(
        or(
          ilike(schema.tickets.toStation, `%${search.to}%`),
          ilike(schema.tickets.toStationCode, `%${search.to}%`),
        ) as any,
      );
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
      .innerJoin(schema.users, eq(schema.tickets.userId, schema.users.id))
      .where(and(...conditions))
      .orderBy(desc(schema.tickets.createdAt));

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

  async findMyTickets(userId: string) {
    return this.db
      .select()
      .from(schema.tickets)
      .where(eq(schema.tickets.userId, userId))
      .orderBy(desc(schema.tickets.createdAt));
  }

  async markAsSold(ticketId: string, userId: string) {
    const [ticket] = await this.db
      .select()
      .from(schema.tickets)
      .where(eq(schema.tickets.id, ticketId));

    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.userId !== userId)
      throw new ForbiddenException('You can only update your own tickets');

    const [updated] = await this.db
      .update(schema.tickets)
      .set({ status: 'sold', updatedAt: new Date() })
      .where(eq(schema.tickets.id, ticketId))
      .returning();

    return updated;
  }

  async delete(ticketId: string, userId: string) {
    const [ticket] = await this.db
      .select()
      .from(schema.tickets)
      .where(eq(schema.tickets.id, ticketId));

    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.userId !== userId)
      throw new ForbiddenException('You can only delete your own tickets');

    await this.db
      .delete(schema.tickets)
      .where(eq(schema.tickets.id, ticketId));

    return { message: 'Ticket deleted successfully' };
  }
}
