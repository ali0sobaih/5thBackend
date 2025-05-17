import { z } from "zod";

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
  locationId: z
    .number()
    .int({ message: "location is required for all GIS data added" }),
  author_id: z.number().int().positive(),
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

export type GISDataArray = z.infer<typeof GISDataArraySchema>;
export type GISData = z.infer<typeof GISDataSchema>;
export type addGISCategory = z.infer<typeof addGISCategorySchema>;
