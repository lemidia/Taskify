"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCardOrderSchema } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { items, listId, boardId } = data;

  try {
    const list = await db.list.findUnique({
      where: {
        id: listId,
        board: {
          orgId,
        },
      },
    });

    if (!list) return { error: "List not found" };

    const transaction = items.map((item) => {
      return db.card.update({
        where: {
          id: item.id,
          list: {
            boardId,
          },
        },
        data: {
          order: item.order,
          listId: item.listId,
        },
      });
    });

    const cards = await db.$transaction(transaction);

    revalidatePath(`/board/${boardId}`);
    return { data: cards };
  } catch (error) {
    console.log("Error from Server Action - update-list-order.ts");
    revalidatePath(`/board/${boardId}`);
    return {
      error: "Failed to reorder",
    };
  }
};

export const updateCardOrderSchema = createSafeAction(
  UpdateCardOrderSchema,
  handler
);
