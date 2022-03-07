import {
  Container,
  UnitWrapper,
  Image,
  MoreUnits,
} from './MembersPreviewStyles';
import { useMemo } from 'react';
import AddIcon from '../Icons/AddIcon/AddIcon';

const MembersPreview = ({
  members,
  maxItems = 2,
  size = 2,
  showMore = false,
  showMoreRenderer,
}) => {
  const { RV_RTL: rtl } = window;
  const maxWidth = useMemo(() => {
    const units = maxItems + 1;
    return `${units * size}rem`;
  }, [maxItems, size, showMore]);

  const { items, remains } = useMemo(() => {
    let _items;
    let _remains = [];
    _items = members.filter((x, index) => index <= maxItems - 1);
    _remains = members.filter((x, index) => index > maxItems - 1);
    return { items: _items, remains: _remains };
  }, [members]);

  return (
    <Container {...{ maxWidth, rtl }}>
      {remains.length !== 0 && (
        <UnitWrapper index={0} {...{ size, rtl }}>
          <MoreUnits {...{ size }}>
            <AddIcon size={10} />
            <div>{remains.length}</div>
          </MoreUnits>
        </UnitWrapper>
      )}
      {items?.map((x, index) => {
        const { title, src } = x;
        if (remains.length !== 0) index++;
        return (
          <UnitWrapper key={index} {...{ size, rtl, index }}>
            <Image {...{ src, size, title }} />
          </UnitWrapper>
        );
      })}
    </Container>
  );
};
export default MembersPreview;
