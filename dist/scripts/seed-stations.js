"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const path = require("path");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const schema = require("../src/database/schema");
const fs = require("fs");
dotenv.config();
async function seedStations() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error('DATABASE_URL is not set');
    }
    const pool = new pg_1.Pool({ connectionString: databaseUrl });
    const db = (0, node_postgres_1.drizzle)(pool, { schema });
    const jsonPath = path.join(__dirname, '../stations.json');
    if (!fs.existsSync(jsonPath)) {
        throw new Error(`stations.json not found at ${jsonPath}`);
    }
    console.log('Reading stations.json...');
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(raw);
    if (!data.features || !Array.isArray(data.features)) {
        throw new Error('Invalid stations.json: expected features array');
    }
    const toInsert = data.features
        .filter((f) => f.properties?.code && f.properties?.name)
        .map((f) => {
        const coords = f.geometry?.coordinates;
        return {
            code: f.properties.code,
            name: f.properties.name,
            state: f.properties.state ?? null,
            zone: f.properties.zone ?? null,
            address: f.properties.address ?? null,
            longitude: coords?.[0] ?? null,
            latitude: coords?.[1] ?? null,
        };
    });
    console.log(`Inserting ${toInsert.length} stations...`);
    const BATCH = 500;
    let inserted = 0;
    for (let i = 0; i < toInsert.length; i += BATCH) {
        const batch = toInsert.slice(i, i + BATCH);
        await db.insert(schema.stations).values(batch).onConflictDoNothing({
            target: schema.stations.code,
        });
        inserted += batch.length;
        process.stdout.write(`\r  ${inserted}/${toInsert.length}`);
    }
    console.log(`\nDone! Inserted ${inserted} stations.`);
    await pool.end();
}
seedStations().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=seed-stations.js.map