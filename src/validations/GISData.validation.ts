import { z } from "zod";
import path from "path";

const QuantitySchema = z
  .object({
    string_val: z.string().max(55).optional(),
    number_val: z.number().int().optional(),
  })
  .refine(
    (data) => {
      const hasString = data.string_val !== undefined;
      const hasNumber = data.number_val !== undefined;
      return (hasString || hasNumber) && !(hasString && hasNumber);
    },
    {
      message: "Provide exactly one of string_val or number_val in quantity",
    }
  );

export const GISDataSchema = z.object({
  category_id: z.number().int().positive(),
  condition: z.enum(["abundant", "in_use"]).optional(),
  accessibility: z.enum(["good", "mediocre", "bad"]).optional(),
  quantity: QuantitySchema.optional(),
  location_id: z
    .number()
    .int({ message: "location is required for all GIS data added" }),
  author_id: z.number().int().positive(),
  note: z.string().optional(),
});

export const GISDataArraySchema = z.array(GISDataSchema);

export const addGISCategorySchema = z.object({
  name: z
    .string({ required_error: "category name is required" })
    .min(1, "Study content must not be empty"),
  description: z
    .string({ required_error: "category description is required" })
    .min(1, "Study content must not be empty"),
});

const SUPPORTED_EXTENSIONS = [".csv", ".xlsx", ".geojson", ".json"];
const SUPPORTED_MIME_TYPES = [
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/geo+json",
];

export const addGeoFileSchema = z.object({
  body: z.object({
    author_id: z.coerce
      .number({ invalid_type_error: "Author ID must be a number" })
      .int()
      .positive(),
    note: z.string().optional(),
  }),
  file: z
    .custom<Express.Multer.File>((val) => !!val, "File is required")
    .refine((file) => SUPPORTED_MIME_TYPES.includes(file.mimetype), {
      message: `Invalid file type. Supported: ${SUPPORTED_MIME_TYPES.join(
        ", "
      )}`,
    }),
});



export type AddGeoFile = z.infer<typeof addGeoFileSchema>;
export type GISDataArray = z.infer<typeof GISDataArraySchema>;
export type GISData = z.infer<typeof GISDataSchema>;
export type addGISCategory = z.infer<typeof addGISCategorySchema>;
