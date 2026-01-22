import { z } from "zod";

export const createTourSchema = z.object({
  name: z.string().min(3).max(20),
  price: z.number().positive(),
  rating: z.number().min(0).max(5).default(4.0),
  duaration: z.number().positive().default(3),
  difficulty: z.enum(["easy", "medium", "difficult"]).default("easy"),
});

export const updateTourSchema = createTourSchema.partial();

export const enhancedTourSchema = createTourSchema.extend({
  name: z.string().min(3).max(20).transform(val => val.trim()),
  email: z.string().email().transform(val => val.toLowerCase()),
});
