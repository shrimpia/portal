import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

import type { PropsWithChildren } from 'react';
import type { FallbackProps } from 'react-error-boundary';

export const ErrorBoundary: React.FC<PropsWithChildren> = ({ children }) => {
  const onPageError = (p: FallbackProps) => {
    const errorMessage = `
Path: ${location.pathname}
Running Mode: ${import.meta.env.DEV ? 'Development' : 'Production'}
Stack Trace:
${p.error?.stack}
`.trim();

    return (
      <div>
        <p>画面エラーが発生しました。<br/>下記のエラーメッセージを添えて、スタッフにご報告ください。</p>
        <pre>{errorMessage}</pre>
      </div>
    );
  };

  return (
    <ReactErrorBoundary fallbackRender={onPageError}>
      {children}
    </ReactErrorBoundary>
  );
};
