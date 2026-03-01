import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { SearchTicketsDto } from './dto/search-tickets.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Get()
  findAll(@Query() search: SearchTicketsDto) {
    return this.ticketsService.findAll(search);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMyTickets(@Request() req: any) {
    return this.ticketsService.findMyTickets(req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req: any, @Body() dto: CreateTicketDto) {
    return this.ticketsService.create(req.user.id, dto);
  }

  @Patch(':id/sold')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  markAsSold(@Param('id') id: string, @Request() req: any) {
    return this.ticketsService.markAsSold(id, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string, @Request() req: any) {
    return this.ticketsService.delete(id, req.user.id);
  }
}
