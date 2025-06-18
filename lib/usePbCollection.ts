import { useMemo } from "react";
import { usePocketBase } from "./usePocketBase";

/**
 *
 * @param collection - The collection ID to access.
 * @returns A memoized PocketBase collection instance.
 */
export function usePbCollection(collection: string) {
  const pb = usePocketBase();
  return useMemo(() => pb.collection(collection), [pb, collection]);
}
