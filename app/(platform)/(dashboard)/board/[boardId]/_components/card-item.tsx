"use client";

import { useCardModal } from "@/hooks/use-card-modal";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@prisma/client";

type CardItemProps = {
  data: Card;
  index: number;
};

export const CardItem = ({ data: card, index }: CardItemProps) => {
  const { onOpen } = useCardModal();
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          onClick={() => onOpen(card.id)}
          className={`truncate border-2 border-transparent hover:border-black/60 py-2 px-3 text-sm rounded-md shadow-sm my-1 bg-white`}
        >
          {card.title}
        </div>
      )}
    </Draggable>
  );
};
