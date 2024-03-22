import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { UpdateListSchema } from "./schema";
import { List } from "@prisma/client";

export type InputType = z.infer<typeof UpdateListSchema>;
export type ReturnType = ActionState<InputType, List>;
