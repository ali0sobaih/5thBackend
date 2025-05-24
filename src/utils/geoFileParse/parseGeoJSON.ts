import { FeatureCollection } from "geojson";
import fs from "fs";

export const parseGeoJSON = (
  filePath: string,
  author_id: number,
  note?: string
) => {
  const geoData: FeatureCollection = JSON.parse(
    fs.readFileSync(filePath, "utf-8")
  );
  return geoData.features.map((feature) => ({
    category_id: Number(feature.properties?.category_id),
    condition: feature.properties?.condition,
    accessibility: feature.properties?.accessibility,
    location_id: Number(feature.properties?.location_id),
    quantity: parseQuantity(feature.properties || {}),
    author_id,
    note,
  }));
};

const parseQuantity = (row: any) => {
  const quantity: { string_val?: string; number_val?: number } = {};
  if ("string_val" in row) quantity.string_val = row.string_val;
  if ("number_val" in row) quantity.number_val = Number(row.number_val);
  return quantity;
};
