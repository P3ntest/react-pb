import { useContext, useEffect, useState } from "react";
import { pocketBaseContext } from "./pocketBaseContext";

/**
 * Retrieves the PocketBase client instance from the context.
 * Throws an error if the context is not available or if the PocketBase instance is not provided.
 *
 * @returns PocketBase client instance.
 */
export function usePocketBase() {
  const context = useContext(pocketBaseContext);
  if (!context || !context.pb) {
    throw new Error(
      "usePocketBase must be used within a PocketBaseProvider and PocketBase instance must be provided"
    );
  }
  return context.pb;
}

/**
 * Provides the PocketBase auth store reactively.
 * This will trigger a re-render whenever the auth store changes (e.g., login, logout, refresh).
 *
 * WARNING: The authStore returned will be the same reference, using it as a dependency in useEffect or similar hooks will not trigger re-renders.
 *
 * @returns PocketBase auth store instance.
 */
export function usePbAuthStore() {
  const pb = usePocketBase();
  const authStore = pb.authStore;

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const unsubscribe = authStore.onChange(() => {
      // Trigger a re-render when the auth store changes
      forceUpdate((prev) => prev + 1);
    });
    return () => {
      unsubscribe();
    };
  }, [authStore]);

  return authStore;
}
