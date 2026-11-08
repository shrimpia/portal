import { useMemo } from 'react';

import { MfmView } from '@/components/common/MfmView';

export type ParsedComment = {
  fontName: string | null;
  fontSource: string | null;
  kana: string | null;
  description: string;
};

/**
 * 申請コメントをパースして構造化データに変換する
 */
export const parseComment = (comment: string | null): ParsedComment | null => {
  if (!comment?.trim()) return null;

  const data: ParsedComment = {
    fontName: null,
    fontSource: null,
    kana: null,
    description: '',
  };

  const lines = comment.trim().split('\n');

  for (const line of lines) {
    if (line.startsWith('フォント名: ')) {
      data.fontName = line.slice('フォント名: '.length);
    } else if (line.startsWith('よみがな: ')) {
      data.kana = line.slice('よみがな: '.length);
    } else if (line.startsWith('フォント入手元: ')) {
      data.fontSource = line.slice('フォント入手元: '.length);
    } else {
      data.description += line + '\n';
    }
  }

  return data;
};

export type ParsedCommentViewProps = {
  comment: string | null;
  customData?: Array<{
    label: string;
    icon?: string;
    value: React.ReactNode;
  }>;
};

/**
 * 申請コメントを解析して見やすい形式で表示するコンポーネント
 */
export const ParsedCommentView: React.FC<ParsedCommentViewProps> = ({ comment, customData = [] }) => {
  const parsed = useMemo(() => parseComment(comment) ?? {
    fontName: null,
    fontSource: null,
    kana: null,
    description: '',
  }, [comment]);
  const noText = useMemo(() => <span className="lu-text-dimmed">未記入</span>, []);

  return (
    <table style={{ width: 'auto', marginBottom: 0 }}>
      <tbody>
        {customData.map((data, index) => (
          <tr key={index}>
            <th>
              {data.icon && <i className={`bi ${data.icon} lu-me-1`} />}
              {data.label}
            </th>
            <td>{data.value}</td>
          </tr>
        ))}
        {parsed.fontName && (
          <tr>
            <th><i className="bi bi-fonts" /> 使用フォント</th>
            <td>{parsed.fontName || noText}</td>
          </tr>
        )}
        {parsed.fontSource && (
          <tr>
            <th><i className="bi bi-link-45deg" /> フォント入手元</th>
            <td>{parsed.fontSource || noText}</td>
          </tr>
        )}
        {parsed.kana && (
          <tr>
            <th><i className="bi bi-type" /> ふりがな</th>
            <td>{parsed.kana || noText}</td>
          </tr>
        )}
        <tr>
          <th><i className="bi bi-chat-left-heart-fill" /> コメント</th>
          <td>{parsed.description.trim() ? <MfmView>{parsed.description}</MfmView> : noText}</td>
        </tr>
      </tbody>
    </table>
  );
};
