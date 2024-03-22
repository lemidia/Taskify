"use client";

import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import { ListItem } from "./list-item";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { updateCardOrderSchema } from "@/actions/update-card-order";

type ListContainerProps = {
  lists: ListWithCards[];
  boardId: string;
};

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({ lists, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(lists);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: (data) => {
      toast.success("List has been reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrderSchema, {
    onSuccess: (data) => {
      toast.success("Card has been reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    setOrderedData(lists);
  }, [lists]);

  const onDragEnd = (result: any) => {
    const { source, destination, type } = result;

    if (!destination) return;

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // user moves a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );

      setOrderedData(items);
      // trigger Server Action on list
      executeUpdateListOrder({
        items: items.map((item) => {
          return {
            id: item.id,
            title: item.title,
            order: item.order,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          };
        }),
        boardId,
      });

      return;
    }

    // user moves a card
    if (type === "card") {
      let newOrderedData = [...orderedData];

      // source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destinationList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destinationList) return;

      if (sourceList.id === destinationList.id) {
        const newCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        ).map((item, index) => ({ ...item, order: index }));

        const newList = { ...sourceList, cards: newCards };

        newOrderedData = newOrderedData.map((list) => {
          if (list.id === newList.id) {
            return newList;
          } else {
            return list;
          }
        });

        setOrderedData(newOrderedData);

        executeUpdateCardOrder({
          items: newCards,
          listId: newList.id,
          boardId: boardId,
        });
        return;
      } else {
        // copy cards of source list
        let newCardsOfSourceList = [...sourceList.cards];
        // take a card to be moved to destination list
        let [cardToBeMoved] = newCardsOfSourceList.splice(source.index, 1);
        // reorder index of items
        newCardsOfSourceList = newCardsOfSourceList.map((card, index) => ({
          ...card,
          order: index,
        }));

        // copy cards of destination list
        let newCardsOfDestinationList = [...destinationList.cards];
        // assign destination list's list id to the 'cardToBeMoved"
        cardToBeMoved = { ...cardToBeMoved, listId: destinationList.id };
        // insert the card which we took from the above into the cards of destination list
        newCardsOfDestinationList.splice(destination.index, 0, cardToBeMoved);

        //reorder index of items
        newCardsOfDestinationList = newCardsOfDestinationList.map(
          (card, index) => ({
            ...card,
            order: index,
          })
        );

        // make new source list & destination list
        const newSourceList = { ...sourceList, cards: newCardsOfSourceList };
        const newDestinationList = {
          ...destinationList,
          cards: newCardsOfDestinationList,
        };

        newOrderedData = newOrderedData.map((list) => {
          if (list.id === newSourceList.id) {
            return newSourceList;
          } else if (list.id === newDestinationList.id) {
            return newDestinationList;
          } else {
            return list;
          }
        });

        setOrderedData(newOrderedData);

        executeUpdateCardOrder({
          items: [...newCardsOfSourceList, ...newCardsOfDestinationList],
          listId: newDestinationList.id,
          boardId: boardId,
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex h-full"
          >
            {orderedData.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
