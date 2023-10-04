import { CustomEmojiView } from './CustomEmojiView';

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
        <a href={node.props.url} target="_blank" rel="noopener noreferrer nofollow">
          {node.children.map((child) => <MfmNodeView node={child} />)}
        </a>
      );
    }
    case 'mention': {
      return node.props.host ? `@${node.props.username}@${node.props.host}` : `@${node.props.username}`;
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
      return <a href={node.props.url} target="_blank" rel="noopener noreferrer nofollow">{node.props.url}</a>;
    }
    case 'small': {
      return <small style={{ opacity: 0.7 }}>{node.children.map((child) => <MfmNodeView node={child} />)}</small>;
    }
    case 'center': {
      return <div style={{ textAlign: 'center' }}>{node.children.map((child) => <MfmNodeView node={child} />)}</div>;
    }
    case 'quote': {
      return <blockquote>{node.children.map((child) => <MfmNodeView node={child} />)}</blockquote>;
    }
    case 'search': {
      return <a href={`https://google.com/search?q=${encodeURIComponent(node.props.query)}`} target="_blank" rel="noopener noreferrer nofollow">{node.props.query} 検索</a>;
    }
    default: {
      return <span>{node.children?.map((child, i) => <MfmNodeView key={i} node={child} />)}</span>;
    }
  }
};
