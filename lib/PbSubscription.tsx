import { useEffect } from "react";
import { usePocketBase } from "./usePocketBase";
import { usePbMutations } from "./usePbMutations";

export function PbSubscription({
  collectionId,
  topic = "*",
}: {
  collectionId: string;
  topic: string;
}) {
  const pb = usePocketBase();

  const { invalidate } = usePbMutations(collectionId);

  useEffect(() => {
    const unsubscribePromise = pb
      .collection(collectionId)
      .subscribe(topic, () => {
        invalidate();
      });

    return () => {
      unsubscribePromise.then((unsubscribe) => unsubscribe());
    };
  }, [pb, collectionId, topic, invalidate]);
}
