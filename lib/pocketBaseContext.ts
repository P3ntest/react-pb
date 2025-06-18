import { createContext } from "react";
import type PocketBase from "pocketbase";

export const pocketBaseContext = createContext<{
  pb: PocketBase | null;
}>({
  pb: null,
});
