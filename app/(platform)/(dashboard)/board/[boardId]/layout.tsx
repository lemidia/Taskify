import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import { BoardNavbar } from "./_components/board-navbar";

export const generateMetadata = async ({
  params: { boardId },
}: {
  params: { boardId: string };
}) => {
  const board = await db.board.findUnique({
    where: {
      id: boardId,
    },
  });

  return {
    title: board?.title || "Not Found",
  };
};

const BoardIdLayout = async ({
  children,
  params: { boardId },
}: {
  children: React.ReactNode;
  params: { boardId: string };
}) => {
  const { orgId: activeOrgId } = auth();

  const board = await db.board.findUnique({
    where: {
      id: boardId,
    },
  });

  if (!board) return notFound();

  if (board.orgId !== activeOrgId) {
    return redirect(`/organization/${activeOrgId}`);
  }
  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
      <div className="absolute inset-0 bg-black/10" />
      <BoardNavbar board={board} />
      <main className="relative pt-28 h-full">{children} </main>
    </div>
  );
};

export default BoardIdLayout;
