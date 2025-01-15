import { useAtom, useAtomValue } from 'jotai';
import { useMemo } from 'react';

import { emojisAtom } from '@/states/emojis';

import './CustomEmojiView.scss';

export type CustomEmojiViewProp = {
    name: string;
};

export const CustomEmojiView = ({ name }: CustomEmojiViewProp) => {
  const [{data: emojis}] = useAtom(emojisAtom);

  const emoji = useMemo(() => emojis.find(e => e.name === name), [name, emojis]);

  if (!emoji) {
    return <span>:{name}:</span>;
  }

  return <img className="sh-emoji" src={emoji.url} alt={emoji.name} title={emoji.name} />;
};
