import * as Styled from './TabViewStyle';
import { createContext, useContext, useEffect, useRef } from 'react';
import useTabView from './useTabView';

const TabContext = createContext({});

/**
 * @description tabview component organize content into separate views where only one view can be visible at a time
 * @param height height of the tabview item in 'rem'
 * @param onSelect an event which fire on each tab selection and pass the optional key attribute
 * @return {JSX.Element}
 * @constructor
 */
export const TabView = ({ height = 3, onSelect, ...rest }) => {
  const { children } = rest;
  const {
    rtl,
    action,
    items,
    selectedIndex,
    selectedBody,
    tabContainerEl,
    indicatorWidth,
    indicatorOffset,
    onItemSelect,
    onResize,
  } = useTabView({ children, onSelect });

  return (
    <TabContext.Provider value={{ selectedIndex, onResize, onItemSelect }}>
      <Styled.TabViewContainer rtl={rtl}>
        <Styled.TabHeader height={height}>
          <Styled.TabItemContainer ref={tabContainerEl}>
            <Styled.Items height={height}>{items}</Styled.Items>
            <Styled.IndicatorContainer>
              <Styled.Indicator
                offset={indicatorOffset}
                width={indicatorWidth}
                rtl={rtl}
              />
            </Styled.IndicatorContainer>
          </Styled.TabItemContainer>

          {action && <Styled.ActionContainer>{action}</Styled.ActionContainer>}
        </Styled.TabHeader>

        <Styled.TabBody>{selectedBody}</Styled.TabBody>
      </Styled.TabViewContainer>
    </TabContext.Provider>
  );
};

const Item = ({ label, ...rest }) => {
  const { index, width } = rest;
  const { selectedIndex, onItemSelect, onResize } = useContext(TabContext);
  const itemEl = useRef();

  useEffect(() => {
    window.addEventListener('resize', (e) => {
      if (selectedIndex === index) {
        onResize(itemEl?.current?.getBoundingClientRect());
      }
    });
    return () => {
      window.removeEventListener('resize', null);
    };
  });

  const onSelect = () => {
    onItemSelect(index, itemEl?.current?.getBoundingClientRect());
  };

  useEffect(() => {
    if (selectedIndex === index) {
      onSelect();
    }
  }, []);

  return (
    <Styled.TabViewItem
      ref={itemEl}
      highlight={selectedIndex === index}
      width={width}
      onClick={onSelect}
    >
      {label}
    </Styled.TabViewItem>
  );
};

const Action = ({ children }) => {
  return <>{children}</>;
};

TabView.Item = Item;
TabView.Action = Action;
export default TabView;
