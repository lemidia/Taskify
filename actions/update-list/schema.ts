import { z } from "zod";

export const UpdateListSchema = z.object({
  id: z.string(),
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is invalid",
    })
    .min(3, {
      message: "Title is too short",
    }),
  boardId: z.string(),
});
