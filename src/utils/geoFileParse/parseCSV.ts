// Updated parseCSV.ts
import csv from "csv-parser";
import fs from "fs";
import { GISData } from "../../validations/GISData.validation";
import { parseQuantity } from "../quantityParser";
import { ServerError } from "../../errors/serverErrors";

export const parseCSV = (
  filePath: string,
  author_id: number,
  note?: string
): Promise<GISData[]> => {
  return new Promise((resolve, reject) => {
    const results: GISData[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        // Process in chunks
        try {
          results.push({
            category_id: Number(row.category_id),
            condition: row.condition,
            accessibility: row.accessibility,
            location_id: Number(row.location_id),
            quantity: parseQuantity(row),
            author_id,
            note,
          });
        } catch (error) {
          reject(new ServerError("Error parsing row"));
        }
      })
      .on("end", () => resolve(results))
      .on("error", reject);
  });
};
