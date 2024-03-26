"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";
import { MAX_FREE_BOARDS } from "@/constants/board-limit";
import { blurHashToDataURL } from "@/lib/blurhashDataURL";
import { checkSubscription } from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> => {
  try {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      return {
        error: "Unauthorized",
      };
    }

    // Check if the number of boards of the org exceeds limit
    const countBoardsOfThisOrg = await db.board.count({
      where: {
        orgId,
      },
    });

    // Meaning, this org exceeded the limit count of creating boards or not a member of Pro membership
    if (
      countBoardsOfThisOrg >= MAX_FREE_BOARDS &&
      !(await checkSubscription())
    ) {
      return {
        error: "No more boards can't be created - Reaching the limit count",
      };
    }

    // Destructure data from the client
    const { title, image } = data;

    const [
      imageId,
      imageThumbUrl,
      imageFullUrl,
      imageUserName,
      imageLinkHTML,
      blurHash,
    ] = image.split("|");

    const blurHashDateUrl = blurHashToDataURL(blurHash);

    const board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageUserName,
        imageLinkHTML,
        blurHash: blurHashDateUrl || "data:image/png;base64,",
      },
      select: {
        id: true,
        title: true,
        orgId: true,
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
  } catch (error: unknown) {
    console.log("Error from Server Action - create-board.ts");
    return {
      error: "Failed to create",
    };
  }
};

export const createBoard = createSafeAction(CreateBoard, handler);
