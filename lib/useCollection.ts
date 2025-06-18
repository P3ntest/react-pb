import { useCallback, useMemo } from "react";
import { usePocketBase } from "./usePocketBase";
import type { RecordOptions } from "pocketbase";
import { useSWRConfig } from "swr";

export function usePbCollection(collection: string) {
  const pb = usePocketBase();
  return useMemo(() => pb.collection(collection), [pb, collection]);
}

export function usePbCollectionHooks(collectionId: string) {
  const pb = usePocketBase();
  const collection = usePbCollection(collectionId);
  const { mutate } = useSWRConfig();

  const create = useCallback(
    async (data: Record<string, unknown>, options?: RecordOptions) => {
      return await collection.create(data, options);
    },
    [collection]
  );

  const update = useCallback(
    async (
      id: string,
      data: Record<string, unknown>,
      options?: RecordOptions
    ) => {
      return await collection.update(id, data, options);
    },
    [collection]
  );

  const deleteRecord = useCallback(
    async (id: string, options?: RecordOptions) => {
      return await collection.delete(id, options);
    },
    [collection]
  );

  const clearCache = useCallback(() => {
    mutate(
      (key: unknown[]) => key && key[0] === pb && key[1] === collectionId,
      undefined
    );
  }, [pb, collectionId, mutate]);

  return {
    create,
    update,
    deleteRecord,
    clearCache,
  };
}
