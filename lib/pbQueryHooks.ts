import type {
  RecordFullListOptions,
  RecordListOptions,
  RecordOptions,
} from "pocketbase";
import { useQuery } from "@tanstack/react-query";
import { usePbCollection } from "./usePbCollection";

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
