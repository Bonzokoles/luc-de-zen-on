import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format. Use yyyy-mm-dd.",
    }),
    tags: z.array(z.string()),
    published: z.boolean(),
    layout: z.string().optional(),
  }),
});

export const collections = {
  posts,
};
