// src/validations/study.validation.ts
import { z } from "zod";
import { locationSchema } from "./location.validation";
import { GISDataSchema } from "./GISData.validation";

export const addStudySchema = z.object({
  title: z
    .string({ required_error: "The title of the study is required!" })
    .min(1, "Title must not be empty"),
  study: z
    .string({ required_error: "Study content is required" })
    .min(1, "Study content must not be empty"),
  author_id: z
    .number({ required_error: "Author ID is required" })
    .int("Author ID must be an integer"),
  status: z.enum(["ai_pending", "ai_approved", "ai_rejected", "byEmployees"], {
    required_error: "Status is required",
  }),
  location_id: z.number().int().optional(),
  location: locationSchema.optional(),
  geoData: z.array(GISDataSchema).optional(),
});

export type addStudy = z.infer<typeof addStudySchema>;
