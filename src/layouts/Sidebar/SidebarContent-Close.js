import { useState, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import Icons from 'components/Icons';
import * as Styled from './Sidebar.styles';

const miniSide = [
  'home',
  'teams',
  'inbox',
  'settings',
  'notifications',
  'home',
  'teams',
  'inbox',
  'settings',
  'notifications',
  'home',
  'teams',
  'inbox',
  'settings',
  'notifications',
];

const CloseContent = ({ showSettings }) => {
  const ref = useRef();
  const [scroll, setScroll] = useState(0);
  const [isDown, setIsDown] = useState(false);
  const [isUp, setIsUp] = useState(false);

  const scrollDown = () => {
    if (isDown) return;
    setScroll((s) => s + 50);
  };
  const scrollUp = () => {
    if (isUp) return;
    setScroll((s) => s - 50);
  };

  const handleScroll = () => {
    const diff = ref.current.scrollHeight - ref.current.clientHeight;
    const isScrollDown = ref.current.scrollTop === diff;
    const isScrollUp = ref.current.scrollTop === 0;
    setIsDown(isScrollDown);
    setIsUp(isScrollUp);
    if (isScrollDown) {
      setScroll(diff);
    }
    if (isScrollUp) {
      setScroll(0);
    }
  };

  useLayoutEffect(() => {
    ref.current.scrollTo(0, scroll);
    handleScroll();
  }, [scroll]);

  return (
    <>
      <Styled.SidebarTitle>
        <Styled.SettingWrapper onClick={showSettings}>
          {Icons.settings}
        </Styled.SettingWrapper>
      </Styled.SidebarTitle>
      <Styled.CloseContentContainer>
        <Styled.ArrowUp onClick={scrollUp} isUp={isUp}>
          {Icons.chevronUp}
        </Styled.ArrowUp>
        <Styled.IconListContainer>
          <Styled.IconListWrap ref={ref} onScroll={handleScroll}>
            {miniSide.map((icon, key) => {
              return (
                <Styled.MiniIconWrapper as={Link} to="#" key={key}>
                  {Icons[icon]}
                </Styled.MiniIconWrapper>
              );
            })}
          </Styled.IconListWrap>
        </Styled.IconListContainer>
        <Styled.ArrowDown onClick={scrollDown} isDown={isDown}>
          {Icons.chevronDown}
        </Styled.ArrowDown>
      </Styled.CloseContentContainer>
    </>
  );
};

export default CloseContent;
