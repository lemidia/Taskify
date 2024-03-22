"use client";

import { useAction } from "@/hooks/use-action";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { createBoard } from "@/actions/create-board";
import { FormInput } from "./form-input";
import { FormSubmit } from "./form-submit";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useRef } from "react";
import { FormPicker } from "./form-picker";

export const FormPopover = ({
  children,
  side = "left",
  align = "center",
  sideOffset = 0,
}: {
  children: React.ReactNode;
  side?: "left" | "top" | "right" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  const { execute, fieldErrors, setFieldErrors, error, data, isLoading } =
    useAction(createBoard, {
      onSuccess: (data) => {
        toast.success("Board created!");
        closeRef.current?.click();
      },
      onError: (error) => {
        toast.error(error || "Fail to create");
      },
    });

  const onSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const image = formData.get("image") as string;
    execute({ title, image });
  };

  return (
    <Popover onOpenChange={() => setFieldErrors(undefined)}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-80 pt-3"
        side={side}
        sideOffset={sideOffset}
      >
        <div className="text-md font-semibold text-center text-neutral-600">
          Create Board
        </div>
        <PopoverClose asChild ref={closeRef}>
          <Button
            className="absolute top-2 right-2 rounded-full w-auto h-auto p-2 text-neutral-600"
            variant={"ghost"}
            size={"icon"}
          >
            <X className="w-4 h-4" />
          </Button>
        </PopoverClose>
        <form className="mt-3 space-y-4" action={onSubmit}>
          <div className="space-y-4">
            <FormPicker id="image" errors={fieldErrors} />
            <FormInput
              id="title"
              label="title"
              type="text"
              required
              errors={fieldErrors}
            />
          </div>
          <FormSubmit className="w-full">Create</FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};
