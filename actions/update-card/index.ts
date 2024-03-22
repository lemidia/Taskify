"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCardSchema } from "./schema";
import { CardWithList } from "@/types";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  try {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      return {
        error: "Unauthorized",
      };
    }

    const { id, title, boardId, description } = data;

    const card = await db.card.update({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
      data: {
        title,
        description,
      },
      include: {
        list: {
          select: {
            title: true,
          },
        },
      },
    });

    await createAuditLog({
      entityId: card.id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.UPDATE,
    });

    revalidatePath(`/board/${boardId}`);
    return { data: card };
  } catch (error) {
    console.log("Error from Server Action - update-card.ts");
    return {
      error: "Failed to update a card",
    };
  }
};

export const updateCard = createSafeAction(UpdateCardSchema, handler);
