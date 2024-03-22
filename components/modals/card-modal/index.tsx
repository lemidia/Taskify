"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { CardWithList } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Ghost } from "lucide-react";
import { Header } from "./header";
import { Description } from "./description";
import { Actions } from "./actions";
import { AuditLog } from "@prisma/client";
import { Activity } from "./activity";

export const CardModal = () => {
  const { isOpen, onClose, id } = useCardModal();

  const {
    data: cardData,
    isError,
    error,
    isLoading,
  } = useQuery<CardWithList>({
    queryKey: ["cards", id],
    queryFn: () => fetcher(`/api/cards/${id}`),
    enabled: !!id,
    gcTime: 0,
  });

  const { data: cardAuditLogData, isLoading: isCardAuditLogDataLoading } =
    useQuery<AuditLog[]>({
      queryKey: ["cardAuditLog", id],
      queryFn: () => fetcher(`/api/cards/${id}/logs`),
      enabled: !!id,
      gcTime: 0,
    });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="min-h-[250px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {isError && (
          <div className="w-full min-h-[250px] flex flex-col gap-y-5 items-center justify-center">
            <Ghost className="h-10 w-10" />
            <p className="text-md font-semibold text-neutral-700 flex flex-col text-center gap-y-2">
              <span className="font-bold text-xl">Oops! </span>
              Card info could not be loaded for some reason...
            </p>
          </div>
        )}
        {isLoading ? (
          <Header.Skeleton />
        ) : (
          !!cardData && <Header data={cardData} />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {isLoading ? (
                <Description.Skeleton />
              ) : (
                !!cardData && <Description data={cardData} />
              )}
              {isCardAuditLogDataLoading ? (
                <Activity.Skeleton />
              ) : (
                !!cardAuditLogData && <Activity items={cardAuditLogData} />
              )}
            </div>
          </div>
          <div className="w-[110px] sm:w-full">
            {isLoading ? (
              <Actions.Skeleton />
            ) : (
              !!cardData && <Actions data={cardData} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
