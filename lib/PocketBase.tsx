import { BaseAuthStore } from "pocketbase";
import { useMemo } from "react";
import PocketBaseClient from "pocketbase";
import { pocketBaseContext } from "./pocketBaseContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Creates and provides a PocketBase client instance.
 * @param authStore - Make sure this is memoized to avoid unnecessary re-connecting and client recreations.
 */
export function PocketBase({
  baseUrl,
  authStore,
  lang,

  children,
}: {
  baseUrl?: string;
  authStore?: BaseAuthStore;
  lang?: string;

  children?: React.ReactNode;
}) {
  const pb = useMemo(
    () => new PocketBaseClient(baseUrl, authStore, lang),
    [baseUrl, authStore, lang]
  );

  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <pocketBaseContext.Provider value={{ pb: pb }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </pocketBaseContext.Provider>
  );
}
