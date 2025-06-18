import { useContext, useEffect, useState } from "react";
import { pocketBaseContext } from "./pocketBaseContext";

export function usePocketBase() {
  const context = useContext(pocketBaseContext);
  if (!context || !context.pb) {
    throw new Error(
      "usePocketBase must be used within a PocketBaseProvider and PocketBase instance must be provided"
    );
  }
  return context.pb;
}

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
