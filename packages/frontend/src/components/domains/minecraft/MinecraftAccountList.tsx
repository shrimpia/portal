import { Stack } from '@/components/ui/Stack';
import { minecraftAccountsAtom } from "@/states/minecraft";
import { useAtom } from "jotai";
import { css } from "@linaria/core";
import React from "react";

const accountStyle = css`
    padding: var(--space-2);
    border-radius: var(--radius-md);
    background: var(--background);
`;

export const MinecraftAccountList: React.FC = () => {
    const [{data: accounts}] = useAtom(minecraftAccountsAtom);

    return (
        <Stack gap={4}>
            {accounts.length === 0 && <div>まだ、1つもMinecraftアカウントが紐づいていません。</div>}
            {accounts.map((account) => (
                <Stack key={account.player_id} direction="horizontal" gap={2} align="center" className={accountStyle}>
                    <img src={`https://api.creepernation.net/head/${account.player_id}`} alt={account.player_name} title={account.player_name} height="32" style={{ borderRadius: "var(--radius-sm)" }} />
                    <b>{account.player_name}</b>
                </Stack>
            ))}
        </Stack>
    );
};