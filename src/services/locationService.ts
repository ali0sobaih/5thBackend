// services/location.service.ts
import { db } from "../db/connection";
import { location } from "../validations/location.validation";
import { locationsTable } from "../db/schemas/locations";

export const createLocationService = async (locationData: location) => {
  const result = await db.insert(locationsTable).values(locationData);

  const insertedId = result[0].insertId; 

  return { id: insertedId, ...locationData };
};
