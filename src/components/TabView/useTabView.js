import { getUUID } from '../../helpers/helpers';
import { cloneElement, useEffect, useMemo, useRef, useState } from 'react';

export const useTabView = ({ children, onSelect }) => {
  const { RV_RTL: rtl } = window;
  const tabContainerEl = useRef();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [indicatorWidth, setIndicatorWidth] = useState();
  const [indicatorOffset, setIndicatorOffset] = useState();
  const action = [...children].find((x) => x?.type?.name === 'Action') || null;

  const tabItemsComponentBuilder = useMemo(
    () => (children) => {
      const itemsArray = [];
      children
        .filter((x) => {
          if (x?.type?.name === 'Item') return true;
          else if (Array.isArray(x) && x.length) {
            let arrayLength = x.length;

            while (arrayLength--) {
              if (x[arrayLength]?.type?.name !== 'Item') return false;
            }
            return true;
          } else return false;
        })
        .forEach((x, index) => {
          if (Array.isArray(x)) {
            let arrayLength = x.length;

            while (arrayLength--) {
              itemsArray.push({
                ...x[arrayLength],
                key: x[arrayLength]?.key || getUUID(),
                props: { ...x[arrayLength].props, index },
              });
            }
          } else
            itemsArray.push({
              ...x,
              key: x?.key || getUUID(),
              props: { ...x.props, index },
            });
        });

      return itemsArray.map((x) => cloneElement(x));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [children]
  );

  const items = tabItemsComponentBuilder(children);

  const selectedBody = useMemo(
    () => items.find((x) => x?.props?.index === selectedIndex)?.props?.children,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIndex]
  );

  const onResize = (itemPosition) => {
    setIndicatorWidth(itemPosition?.width);
    const offset =
      (itemPosition?.left -
        tabContainerEl?.current.getBoundingClientRect()?.left) /
      16;
    setIndicatorOffset(offset);
  };

  const onItemSelect = (index, position) => {
    setSelectedIndex(index);
    onResize(position);
  };

  useEffect(() => {
    if (onSelect) {
      onSelect([...items].find((x) => x?.props?.index === selectedIndex)?.key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  return {
    rtl,
    action,
    items,
    selectedIndex,
    setSelectedIndex,
    selectedBody,
    tabContainerEl,
    indicatorWidth,
    indicatorOffset,
    onItemSelect,
    onResize,
  };
};
export default useTabView;