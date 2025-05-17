import { db } from "../db/connection";
import { location } from "../validations/location.validation";
import { locationsTable } from "../db/schemas/locations";
import { eq } from "drizzle-orm";

export const addLocationService = async (locationData: location) => {
  const location = await db.insert(locationsTable).values(locationData);

  const insertedId = location[0].insertId;

  const result = await db
    .select()
    .from(locationsTable)
    .where(eq(locationsTable.id, insertedId));

  return {
    message: "location was added successfully!",
    data: result,
    code: 200
  };
};

