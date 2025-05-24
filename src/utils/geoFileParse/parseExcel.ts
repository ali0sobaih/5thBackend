import * as XLSX from "xlsx";

export const parseExcel = (
  filePath: string,
  author_id: number,
  note?: string
) => {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet).map((row: any) => ({
    category_id: Number(row.category_id),
    condition: row.condition,
    accessibility: row.accessibility,
    location_id: Number(row.location_id),
    quantity: parseQuantity(row),
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
