import * as dotenv from 'dotenv';
import * as path from 'path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../src/database/schema';
import * as fs from 'fs';

dotenv.config();

interface GeoJSONFeature {
  type: string;
  geometry: { type: string; coordinates: [number, number] } | null;
  properties: {
    state: string | null;
    code: string;
    name: string;
    zone: string | null;
    address: string | null;
  };
}

interface GeoJSONFeatureCollection {
  type: string;
  features: GeoJSONFeature[];
}

async function seedStations() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool, { schema });

  const jsonPath = path.join(__dirname, '../stations.json');
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`stations.json not found at ${jsonPath}`);
  }

  console.log('Reading stations.json...');
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const data: GeoJSONFeatureCollection = JSON.parse(raw);

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
