import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
export declare class StationsService {
    private db;
    constructor(db: NodePgDatabase<typeof schema>);
    search(query: string, limit?: number): Promise<{
        code: string;
        name: string;
        city: string;
    }[]>;
}
