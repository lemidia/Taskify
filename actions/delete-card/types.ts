import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { DeleteCardSchema } from "./schema";
import { CardWithList } from "@/types";

export type InputType = z.infer<typeof DeleteCardSchema>;
export type ReturnType = ActionState<InputType, CardWithList>;
