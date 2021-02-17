import { useState, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ChevronIcon from 'components/Icons/ChevronIcons/Chevron';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import SidebarIcons from 'components/Icons/SidebarIcons/SidebarIcons';
import * as Styled from './Sidebar.styles';

const CloseContent = ({ handleSettings }) => {
  const ref = useRef();
  const [scroll, setScroll] = useState(0);
  const [isDown, setIsDown] = useState(false);
  const [isUp, setIsUp] = useState(false);
  const { nodeTypes } = useSelector((state) => state.sidebarItems);

  //TODO: Calculate scroll size based on items count
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
        <Styled.SettingWrapper onClick={handleSettings}>
          <SettingIcon />
        </Styled.SettingWrapper>
      </Styled.SidebarTitle>
      <Styled.CloseContentContainer>
        <Styled.Up onClick={scrollUp} isUp={isUp}>
          <ChevronIcon dir="up" />
        </Styled.Up>
        <Styled.IconListContainer>
          <Styled.IconListWrap ref={ref} onScroll={handleScroll}>
            {nodeTypes.map((node, key) => {
              let { IconURL, IconName, NodeTypeID } = node;
              return (
                <Styled.MiniIconWrapper
                  as={Link}
                  to={`/classes/${NodeTypeID}`}
                  key={key}>
                  {IconName && SidebarIcons[IconName]()}
                  {IconURL && <img src={IconURL} alt="sidebar-icon" />}
                </Styled.MiniIconWrapper>
              );
            })}
          </Styled.IconListWrap>
        </Styled.IconListContainer>
        <Styled.Down onClick={scrollDown} isDown={isDown}>
          <ChevronIcon dir="down" />
        </Styled.Down>
      </Styled.CloseContentContainer>
    </>
  );
};

export default CloseContent;
