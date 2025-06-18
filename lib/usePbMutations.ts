import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePbCollection } from "./usePbCollection";
import { useCallback } from "react";

/**
 * Gives access to `invalidate`, `create`, `update`, and `deleteRecord` mutations for a PocketBase collection.
 *
 * @param collectionId - The collection ID to perform mutations on.
 * @returns An object containing the `create`, `update`, `deleteRecord` mutations and an `invalidate` function to refresh the collection data.
 */
export function usePbMutations(collectionId: string) {
  const collection = usePbCollection(collectionId);
  const queryClient = useQueryClient();

  /**
   * Invalidates all queries related to the specified collection ID.
   */
  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [collectionId],
    });
  }, [queryClient, collectionId]);

  /**
   * Creates a new record in the specified collection.
   */
  const create = useMutation({
    mutationFn: async (data: Record<string, unknown>) =>
      await collection.create(data),
    onSettled: invalidate,
  });

  /**
   * Updates an existing record in the specified collection.
   * Provide the record ID in the `data` object. It will be extracted and used for the update operation.
   */
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

  /**
   * Deletes a record from the specified collection.
   * Provide the record ID as a string.
   */
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
