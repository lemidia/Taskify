"use client";

import { createCard } from "@/actions/create-card";
import { FormSubmit } from "@/components/form/form-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { forwardRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

type CardFormProps = {
  listId: string;
};

export const CardForm = ({ listId }: CardFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { execute, fieldErrors, setFieldErrors } = useAction(createCard, {
    onSuccess: (data) => {
      toast.success(`Card "${data.title}" created`);
      formRef.current?.reset();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const disableEditing = () => {
    setIsEditing(false);
    setFieldErrors(undefined);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  const { boardId }: { boardId: string } = useParams();

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useOnClickOutside(formRef, disableEditing);
  useEventListener("keydown", onKeyDown);

  const onSubmitHandler = async (formData: FormData) => {
    const title = (formData.get("title") as string)?.trim();

    execute({ title, listId, boardId });
  };

  if (isEditing) {
    return (
      <form
        action={onSubmitHandler}
        className="m-1 py-0.5 px-1 space-y-4"
        ref={formRef}
      >
        <FormTextarea
          label="title"
          id="title"
          ref={textareaRef}
          placeholder="Enter a title for this card..."
          errors={fieldErrors}
        />
        <div className="flex items-center gap-x-1">
          <FormSubmit>Add card</FormSubmit>
          <Button onClick={disableEditing} size={"sm"} variant={"default"}>
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="pt-0.5 px-2">
      <Button
        onClick={enableEditing}
        className="w-full justify-start text-muted-foreground text-sm"
        variant={"ghost"}
        size={"sm"}
      >
        <Plus className="h-4 w-4" /> Add a card
      </Button>
    </div>
  );
};
