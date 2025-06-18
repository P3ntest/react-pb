import { useMemo } from "react";
import { usePocketBase } from "./usePocketBase";

export function usePbCollection(collection: string) {
  const pb = usePocketBase();
  return useMemo(() => pb.collection(collection), [pb, collection]);
}
