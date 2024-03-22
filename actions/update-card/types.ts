import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { UpdateCardSchema } from "./schema";
import { CardWithList } from "@/types";

export type InputType = z.infer<typeof UpdateCardSchema>;
export type ReturnType = ActionState<InputType, CardWithList>;
