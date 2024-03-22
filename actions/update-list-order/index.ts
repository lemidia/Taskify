"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateListOrder } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { items, boardId } = data;

  try {
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        orgId,
      },
    });

    if (!board) return { error: "Board not found" };

    const transaction = items.map((item) => {
      return db.list.update({
        where: {
          id: item.id,
          board: {
            orgId,
          },
        },
        data: {
          order: item.order,
        },
      });
    });

    const lists = await db.$transaction(transaction);

    revalidatePath(`/board/${boardId}`);
    return { data: lists };
  } catch (error) {
    console.log("Error from Server Action - update-list-order.ts");
    revalidatePath(`/board/${boardId}`);
    return {
      error: "Failed to reorder",
    };
  }
};

export const updateListOrder = createSafeAction(UpdateListOrder, handler);
