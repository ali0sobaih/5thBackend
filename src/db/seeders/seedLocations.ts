import { db } from "../connection";
import { locationsTable } from "../schemas/locations";

export async function seedLocations() {
  // Added export
  const existing = await db.select().from(locationsTable);

  if (existing.length === 0) {
    await db.insert(locationsTable).values([
      {
        center_long: -118.2437,
        center_lat: 34.0522,
      },
      {
        center_long: -74.006,
        center_lat: 40.7128,
      },
      {
        center_long: 2.3522,
        center_lat: 48.8566,
      },
      {
        area: [
          [-118.3, 34.0],
          [-118.2, 34.0],
          [-118.2, 34.1],
          [-118.3, 34.1],
          [-118.3, 34.0],
        ],
      },
      {
        area: [
          [-74.1, 40.7],
          [-73.9, 40.7],
          [-73.9, 40.8],
          [-74.1, 40.8],
          [-74.1, 40.7],
        ],
      },
      {
        area: [
          [2.3, 48.8],
          [2.4, 48.8],
          [2.4, 48.9],
          [2.3, 48.9],
          [2.3, 48.8],
        ],
      },
    ]);
    console.log("Seeded locations");
  } else {
    console.log("Locations already seeded");
  }
}

seedLocations().then(() => process.exit());