import React, { useContext, useEffect, useMemo } from 'react';
import rehype from 'rehype';
// @ts-ignore
import rehypePrism from '@mapbox/rehype-prism';
import { IProps } from '../../utils';
import { EditorContext } from '../../Context';

export interface MarkdownProps extends IProps, React.HTMLAttributes<HTMLPreElement> {}

export default function Markdown(props: MarkdownProps) {
  const { prefixCls } = props;
  const { markdown = '', highlightEnable, dispatch } = useContext(EditorContext);
  const preRef = React.createRef<HTMLPreElement>();
  useEffect(() => {
    if (preRef.current && dispatch) {
      dispatch({ textareaPre: preRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function html2Escape(sHtml: any) {
    return sHtml.replace(
      /[<>&"]/g,
      (c: string) => (({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' } as any)[c]),
    );
  }

  return useMemo(() => {
    if (!highlightEnable || !markdown)
      return <pre children={markdown || ''} ref={preRef} className={`${prefixCls}-text-pre wmde-markdown-color`} />;
    const str = rehype()
      .data('settings', { fragment: false })
      .use(rehypePrism, { ignoreMissing: true })
      .processSync(
        `<pre class="language-markdown ${prefixCls}-text-pre wmde-markdown-color"><code class="language-markdown">${html2Escape(
          markdown || '',
        )}</code></pre>`,
      );
    return <div className="wmde-markdown-color" dangerouslySetInnerHTML={{ __html: str.contents as any }} />;
  }, [highlightEnable, markdown, preRef, prefixCls]);
}
