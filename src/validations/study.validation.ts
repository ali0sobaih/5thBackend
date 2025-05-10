import { z } from "zod";

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

  status: z.enum(["ai_suggested", "approved", "byEmployees"], {
    required_error: "Status is required",
    invalid_type_error: "Invalid status value",
  }),

  location_id: z
    .number({ required_error: "Location ID is required" })
    .int("Location ID must be an integer"),
});
