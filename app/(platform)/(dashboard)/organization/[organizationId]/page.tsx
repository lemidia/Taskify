import { Separator } from "@/components/ui/separator";
import { Info } from "./_components/info";
import { BoardList } from "./_components/board-list";
import { Suspense } from "react";
import { checkSubscription } from "@/lib/subscription";

type OrganizationIdPageProps = {
  params: {
    organizationId: string;
  };
};

const OrganizationIdPage = async ({
  params: { organizationId },
}: OrganizationIdPageProps) => {
  const isPro = await checkSubscription();

  return (
    <div className="w-full mb-20">
      <Info isPro={isPro} />
      <Separator className="my-4" />
      <div className="px-2 md:px-4">
        <Suspense fallback={<BoardList.Skeleton />}>
          <BoardList organizationId={organizationId} isPro={isPro} />
        </Suspense>
      </div>
    </div>
  );
};

export default OrganizationIdPage;
