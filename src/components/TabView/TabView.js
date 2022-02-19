import * as Styled from './TabViewStyle';
import {
  cloneElement,
  createContext,
  createRef,
  useContext,
  useMemo,
  useState,
} from 'react';
import { getUUID } from 'helpers/helpers';

const TabContext = createContext({});

/**
 * @description
 * @param height height of the tabview item in 'rem'
 * @param width width of the tabview item in 'rem'
 * @param children
 * @return {JSX.Element}
 * @constructor
 */
export const TabView = ({ height = 3, width = 4, children }) => {
  const { RV_RTL: rtl } = window;

  const action = [...children].find((x) => x?.type?.name === 'Action') || null;

  const items = children
    .filter((x) => x?.type?.name === 'Item')
    .map((x, index) => ({
      ...x,
      key: getUUID(),
      props: { ...x.props, index, width },
    }))
    .map((x) => cloneElement(x));

  const [selectedIndex, setSelectedIndex] = useState(0);

  const indicatorOffset = useMemo(
    () => selectedIndex * width + (width - 3.5) / 2,
    [selectedIndex]
  );

  const selectedBody = useMemo(
    () => items.find((x) => x?.props?.index === selectedIndex)?.props?.children,
    [selectedIndex]
  );

  return (
    <TabContext.Provider value={{ selectedIndex, setSelectedIndex }}>
      <Styled.TabViewContainer rtl={rtl}>
        <Styled.TabHeader height={height}>
          <Styled.TabItemContainer>
            <Styled.Items height={height}>{items}</Styled.Items>
            <Styled.IndicatorContainer>
              <Styled.Indicator offset={indicatorOffset} rtl={rtl} />
            </Styled.IndicatorContainer>
          </Styled.TabItemContainer>

          {action && <Styled.ActionContainer>{action}</Styled.ActionContainer>}
        </Styled.TabHeader>

        <Styled.TabBody>{selectedBody}</Styled.TabBody>
      </Styled.TabViewContainer>
    </TabContext.Provider>
  );
};

const Item = ({ label, children, ...rest }) => {
  const { index, width } = rest;
  const { selectedIndex, setSelectedIndex } = useContext(TabContext);

  return (
    <Styled.TabViewItem
      highlight={selectedIndex?.index === index}
      width={width}
      onClick={() => setSelectedIndex(index)}
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
