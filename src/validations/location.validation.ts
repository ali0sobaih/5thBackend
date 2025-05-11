import { z } from "zod";

export const locationSchema = z
  .object({
    name: z.string().nullable().optional(),
    center_lat: z.number().nullable().optional(),
    center_long: z.number().nullable().optional(),
    area: z
      .array(z.tuple([z.number(), z.number()]))
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      // Constraint 1: area must exist OR both center_lat and center_long
      const hasCenter =
        data.center_lat !== null &&
        data.center_lat !== undefined &&
        data.center_long !== null &&
        data.center_long !== undefined;

      const hasArea = Array.isArray(data.area) && data.area.length > 0;

      return hasArea || hasCenter;
    },
    {
      message:
        "Either 'area' or both 'center_lat' and 'center_long' must be provided.",
    }
  )
  .refine(
    (data) => {
      // Constraint 2: lat and long must both be null/undefined or both present
      const latSet = data.center_lat !== null && data.center_lat !== undefined;
      const longSet =
        data.center_long !== null && data.center_long !== undefined;

      return latSet === longSet;
    },
    {
      message:
        "'center_lat' and 'center_long' must both be set or both be null.",
    }
  );


  export type location = z.infer<typeof locationSchema>;