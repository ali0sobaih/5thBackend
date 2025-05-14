import { z } from "zod";
import { locationSchema } from "./location.validation";

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
});

export type GISData = z.infer<typeof GISDataSchema>;
  
