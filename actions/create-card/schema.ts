import { z } from "zod";

export const CreateCardSchema = z.object({
  listId: z.string(),
  boardId: z.string(),
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is invalid",
    })
    .min(3, {
      message: "Title is too short",
    }),
});
