import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePbCollection } from "./usePbCollection";
import { useCallback } from "react";

export function usePbMutations(collectionId: string) {
  const collection = usePbCollection(collectionId);
  const queryClient = useQueryClient();

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [collectionId],
    });
  }, [queryClient, collectionId]);

  const create = useMutation({
    mutationFn: async (data: Record<string, unknown>) =>
      await collection.create(data),
    onSettled: invalidate,
  });

  const update = useMutation({
    mutationFn: async (
      data: Record<string, unknown> & {
        id: string;
      }
    ) => {
      const { id, ...updateData } = data;
      return await collection.update(id, updateData);
    },
    onSettled: invalidate,
  });

  const deleteRecord = useMutation({
    mutationFn: async (id: string) => await collection.delete(id),
    onSettled: invalidate,
  });

  return {
    create,
    update,
    deleteRecord,
    invalidate,
  };
}
