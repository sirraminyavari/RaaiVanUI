/**
 * Renders when sidebar is closed.
 */
import { useState, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ChevronIcon from 'components/Icons/ChevronIcons/Chevron';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import SidebarIcons from 'components/Icons/SidebarIcons/SidebarIcons';
import withTheme from 'components/withTheme/withTheme';
import * as Styled from '../Sidebar.styles';
import { themeSlice } from 'store/reducers/themeReducer';
import PopupMenu from 'components/PopupMenu/PopupMenu';
import { decodeBase64 } from 'helpers/helpers';

const SidebarOnClose = ({ theme }) => {
  const dispatch = useDispatch();
  const iconListRef = useRef();

  //! Stores scroll value
  const [scroll, setScroll] = useState(0);
  //! If true, scroll is at the very bottom, If not, its not!
  const [isDown, setIsDown] = useState(false);
  //! If true, scroll is at the very top, If not, its not!
  const [isUp, setIsUp] = useState(false);

  const { nodeTypes } = useSelector((state) => state.sidebarItems);
  const { handleSettings } = theme.actions;
  const { setSidebarContent } = themeSlice.actions;

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
    dispatch(setSidebarContent('setting'));
  };

  //! Updates scroll position.
  const handleScroll = () => {
    const diff =
      iconListRef.current.scrollHeight - iconListRef.current.clientHeight;
    const isScrollDown = iconListRef.current.scrollTop === diff;
    const isScrollUp = iconListRef.current.scrollTop === 0;
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
    iconListRef.current.scrollTo({
      top: scroll,
      left: 0,
      behavior: 'smooth',
    });
    handleScroll();
  }, [scroll]);

  return (
    <>
      <Styled.SidebarTitle style={{ marginRight: '3.4rem' }}>
        <PopupMenu
          arrowStyle="z-index: 10; background-color: #333; width: 1rem; margin: 1rem; border: 0;"
          menuStyle="border: 0; padding: 0.3rem 1rem; margin: 1rem; background-color: #333;"
          trigger="hover"
          align="left">
          <div>
            <Styled.SettingWrapper onClick={handleOnClick}>
              <SettingIcon size={22} />
            </Styled.SettingWrapper>
          </div>
          <div>تنظیمات</div>
        </PopupMenu>
      </Styled.SidebarTitle>
      <Styled.CloseContentContainer>
        <Styled.Up isUp={isUp} onClick={scrollUp}>
          <ChevronIcon dir="up" />
        </Styled.Up>
        <Styled.IconListContainer>
          <Styled.IconListWrap ref={iconListRef} onScroll={handleScroll}>
            {nodeTypes.map((node, key) => {
              let { IconURL, IconName, NodeTypeID, TypeName } = node;
              return (
                <PopupMenu
                  arrowStyle="z-index: 10; background-color: #333; width: 1rem; margin: 1rem; border: 0;"
                  menuStyle="border: 0; padding: 0.4rem 1rem; margin: 1rem; background-color: #333;"
                  trigger="hover"
                  align="left">
                  <div>
                    <Styled.MiniIconWrapper
                      as={Link}
                      to={`/classes/${NodeTypeID}`}
                      key={key}>
                      {IconName && SidebarIcons[IconName]()}
                      {IconURL && (
                        <Styled.MenuItemImage
                          src={IconURL}
                          alt="sidebar-icon-closed"
                        />
                      )}
                    </Styled.MiniIconWrapper>
                  </div>
                  <div>{decodeBase64(TypeName)}</div>
                </PopupMenu>
              );
            })}
          </Styled.IconListWrap>
        </Styled.IconListContainer>
        <Styled.Down isDown={isDown} onClick={scrollDown}>
          <ChevronIcon dir="down" />
        </Styled.Down>
      </Styled.CloseContentContainer>
    </>
  );
};

export default withTheme(SidebarOnClose);
