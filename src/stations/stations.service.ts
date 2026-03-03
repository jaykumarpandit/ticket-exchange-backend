import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { ilike, or } from 'drizzle-orm';

@Injectable()
export class StationsService {
  constructor(
    @Inject(DRIZZLE)
    private db: NodePgDatabase<typeof schema>,
  ) {}

  async search(query: string, limit = 10) {
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
      .where(
        or(
          ilike(schema.stations.name, `%${q}%`),
          ilike(schema.stations.code, `%${q}%`),
        ),
      )
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
}
