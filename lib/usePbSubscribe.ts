import { useCallback, useEffect } from "react";
import { usePbMutations } from "./usePbMutations";
import type { RecordSubscription } from "pocketbase";
import { usePbCollection } from "./usePbCollection";

/**
 * A hook to register a callback to a pocketbase subscription.
 *
 * It is recommended to use a memoized callback (useCallback) to avoid unnecessary re-subscriptions.
 *
 * @param collectionId - The collection ID to subscribe to.
 * @param callback - The callback to be called when a record is updated.
 * @param topic - The topic to subscribe to, defaults to "*" which means all events.
 */
export function usePbSubscribe(
  collectionId: string,
  callback: (data: RecordSubscription) => void,
  topic: string = "*"
) {
  const collection = usePbCollection(collectionId);

  useEffect(() => {
    const unsubscribePromise = collection.subscribe(topic, callback);

    return () => {
      unsubscribePromise.then((unsubscribe) => unsubscribe());
    };
  }, [collection, topic, callback]);
}

/**
 * This hook will subscribe to a PocketBase collection and automatically invalidate the data on change.
 *
 * It allows plug-and-play usage of PocketBase subscriptions without needing to manually handle the subscription logic.
 *
 * Add it to your code and it will just work.
 *
 * @param collectionId - The collection ID to subscribe to.
 * @param topic - The topic to subscribe to, defaults to "*" which means all events.
 */
export function usePbLive(collectionId: string, topic: string = "*") {
  const { invalidate } = usePbMutations(collectionId);

  usePbSubscribe(
    collectionId,
    useCallback(() => {
      invalidate();
    }, [invalidate]),
    topic
  );
}
