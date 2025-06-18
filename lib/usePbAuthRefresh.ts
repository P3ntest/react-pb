import { useCallback, useEffect } from "react";
import { usePbCollection } from "./usePbCollection";
import type { ClientResponseError } from "pocketbase";
import { usePbAuthStore } from "./usePocketBase";

/**
 * An opinionated hook to automatically refresh the PocketBase auth store.
 * It will refresh on mount, on window refocus, and at a specified interval.
 *
 * @param authCollectionId - The collection ID for the PocketBase auth store.
 * @param options - Options for the hook.
 * @param options.intervalMs - The interval in milliseconds to refresh the auth store. Defaults to 1 hour (3600000 ms). Set to 0 or undefined to disable the interval.
 */
export function usePbAuthRefresh(
  authCollectionId: string,
  {
    intervalMs,
  }: {
    intervalMs?: number; // in milliseconds, default to 1 hour
  } = {
    intervalMs: 60 * 60 * 1000, // default to 1 hour
  }
) {
  const collection = usePbCollection(authCollectionId);
  const authStore = usePbAuthStore();

  const refresh = useCallback(() => {
    collection.authRefresh().catch((error: ClientResponseError) => {
      if (error.status === 401) {
        // If the user is unauthorized, clear the auth store
        authStore.clear();
        return;
      }
      throw error; // rethrow other errors
    });
  }, [collection, authStore]);

  useEffect(() => {
    // once on mount
    refresh();
  }, [collection, refresh]);

  // listen for refocus window by adding event listener to document: "visibilitychange"
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [collection, refresh]);

  useEffect(() => {
    if (!intervalMs || intervalMs <= 0) {
      return () => {}; // No interval set, no cleanup needed
    }

    const intervalId = setInterval(() => {
      refresh();
    }, intervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [collection, intervalMs, authStore, refresh]);
}
