"use client";

import { copyList } from "@/actions/copy-list";
import { deleteList } from "@/actions/delete-list";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";
import { List } from "@prisma/client";
import { MoreHorizontal, X } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

type ListOptionsProps = {
  data: List;
};

export const ListOptions = ({ data }: ListOptionsProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" deleted`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeCopy } = useAction(copyList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" copied`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleDeleteList = async (formData: FormData) => {
    executeDelete({ id: data.id, boardId: data.boardId });
  };

  const handleCopyList = async (formData: FormData) => {
    executeCopy({ id: data.id, boardId: data.boardId });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="h-auto w-auto p-1.5 hover:bg-black/10 rounded-full"
          variant={"ghost"}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-3 flex flex-col gap-y-3"
        side="bottom"
        align="center"
        sideOffset={20}
      >
        <div className="text-md font-medium text-center text-neutral-600 pb-1 ">
          List Actions
        </div>
        <PopoverClose asChild>
          <Button
            ref={closeRef}
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant={"ghost"}
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>

        <form action={handleCopyList}>
          <FormSubmit variant="outline" className="w-full">
            Copy List...
          </FormSubmit>
        </form>
        <Separator />
        <form action={handleDeleteList}>
          <FormSubmit variant="destructive" className="w-full">
            Delete List
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};
