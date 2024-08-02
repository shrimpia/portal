import { css } from '@linaria/core';
import { useAtomValue } from 'jotai';
import React from 'react';

import { MfmView } from './MfmView';

import { userAtom } from '@/states/user';

const wrapperStyle = css`
  --x-note-bg: rgb(57, 36, 55);
  --x-note-fg: rgb(244, 247, 243);
  --x-react-bg: rgba(128, 128, 128, 0.3);

  &[data-theme="light"] {
    --x-note-bg: rgb(208, 227, 247);
    --x-note-fg: rgb(0, 0, 0);
    --x-react-bg: rgba(0, 0, 0, 0.05);
  }

  position: relative;
  display: flex;

  background-color: var(--x-note-bg);
  color: var(--x-note-fg);
  padding: 16px;
  border-radius: 8px;

  .avatarOuter {
    position: relative;
    vertical-align: bottom;
    flex-shrink: 0;
    border-radius: 100%;
    line-height: 16px;
    width: 58px;
    height: 58px;
    margin: 0 14px 0 0;
    overflow: clip;
  }

  .header {
    display: flex;
    align-items: baseline;
    white-space: nowrap;
  }

  .name {
    flex-shrink: 1;
    display: block;
    margin: 0 .5em 0 0;
    padding: 0;
    overflow: hidden;
    font-size: 1em;
    font-weight: 700;
    text-decoration: none;
    text-overflow: ellipsis;
  }

  .username {
    flex-shrink: 9999999;
    margin: 0 .5em 0 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .emoji {
    height: 2em;
    vertical-align: middle;
    transition: transform .2s ease;
  }
  
  .xlT1y {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 4px -2px 0;
  }
  
  .button {
    display: inline-flex;
    margin: 2px;
    padding: 0 6px;
    border-radius: 6px;
    align-items: center;
    justify-content: center;
    background: var(--x-react-bg);
    height: 32px;
    font-size: 1em;
    border-radius: 4px;
    appearance: none;
    border: none;
    color: inherit;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    font-family: inherit;
    line-height: inherit;
    max-width: 100%;
  }
  
  .reaction {
    height: 1.25em;
    vertical-align: -.25em;
  }
  
  .button.react>.count {
    font-size: .9em;
    line-height: 32px;
  }
  
  .count {
    margin: 0 0 0 4px;
  }
`;

export const EmojiNoteView: React.FC<{emojiUrl: string; theme: 'dark' | 'light'}> = ({ emojiUrl, theme }) => {
  const user = useAtomValue(userAtom);

  return (
    <article className={wrapperStyle} data-theme={theme}>
      <div className="avatarOuter" title="Shrimpia">
        <img height="58" width="58" src={user?.avatarUrl} loading="lazy" decoding="async" />
      </div>
      <div>
        <header className="header">
          <div className="name"><MfmView plain>{user?.name ?? user?.username ?? 'Dummy'}</MfmView></div>
          <div className="username">@{user?.username ?? 'Dummy'}</div>
        </header>
        <div>
          <span style={{ whiteSpace: 'pre-wrap' }}>
            新しい絵文字だよ！！　→→　
            <img className="emoji" src={emojiUrl} decoding="async" />
          </span>
        </div>
        <div className="xlT1y">
          <button type="button" className="_button button react" tabIndex={-1}>
            <img className="emoji reaction" src={emojiUrl} decoding="async" /><span className="count">1</span>
          </button>
        </div>
      </div>
    </article>
  );
};
