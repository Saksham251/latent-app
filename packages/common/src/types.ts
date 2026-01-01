
import { z } from "zod";

export const CreateEventSchema = z.object({
    name: z.string(),
    description: z.string(),
    startTime: z.string(),
    location: z.string(),
    banner: z.string(),
    seats: z.array(z.object({
        name:z.string(),
        description:z.string(),
        price: z.string().transform(Number),
        capacity: z.string().transform(Number),
    }))
})

export const CreateLocationSchema = z.object({
    name: z.string(),
    description: z.string(),
    imageUrl: z.string(),
})

export const UpdateEventSchema = z.object({
    name: z.string(),
    description: z.string(),
    startTime: z.string(),
    location: z.string(),
    banner: z.string(),
    published: z.boolean(),
    ended: z.boolean(),
});
