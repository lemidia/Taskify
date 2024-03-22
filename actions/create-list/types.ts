import { z } from "zod";
import { ListWithCards } from "@/types";

import { ActionState } from "@/lib/create-safe-action";
import { CreateListSchema } from "./schema";

export type InputType = z.infer<typeof CreateListSchema>;
export type ReturnType = ActionState<InputType, ListWithCards>;
