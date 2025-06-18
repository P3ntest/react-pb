import { useEffect, useRef } from "react";
import { usePbMutations } from "./usePbMutations";
import type { RecordSubscription } from "pocketbase";
import { usePbCollection } from "./usePbCollection";

/**
 * A hook to register a callback to a pocketbase subscription.
 *
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
  const callbackRef = useRef(callback);

  // Always keep the ref up to date with the latest callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // Wrapper that always calls the latest callback
    const stableCallback = (data: RecordSubscription) => {
      callbackRef.current(data);
    };

    const unsubscribePromise = collection.subscribe(topic, stableCallback);

    return () => {
      unsubscribePromise.then((unsubscribe) => unsubscribe());
    };
  }, [collection, topic]);
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

  usePbSubscribe(collectionId, () => invalidate(), topic);
}
