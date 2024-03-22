import { Separator } from "@/components/ui/separator";
import { Info } from "./_components/info";
import { BoardList } from "./_components/board-list";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs";

type OrganizationIdPageProps = {
  params: {
    organizationId: string;
  };
};

const OrganizationIdPage = ({
  params: { organizationId },
}: OrganizationIdPageProps) => {
  return (
    <div className="w-full mb-20">
      <Info />
      <Separator className="my-4" />
      <div className="px-2 md:px-4">
        <Suspense fallback={<BoardList.Skeleton />}>
          <BoardList organizationId={organizationId} />
        </Suspense>
      </div>
    </div>
  );
};

export default OrganizationIdPage;
