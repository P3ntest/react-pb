import { useCallback } from "react";
import { usePocketBase } from "./usePocketBase";
import { useSWRConfig } from "swr";

export function usePbHooks() {
  const pb = usePocketBase();
  const { mutate } = useSWRConfig();

  const clearCache = useCallback(() => {
    mutate((key) => key && key[0] == pb, undefined);
  }, [pb, mutate]);

  return {
    clearCache,
  };
}
