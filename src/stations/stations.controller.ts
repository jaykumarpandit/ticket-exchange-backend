import { Controller, Get, Query } from '@nestjs/common';
import { StationsService } from './stations.service';

@Controller('stations')
export class StationsController {
  constructor(private stationsService: StationsService) {}

  @Get('search')
  async search(
    @Query('q') q: string,
    @Query('limit') limit?: string,
  ) {
    console.log('[StationsController] search called', { q, limit });
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const result = await this.stationsService.search(q ?? '', Math.min(limitNum || 10, 50));
    console.log('[StationsController] search result count:', result.length);
    return result;
  }
}
