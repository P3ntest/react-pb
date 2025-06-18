import { useEffect } from "react";
import { usePbCollection } from "./usePbCollection";

export function PbAuthRefresher({
  authCollectionId,
  interval = 60 * 60 * 1000, // default to 1 hour
}: {
  authCollectionId: string;
  interval?: number; // in milliseconds
}) {
  const collection = usePbCollection(authCollectionId);

  useEffect(() => {
    // once on mount
    collection.authRefresh();
  }, [collection]);

  // listen for refocus window by adding event listener to document: "visibilitychange"
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        collection.authRefresh();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [collection]);

  useEffect(() => {
    if (!interval || interval <= 0) {
      return () => {}; // No interval set, no cleanup needed
    }

    const intervalId = setInterval(() => {
      collection.authRefresh();
    }, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [collection, interval]);

  return null;
}
