import * as Styled from './TabViewStyle';
import { createContext, useContext, useState } from 'react';

const TabContext = createContext({});

export const TabView = ({ height = '3rem', children }) => {
  const items = children.filter((x) => x?.type?.name === 'Item');
  const [selectedTabBody, setSelectedTabBody] = useState([...items][0]);

  const action = [...children].find((x) => x?.type?.name === 'Action') || null;

  return (
    <TabContext.Provider value={{ selectedTabBody, setSelectedTabBody }}>
      <Styled.TabViewContainer>
        <Styled.TabHeader height={height}>
          <Styled.TabItemContainer>
            <Styled.Items>{items}</Styled.Items>
            <Styled.IndicatorContainer>
              {[...items]?.map((x, i) => (
                <Styled.Indicator key={i} />
              ))}
            </Styled.IndicatorContainer>
          </Styled.TabItemContainer>

          {action && <div>{action}</div>}
        </Styled.TabHeader>

        <Styled.TabBody>{selectedTabBody}</Styled.TabBody>
      </Styled.TabViewContainer>
    </TabContext.Provider>
  );
};

const Item = ({ label, children }) => {
  const { setSelectedTabBody } = useContext(TabContext);

  return (
    <div
      style={{ padding: '0 0.6rem' }}
      onClick={(e) => setSelectedTabBody(children)}
    >
      {label}
    </div>
  );
};

const Action = ({ children }) => {
  return <>{children}</>;
};

TabView.Item = Item;
TabView.Action = Action;
export default TabView;
