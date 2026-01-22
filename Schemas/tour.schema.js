import { z } from "zod";

export const locationSchema = z.object({
  type: z.literal("Point").optional().default("Point"),
  coordinates: z.array(z.number()).length(2),
  description: z.string().optional(),
  day: z.number().int().optional()
});

export const createTourSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(20, "Name cannot exceed 20 characters").transform(s => s.trim()),
  price: z.number().positive("Price must be a positive number"),
  ratingsAverage: z.number().optional().default(4.0),
  duration: z.number().int().optional().default(3),
  difficulty: z.enum(["easy", "medium", "difficult"]).optional().default("easy"),
  locations: z.array(locationSchema).optional()
});

export const updateTourSchema = createTourSchema.partial(); 
