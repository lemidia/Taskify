import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { UpdateCardOrderSchema } from "./schema";
import { Card } from "@prisma/client";

export type InputType = z.infer<typeof UpdateCardOrderSchema>;
export type ReturnType = ActionState<InputType, Card[]>;
