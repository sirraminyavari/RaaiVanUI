import {
  Container,
  UnitWrapper,
  Image,
  MoreUnits,
  DropDown,
  MoreObjectItemContainer,
  MoreObjectItemImg,
  MoreObjectItemTitle,
} from './MembersPreviewStyles';
import { useMemo, useState } from 'react';
import AddIcon from '../Icons/AddIcon/AddIcon';

const MembersPreview = ({
  members,
  maxItems = 2,
  size = 2,
  showMore = false,
  showMoreRenderer,
}) => {
  const { RV_RTL: rtl } = window;

  const [showDropDown, setShowDropDown] = useState(false);

  const maxWidth = useMemo(() => {
    let units;
    if (members.length > maxItems) {
      units = maxItems + 1;
    } else {
      units = maxItems;
    }
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
      {items?.map((x, index) => {
        const { title, src } = x;
        return (
          <UnitWrapper key={index} {...{ size, rtl, index }}>
            <Image {...{ src, size, title }} />
          </UnitWrapper>
        );
      })}
      {remains.length !== 0 && (
        <UnitWrapper
          index={maxItems}
          {...{ size, rtl }}
          onMouseEnter={() => setShowDropDown(true)}
          onMouseLeave={() => setShowDropDown(false)}
        >
          <MoreUnits {...{ size }}>
            <div>{remains.length}</div>
            <AddIcon size={10} />
          </MoreUnits>
          {showDropDown && (
            <DropDown>
              {remains?.map((x, index) => {
                const { title, src } = x;
                return (
                  <MoreObjectItemContainer key={index}>
                    <MoreObjectItemImg src={src} />
                    <MoreObjectItemTitle>{title}</MoreObjectItemTitle>
                  </MoreObjectItemContainer>
                );
              })}
            </DropDown>
          )}
        </UnitWrapper>
      )}
    </Container>
  );
};
export default MembersPreview;
