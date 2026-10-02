import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { TokenStore } from "@/lib/api/client";
import { tokenPairSchema, type TokenPair } from "@/lib/schemas";

const KEY = "bokoui-layouts.tokens";

/** One async interface over the two places a token can live. */
interface Backend {
  read(): Promise<string | null>;
  write(value: string): Promise<void>;
  remove(): Promise<void>;
}

/** Keychain / Keystore on a device. */
const secureBackend: Backend = {
  read: () => SecureStore.getItemAsync(KEY),
  write: (value) => SecureStore.setItemAsync(KEY, value),
  remove: () => SecureStore.deleteItemAsync(KEY),
};

/** The web build has no secure store (SecureStore is native only), so tokens sit in AsyncStorage (localStorage). */
const webBackend: Backend = {
  read: () => AsyncStorage.getItem(KEY),
  write: (value) => AsyncStorage.setItem(KEY, value),
  remove: () => AsyncStorage.removeItem(KEY),
};

/** Keeps the token pair in `expo-secure-store` on native and AsyncStorage on web, with a copy in memory. */
export function createTokenStorage(backend: Backend = Platform.OS === "web" ? webBackend : secureBackend): TokenStore {
  let cache: TokenPair | null | undefined;
  return {
    async get() {
      if (cache !== undefined) return cache;
      try {
        const raw = await backend.read();
        const parsed = raw ? tokenPairSchema.safeParse(JSON.parse(raw)) : undefined;
        cache = parsed?.success ? parsed.data : null;
      } catch {
        cache = null;
      }
      return cache;
    },
    async set(tokens) {
      cache = tokens;
      await backend.write(JSON.stringify(tokens));
    },
    async clear() {
      cache = null;
      await backend.remove().catch(() => undefined);
    },
  };
}

export const tokenStorage = createTokenStorage();
