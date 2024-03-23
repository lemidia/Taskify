"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";
import { MAX_FREE_BOARDS } from "@/constans/board-limit";

const handler = async (data: InputType): Promise<ReturnType> => {
  try {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      return {
        error: "Unauthorized",
      };
    }

    // Retrieve this org's limitation count of boards
    // If there is no table of that one, create that one
    let orgLimit = await db.orgLimit.findUnique({
      where: {
        orgId,
      },
    });

    if (!orgLimit) {
      orgLimit = await db.orgLimit.create({
        data: {
          orgId,
          count: MAX_FREE_BOARDS,
        },
      });
    }

    // Check if the number of boards of the org exceeds limit
    const boardsOfThisOrg = await db.board.findMany({
      where: {
        orgId,
      },
    });

    if (boardsOfThisOrg.length >= orgLimit.count) {
      return {
        error: "No more boards can't be created - Reason : Reaching the limit",
      };
    }

    // Destructure data from the client
    const { title, image } = data;

    const [imageId, imageThumbUrl, imageFullUrl, imageUserName, imageLinkHTML] =
      image.split("|");

    const board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageUserName,
        imageLinkHTML,
      },
    });

    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE,
    });

    revalidatePath(`/organization/${orgId}`);
    return { data: board };
  } catch (error) {
    console.log("Error from Server Action - create-board.ts");
    return {
      error: "Failed to create",
    };
  }
};

export const createBoard = createSafeAction(CreateBoard, handler);
