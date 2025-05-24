import path from "path";
import { parseExcel } from "./parseExcel";
import { parseCSV } from "./parseCSV";
import { parseGeoJSON } from "./parseGeoJSON";
import { GISData } from "validations/GISData.validation";


export const parseFile = async (
  file: Express.Multer.File,
  author_id: number,
  note?: string
): Promise<GISData[]> => {
  const ext = path.extname(file.originalname).toLowerCase();

  switch (ext) {
    case ".csv":
      return parseCSV(file.path, author_id, note);
    case ".xlsx":
      return parseExcel(file.path, author_id, note);
    case ".geojson":
    case ".json":
      return parseGeoJSON(file.path, author_id, note);
    default:
      throw new Error("Unsupported file format");
  }
};
