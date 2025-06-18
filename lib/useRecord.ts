import useSWR from "swr";
import { usePocketBase } from "./usePocketBase";
import { useCallback } from "react";
import type { RecordListOptions, RecordOptions } from "pocketbase";

export function usePbOne(
  collection: string,
  id: string,
  options: RecordOptions = {}
) {
  const pb = usePocketBase();

  const deps = [pb, collection, id, ...Object.values(options)];

  return useSWR(
    deps,
    useCallback(async () => {
      return await pb
        .collection(collection)
        .getOne(id, {
          requestKey: null, // deduplication is handled by SWR
          ...options,
        })
        .catch((error) => {
          if (error.status === 404) {
            return null; // Record not found, return null
          }
          throw error; // Re-throw other errors
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps])
  );
}

export function usePbList(
  collection: string,
  props: {
    page?: number;
    perPage?: number;
  } & RecordListOptions = {}
) {
  const pb = usePocketBase();

  const deps = [pb, collection, ...Object.values(props)];

  return useSWR(
    deps,
    useCallback(async () => {
      return await pb
        .collection(collection)
        .getList(props.page, props.perPage, {
          requestKey: null, // deduplication is handled by SWR
          ...props,
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
  );
}

export function usePbFirst(
  collection: string,
  filter: string,
  options: RecordListOptions = {}
) {
  const pb = usePocketBase();

  const deps = [pb, collection, filter, ...Object.values(options)];

  return useSWR(
    deps,
    useCallback(async () => {
      const result = await pb
        .collection(collection)
        .getFirstListItem(filter, {
          requestKey: null, // deduplication is handled by SWR
          ...options,
        })
        .catch((error) => {
          if (error.status === 404) {
            return null; // Record not found, return null
          }
          throw error; // Re-throw other errors
        });
      return result;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
  );
}
