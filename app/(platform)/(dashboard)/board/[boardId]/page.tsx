import { db } from "@/lib/db";
import { ListContainer } from "./_components/list-container";

type BoardIdPageProps = {
  params: {
    boardId: string;
  };
};

const BoardIdPage = async ({ params: { boardId } }: BoardIdPageProps) => {
  const lists = await db.list.findMany({
    where: {
      boardId,
    },
    include: {
      cards: {
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer boardId={boardId} lists={lists} />
    </div>
  );
};

export default BoardIdPage;
