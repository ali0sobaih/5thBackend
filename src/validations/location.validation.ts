import { z } from "zod";

export const locationSchema = z
  .object({
    name: z.string(),
    center_lat: z.number().nullable().optional(),
    center_long: z.number().nullable().optional(),
    area: z
      .array(z.tuple([z.number(), z.number()]))
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      const hasCenter =
        data.center_lat !== null &&
        data.center_lat !== undefined &&
        data.center_long !== null &&
        data.center_long !== undefined;

      const hasArea = Array.isArray(data.area) && data.area.length > 0;

      // ❗ Now enforcing that only one of them is provided
      return (hasArea && !hasCenter) || (!hasArea && hasCenter);
    },
    {
      message:
        "Provide either 'area' OR both 'center_lat' and 'center_long', not both.",
    }
  )
  .refine(
    (data) => {
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