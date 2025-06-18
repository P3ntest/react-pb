import type {
  RecordFullListOptions,
  RecordListOptions,
  RecordOptions,
} from "pocketbase";
import { useQuery } from "@tanstack/react-query";
import { usePbCollection } from "./usePbCollection";

/**
 * Use this hook to fetch a single record from a PocketBase collection.
 *
 * @param collectionId
 * @param id
 * @param options
 * @returns
 */
export function usePbOne(
  collectionId: string,
  id: string,
  options: RecordOptions = {}
) {
  const collection = usePbCollection(collectionId);

  return useQuery({
    queryKey: [collectionId, id, options],
    queryFn: async () => await collection.getOne(id, options),
  });
}

/**
 * Use this hook to fetch a list of records from a PocketBase collection.
 *
 * @param collectionId
 * @param props
 * @returns
 */
export function usePbList(
  collectionId: string,
  props: {
    page?: number;
    perPage?: number;
  } & RecordListOptions = {}
) {
  const collection = usePbCollection(collectionId);

  return useQuery({
    queryKey: [collectionId, props],
    queryFn: async () => {
      const { page, perPage, ...options } = props;
      return await collection.getList(page, perPage, options);
    },
  });
}

/**
 * Use this hook to fetch the first record from a PocketBase collection based on a filter.
 *
 * @param collectionId
 * @param filter
 * @param options
 * @returns
 */
export function usePbFirst(
  collectionId: string,
  filter: string,
  options: RecordListOptions = {}
) {
  const collection = usePbCollection(collectionId);

  return useQuery({
    queryKey: [collectionId, filter, options],
    queryFn: async () => await collection.getFirstListItem(filter, options),
  });
}

/**
 * Use this hook to fetch the full list of records from a PocketBase collection.
 *
 * @param collectionId
 * @param options
 * @returns
 */
export function usePbFullList(
  collectionId: string,
  options: RecordFullListOptions = {}
) {
  const collection = usePbCollection(collectionId);

  return useQuery({
    queryKey: [collectionId, options],
    queryFn: async () => await collection.getFullList(options),
  });
}
