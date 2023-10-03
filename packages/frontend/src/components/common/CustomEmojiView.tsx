import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

import { emojisAtom } from '@/states/emojis';

export type CustomEmojiViewProp = {
    name: string;
};

export const CustomEmojiView = ({ name }: CustomEmojiViewProp) => {
  const emojis = useAtomValue(emojisAtom);

  const emoji = useMemo(() => emojis.find(e => e.name === name), [name, emojis]);

  if (!emoji) {
    return <span>:{name}:</span>;
  }

  return <img className="sh-emoji" src={emoji.url} alt={emoji.name} title={emoji.name} />;
};
