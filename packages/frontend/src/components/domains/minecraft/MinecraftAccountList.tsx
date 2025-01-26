import { minecraftAccountsAtom } from "@/states/minecraft";
import { useAtom } from "jotai";
import React from "react";
import { Stack } from "react-bootstrap";

export const MinecraftAccountList: React.FC = () => {
    const [{data: accounts}] = useAtom(minecraftAccountsAtom);

    return (
        <Stack gap={3}>
            {accounts.length === 0 && <div>まだ、1つもMinecraftアカウントが紐づいていません。</div>}
            {accounts.map((account) => (
                <div key={account.player_id} className="d-flex gap-2 align-items-center rounded bg-body p-2">
                    <img src={`https://api.creepernation.net/head/${account.player_id}`} alt={account.player_name} title={account.player_name} height="32" className="rounded-2" />
                    <b>{account.player_name}</b>
                </div>
            ))}
        </Stack>
    );
};