"use client";

import { deleteBoard } from "@/actions/delete-board";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { MoreHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const BoardOptions = ({ id }: { id: string }) => {
  const router = useRouter();
  const { execute, isLoading } = useAction(deleteBoard, {
    onError(error) {
      toast.error(error || "Failed to delete a board");
    },
  });
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="h-auto w-auto p-2 rounded-full"
          variant={"transparent"}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600">
          Board Actions
        </div>
        <PopoverClose asChild>
          <Button
            className="w-auto h-auto p-2 absolute top-2 right-2 text-neutral-600 rounded-full"
            variant={"ghost"}
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          disabled={isLoading}
          variant={"destructive"}
          onClick={() => {
            execute({ id });
          }}
          className="w-full h-auto p-2 px-5 font-normal text-sm mt-3"
        >
          Delete this board
        </Button>
      </PopoverContent>
    </Popover>
  );
};
