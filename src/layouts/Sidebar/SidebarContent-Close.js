import { useState, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import Icons from 'components/Icons';
import {
  CloseContentContainer,
  ArrowUp,
  ArrowDown,
  IconListContainer,
  IconListWrap,
  MiniIconWrapper,
  SidebarTitle,
  SettingWrapper,
} from './Sidebar.styles';

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
];

const CloseContent = ({ showSettings }) => {
  const listRef = useRef();
  const [SC, setSC] = useState(0);
  const [isDown, setIsDown] = useState(false);
  const [isUp, setIsUp] = useState(false);

  const scrollDown = () => {
    if (isDown) return;
    setSC((c) => c + 55);
  };
  const scrollUp = () => {
    if (isUp) return;
    setSC((c) => c - 55);
  };

  const handleScroll = () => {
    const diff = listRef.current.scrollHeight - listRef.current.clientHeight;
    setIsDown(listRef.current.scrollTop === diff);
    setIsUp(listRef.current.scrollTop === 0);
  };

  useLayoutEffect(() => {
    listRef.current.scrollTo(0, SC);
    handleScroll();
  }, [SC]);

  return (
    <>
      <SidebarTitle>
        <SettingWrapper onClick={showSettings}>
          {Icons['settings']}
        </SettingWrapper>
      </SidebarTitle>
      <CloseContentContainer>
        <ArrowUp onClick={scrollUp} isUp={isUp}>
          {Icons['chevronUp']}
        </ArrowUp>
        <IconListContainer>
          <IconListWrap ref={listRef} onScroll={handleScroll}>
            {miniSide.map((icon, key) => {
              return (
                <MiniIconWrapper as={Link} to="#" key={key}>
                  {Icons[icon]}
                </MiniIconWrapper>
              );
            })}
          </IconListWrap>
        </IconListContainer>
        <ArrowDown onClick={scrollDown} isDown={isDown}>
          {Icons['chevronDown']}
        </ArrowDown>
      </CloseContentContainer>
    </>
  );
};

export default CloseContent;
