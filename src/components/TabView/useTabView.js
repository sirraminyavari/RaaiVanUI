import { getUUID } from '../../helpers/helpers';
import {
  cloneElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export const useTabView = ({ children, onSelect }) => {
  const { RV_RTL: rtl } = window;
  const tabContainerEl = useRef();
  const container = useRef();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [indicatorWidth, setIndicatorWidth] = useState();
  const [indicatorOffset, setIndicatorOffset] = useState();
  const [bodyWidth, setBodyWidth] = useState();

  const action = useCallback(
    [...children].find((x) => x?.type?.name === 'Action') || null,
    [children]
  );
  const items = useCallback(
    children
      .filter((x) => x?.type?.name === 'Item')
      .map((x) => {
        console.log(x);
        return x;
      })
      .map((x, index) => ({
        ...x,
        key: x?.key || getUUID(),
        props: { ...x.props, index },
      }))
      .map((x) => cloneElement(x)),
    [children]
  );

  const selectedBody = useMemo(
    () => items.find((x) => x?.props?.index === selectedIndex)?.props?.children,
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
  }, [selectedIndex]);

  useEffect(() => {
    setBodyWidth(container?.current?.offsetWidth);
  }, []);

  return {
    rtl,
    action,
    items,
    selectedIndex,
    setSelectedIndex,
    selectedBody,
    tabContainerEl,
    container,
    indicatorWidth,
    indicatorOffset,
    bodyWidth,
    onItemSelect,
    onResize,
  };
};
export default useTabView;
