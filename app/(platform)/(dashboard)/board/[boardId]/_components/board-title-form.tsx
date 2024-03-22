"use client";

import { updateBoard } from "@/actions/update-board";
import { FormErrors } from "@/components/form/form-errors";
import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { Board } from "@prisma/client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type BoardTitleFormProps = {
  board: Board;
};

export const BoardTitleForm = ({ board }: BoardTitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [optimisticTitle, setOptimisticTitle] = useState(board.title);

  const { execute, data, isLoading, fieldErrors } = useAction(updateBoard, {
    onSuccess: (data) => {
      disableEditing();
      setOptimisticTitle(data.title);
      toast.success("Board title has been modified");
    },

    onError: (err) => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      toast.error(err || "Failed to update a board");
    },
  });

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const onSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    if (title.trim() === board.title) return disableEditing();

    execute({ id: board.id, title: title.trim() });
  };

  if (isEditing) {
    return (
      <form
        ref={formRef}
        className="flex items-center gap-x-2"
        action={onSubmit}
      >
        <FormInput
          defaultValue={optimisticTitle}
          ref={inputRef}
          id="title"
          className="text-lg font-bold px-2 bg-black/20 focus-visible:outline-none focus-visible:ring-transparent border-none w-[150px]"
          onBlur={() => {
            formRef.current?.requestSubmit();
          }}
        />
        {fieldErrors?.title && <FormErrors errors={fieldErrors.title} />}
      </form>
    );
  }
  return (
    <Button
      variant={"transparent"}
      size={"sm"}
      className="font-bold text-lg"
      onClick={enableEditing}
    >
      {optimisticTitle}
    </Button>
  );
};
