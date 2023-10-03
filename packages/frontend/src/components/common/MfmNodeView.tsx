import { CustomEmojiView } from './CustomEmojiView';
import { UserLinkView } from './UserLinkView';

import type { MfmNode } from 'mfm-js';

export type MfmNodeProp = {
  node: MfmNode;
};

export const MfmNodeView = ({ node }: MfmNodeProp) => {
  switch (node.type) {
    case 'text': {
      return node.props.text.split(/\n/g).map((t, i, a) => <span key={i}>{t}{i === a.length - 1 ? null : <br/>}</span>);
    }
    case 'bold': {
      return <strong>{node.children.map((child) => <MfmNodeView node={child} />)}</strong>;
    }
    case 'italic': {
      return <em>{node.children.map((child) => <MfmNodeView node={child} />)}</em>;
    }
    case 'strike': {
      return <del>{node.children.map((child) => <MfmNodeView node={child} />)}</del>;
    }
    case 'link': {
      return (
        <a href={node.props.url} target="_blank" rel="noopener noreferrer">
          {node.children.map((child) => <MfmNodeView node={child} />)}
        </a>
      );
    }
    case 'mention': {
      return <UserLinkView username={node.props.username} />;
    }
    case 'unicodeEmoji': {
      return <span>{node.props.emoji}</span>;
    }
    case 'emojiCode': {
      return <CustomEmojiView name={node.props.name} />;
    }
    case 'hashtag': {
      return <span>#{node.props.hashtag}</span>;
    }
    case 'plain': {
      return node.children.map((child) => <MfmNodeView node={child} />);
    }
    case 'inlineCode': {
      return <code>{node.props.code}</code>;
    }
    case 'blockCode': {
      return <pre><code>{node.props.code}</code></pre>;
    }
    case 'url': {
      return <a href={node.props.url} target="_blank" rel="noopener noreferrer">{node.props.url}</a>;
    }
    default: {
      return <span>{node.children?.map((child, i) => <MfmNodeView key={i} node={child} />)}</span>;
    }
  }
};
