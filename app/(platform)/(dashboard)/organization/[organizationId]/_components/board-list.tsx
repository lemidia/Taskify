import { HelpCircle, User2 } from "lucide-react";
import { Hint } from "./hind";
import { FormPopover } from "@/components/form/form-popover";
import { db } from "@/lib/db";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { MAX_FREE_BOARDS } from "@/constans/board-limit";

type BoardListProps = {
  organizationId: string;
};

export const BoardList = async ({ organizationId }: BoardListProps) => {
  const boards = await db.board.findMany({
    where: {
      orgId: organizationId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const orgLimit = await db.orgLimit.findUnique({
    where: {
      orgId: organizationId,
    },
  });

  const boardCountLimit = orgLimit ? orgLimit.count : MAX_FREE_BOARDS;

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <User2 className="h-6 w-6 mr-2" />
        Your boards
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {boards.map((board) => (
          <Link
            href={`/board/${board.id}`}
            key={board.id}
            style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
            className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm p-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <p className="relative font-semibold text-white">{board.title}</p>
          </Link>
        ))}
        <FormPopover sideOffset={10} side="right">
          <div
            role="button"
            className="relative aspect-video bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
          >
            <p className="text-md font-semibold">Create new board</p>
            <span className="text-sm">
              {boardCountLimit - boards.length} remaining
            </span>
            <Hint
              sideOffset={15}
              description={`Free Workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace. `}
            >
              <HelpCircle className="absolute bottom-2 right-2 h-4  w-4" />
            </Hint>
          </div>
        </FormPopover>
      </div>
    </div>
  );
};

BoardList.Skeleton = function BoardListSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      <Skeleton className="aspect-video" />
      <Skeleton className="aspect-video" />
      <Skeleton className="aspect-video" />
      <Skeleton className="aspect-video" />
    </div>
  );
};
