import { Container, UnitWrapper, Image } from './MembersPreviewStyles';
import { useMemo } from 'react';

const MembersPreview = ({
  members,
  maxItems = 4,
  size = 2,
  showMore = false,
  showMoreRenderer,
}) => {
  const { RV_RTL: rtl } = window;
  const maxWidth = useMemo(() => {
    const units = showMore ? maxItems + 1 : maxItems;
    return `${0.7 * units * size}rem`;
  }, [maxItems, size, showMore]);

  const items = [...members]
    .map((x) => ({
      ...x,
      isImg: true,
    }))
    .reverse()
    .filter((x, index) => index < maxItems)
    .map((x, index) => {
      const { title, src } = x;
      return (
        <UnitWrapper key={index} {...{ size, rtl, index }}>
          {}
          {x?.isImg ? <Image {...{ src, size, title }} /> : x}
        </UnitWrapper>
      );
    });

  return (
    <Container {...{ maxWidth, rtl }}>
      <UnitWrapper>
        <>
          {items.length > maxItems && (
            <>{!showMoreRenderer ? <div>r</div> : showMoreRenderer}</>
          )}
        </>
      </UnitWrapper>
      {items}
    </Container>
  );
};
export default MembersPreview;
