import React from 'react';

const TextContent = React.forwardRef(
  ({ textContent, className, style }, ref) => {
    if (!textContent) textContent = '';

    let htmlContent = textContent
      .replace(/</g, '&lt;')
      .replace(/ {2}/g, ' &nbsp;');

    let items = [];

    while (htmlContent.length) {
      let brInd = htmlContent.indexOf('\n');

      if (brInd == 0) {
        htmlContent = htmlContent.length == 1 ? '' : htmlContent.substring(1);
        items.push({ IsBr: true });
      } else if (brInd > 0) {
        let pre = htmlContent.substring(0, brInd);
        htmlContent =
          htmlContent.length == brInd + 1
            ? ''
            : htmlContent.substring(brInd + 1);
        items.push(pre);
        items.push({ IsBr: true });
      } else {
        items.push(htmlContent);
        htmlContent = '';
      }
    }

    const TextElem = ({ children }) => {
      return <>{children}</>;
    };

    return (
      <div ref={ref} className={className} style={style}>
        {items.map((content, ind) => {
          return content?.IsBr ? (
            <br key={ind} />
          ) : (
            <TextElem key={ind}>{content}</TextElem>
          );
        })}
      </div>
    );
  }
);

export default TextContent;
