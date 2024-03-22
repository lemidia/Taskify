import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { CopyListSchema } from "./schema";
import { ListWithCards } from "@/types";

export type InputType = z.infer<typeof CopyListSchema>;
export type ReturnType = ActionState<InputType, ListWithCards>;
