import { atomWithSuspenseQuery } from "jotai-tanstack-query";
import { tokenAtom } from "./sessions";
import { api } from "@/services/api";

export const minecraftAccountsAtom = atomWithSuspenseQuery((get) => ({
    queryKey: ["minecraftAccounts", get(tokenAtom)],
    queryFn: async ({ queryKey }) => {
        const token = queryKey[1] as string | null;
        if (!token) return [];
        return api(token).getMinecraftAccounts();
    },
}));