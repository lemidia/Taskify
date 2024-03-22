import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { CopyCardSchema } from "./schema";
import { CardWithList } from "@/types";

export type InputType = z.infer<typeof CopyCardSchema>;
export type ReturnType = ActionState<InputType, CardWithList>;
