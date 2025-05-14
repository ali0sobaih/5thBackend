// src/services/geoDataService.ts
import { db } from "../db/connection";
import { GISData } from "../validations/GISData.validation";
import { quantitiesTable, GISdataTable } from "../db/schemas/index";

export const addStudyGISData = async (
  geoData: GISData[],
  studyId: number,  
  authorId: number
) => {
  for (const geoItem of geoData) {
    let quantityId: number | null = null;

    // Insert quantity if present
    if (geoItem.quantity) {
      const result = await db.insert(quantitiesTable).values({
        string_val: geoItem.quantity.string_val,
        number_val: geoItem.quantity.number_val,
      });
      quantityId = result[0].insertId;
    }

    // Insert GIS data
    await db.insert(GISdataTable).values({
      category_id: geoItem.category_id,
      condition: geoItem.condition,
      accessibility: geoItem.accessibility,
      location_id: geoItem.locationId,
      study_id: studyId as number,
      quantity_id: quantityId,
      author_id: authorId,
    });
  }
};
