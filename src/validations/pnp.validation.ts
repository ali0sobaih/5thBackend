import { varchar } from "drizzle-orm/mysql-core";
import { z } from "zod";

export const pnp = z.object({
    heading: z.string({ required_error: "the heading of the added section is required!"}),
    content: z.string({ required_error: "there must be content in each section!"})
})

export const pnpSchema = z.array(pnp);

export type pnp = z.infer<typeof pnpSchema>;