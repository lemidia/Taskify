"use client";

import { useEffect, useState } from "react";
import { unsplash } from "@/lib/unsplash";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { defaultImages } from "@/constans/images";
import Link from "next/link";
import { FormErrors } from "./form-errors";

type FormPickerProps = {
  id: string;
  errors?: Record<string, string[]>;
};

export const FormPicker = ({ id, errors }: FormPickerProps) => {
  const { pending } = useFormStatus();

  const [images, setImages] = useState<Record<string, any>[]>([]);
  const [selectedImagedId, setSelectedImageId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        throw new Error("Setting images with fallback constants");

        const result = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9,
        });

        if (result?.response) {
          const images = result.response as Record<string, any>[];
          setImages(images);
        } else {
          console.log("Fail to get images from Unsplash");
          setImages(defaultImages);
        }
      } catch (error) {
        console.log(error);
        setImages(defaultImages);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (isLoading)
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
      </div>
    );

  return (
    <div className="relative">
      <div className="grid grid-cols-3 mb-2 gap-2">
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted rounded-md overflow-hidden",
              pending && "opacity-50 hover:opacity-50 cursor-auto",
              image.id === selectedImagedId &&
                "opacity-50 hover:opacity-50 ring-cyan-600 ring-[3px]"
            )}
            onClick={() => {
              if (pending) return;
              setSelectedImageId(image.id);
            }}
          >
            <input
              type="radio"
              id={id}
              name={id}
              className="hidden"
              checked={selectedImagedId === image.id}
              disabled={pending}
              value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}|${image.blur_hash}`}
            />
            <Image
              fill
              alt="Unsplash image"
              src={image.urls.thumb}
              className="object-cover"
            />
            <Link
              href={image.links.html}
              target="_blank"
              className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-0.5 bg-black/50"
            >
              {image.user.name}
            </Link>
          </div>
        ))}
      </div>
      {errors?.[id] && <FormErrors errors={errors[id]} />}
    </div>
  );
};
