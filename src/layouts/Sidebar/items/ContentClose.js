/**
 * Renders when sidebar is closed.
 */
import { useState, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ChevronIcon from 'components/Icons/ChevronIcons/Chevron';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import withTheme from 'components/withTheme/withTheme';
import * as Styled from '../Sidebar.styles';
import { themeSlice } from 'store/reducers/themeReducer';
import { MAIN_CONTENT, SETTING_CONTENT } from 'constant/constants';
import useWindow from 'hooks/useWindowContext';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';
import { getURL } from 'helpers/helpers';

const SidebarOnClose = ({ theme }) => {
  const dispatch = useDispatch();
  const iconListRef = useRef();

  const { RVDic, RV_RevFloat, RV_Float } = useWindow();

  //! Stores scroll value
  const [scroll, setScroll] = useState(0);
  //! If true, scroll is at the very bottom, If not, its not!
  const [isDown, setIsDown] = useState(false);
  //! If true, scroll is at the very top, If not, its not!
  const [isUp, setIsUp] = useState(false);

  const { dndTree } = useSelector((state) => state?.sidebarItems);
  const { handleSettings } = theme.actions;
  const { setSidebarContent } = themeSlice.actions;

  const nodes = (dndTree.items && Object.values(dndTree.items)) || [];

  //! Calls on every click on chevron down.
  const scrollDown = () => {
    if (isDown) return;
    setScroll((s) => s + 45);
  };

  //! Calls on every click on chevron up.
  const scrollUp = () => {
    if (isUp) return;
    setScroll((s) => s - 45);
  };

  //! Toggle settings content on click.
  const handleOnClick = () => {
    dispatch(handleSettings());
    dispatch(
      setSidebarContent({ current: SETTING_CONTENT, prev: MAIN_CONTENT })
    );
  };

  // //! Updates scroll position.
  // const handleScroll = () => {
  //   const diff =
  //     iconListRef.current.scrollHeight - iconListRef.current.clientHeight;
  //   const isScrollDown = iconListRef.current.scrollTop === diff;
  //   const isScrollUp = iconListRef.current.scrollTop === 0;
  //   setIsDown(isScrollDown);
  //   setIsUp(isScrollUp);
  //   if (isScrollDown) {
  //     setScroll(diff);
  //   }
  //   if (isScrollUp) {
  //     setScroll(0);
  //   }
  // };

  // useLayoutEffect(() => {
  //   iconListRef.current.scrollTo({
  //     top: scroll,
  //     left: 0,
  //     behavior: 'smooth',
  //   });
  //   handleScroll();
  // }, [scroll]);
  const handleScrollUp = () => {
    setIsUp(false);
    setIsDown(false);
  };

  const handleScrollStart = () => {
    setIsUp(true);
    setIsDown(false);
  };

  const handleScrollEnd = () => {
    setIsUp(false);
    setIsDown(true);
  };

  return (
    <>
      <Styled.SidebarTitle>
        <Tooltip
          tipId="sidebar-setting-icon"
          effect="solid"
          place={RV_RevFloat}
          offset={{ [RV_Float]: -10 }}
          renderContent={() => (
            <span style={{ textTransform: 'capitalize' }}>
              {RVDic.Settings}
            </span>
          )}>
          <Styled.SettingWrapper isClose onClick={handleOnClick}>
            <SettingIcon size={22} />
          </Styled.SettingWrapper>
        </Tooltip>
      </Styled.SidebarTitle>
      <Styled.CloseContentContainer>
        <Styled.Up isUp={isUp} onClick={scrollUp}>
          <ChevronIcon dir="up" />
        </Styled.Up>
        <Styled.IconListContainer>
          {/* <Styled.IconListWrap ref={iconListRef} onScroll={handleScroll}> */}
          <PerfectScrollbar
            onYReachStart={handleScrollStart}
            onYReachEnd={handleScrollEnd}
            onScrollUp={handleScrollUp}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}>
            {nodes?.map((node, key) => {
              const { data, id } = node;
              return (
                <Tooltip
                  key={key}
                  tipId={id}
                  effect="solid"
                  offset={{ [RV_Float]: -10 }}
                  place={RV_RevFloat}
                  renderContent={() => data?.title}>
                  <Styled.MiniIconWrapper
                    as={Link}
                    to={getURL('Classes', { NodeTypeID: id })}>
                    {data?.iconURL && (
                      <Styled.MenuItemImage
                        src={data?.iconURL}
                        alt="sidebar-icon-closed"
                      />
                    )}
                  </Styled.MiniIconWrapper>
                </Tooltip>
              );
            })}
          </PerfectScrollbar>
          {/* </Styled.IconListWrap> */}
        </Styled.IconListContainer>
        <Styled.Down isDown={isDown} onClick={scrollDown}>
          <ChevronIcon dir="down" />
        </Styled.Down>
      </Styled.CloseContentContainer>
    </>
  );
};

export default withTheme(SidebarOnClose);
