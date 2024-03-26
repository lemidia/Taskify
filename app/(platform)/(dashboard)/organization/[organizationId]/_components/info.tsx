"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import Image from "next/image";

type InfoProps = {
  isPro: boolean;
};

export const Info = ({ isPro }: InfoProps) => {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) return <Info.Skeleton />;

  return (
    <div className="flex items-center gap-x-4">
      <div className="w-[60px] h-[60px] relative">
        <Image
          fill
          sizes="60px"
          src={organization?.imageUrl!}
          alt="Organization"
          className="rounded-md object-cover"
        />
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-xl">{organization?.name}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <CreditCard className="h-3 w-3 mr-1" />
          {isPro ? "Pro" : "Free"}
        </div>
      </div>
    </div>
  );
};

Info.Skeleton = function InfoSkeleton() {
  return (
    <div className="flex items-center gap-x-4">
      <Skeleton className="w-[60px] h-[60px]" />
      <div className="space-y-1">
        <Skeleton className="w-[110px] h-[36px]" />
        <div className="flex items-center">
          <Skeleton className="w-[20px] h-[20px] mr-1" />
          <Skeleton className="w-[56px] h-[20px]" />
        </div>
      </div>
    </div>
  );
};
