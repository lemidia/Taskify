"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateBoardSchema } from "./schema";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
  try {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      return {
        error: "Unauthorized",
      };
    }

    const { id, title } = data;

    const board = await db.board.update({
      where: {
        id,
        orgId,
      },
      data: {
        title,
      },
    });

    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.UPDATE,
    });

    revalidatePath(`/board/${id}`);
    return { data: board };
  } catch (error) {
    console.log("Error from Server Action - update-board.ts");
    return {
      error: "Failed to update a board",
    };
  }
};

export const updateBoard = createSafeAction(UpdateBoardSchema, handler);
