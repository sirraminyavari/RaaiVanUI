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
import { MAIN_CONTENT, SETTING_CONTENT } from 'constant/constants';
import useWindow from 'hooks/useWindowContext';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';
import { decodeBase64, getURL } from 'helpers/helpers';
import usePreventScroll from 'hooks/usePreventScroll';
import { useThemeSlice } from 'store/slice/theme';
import { selectSidebar } from 'store/slice/sidebar/selectors';

/**
 * Renders content for the sidebar in close mode.
 * @returns {React.Component}
 */
const SidebarOnClose = ({ theme }) => {
  const dispatch = useDispatch();

  const itemRef = useRef();
  const listRef = useRef();
  const containerRef = useRef();
  const [hasArrow, setHasArrow] = useState(false);
  const { RVDic, RV_RevFloat, RV_Float, GlobalUtilities } = useWindow();
  //! Stores scroll value
  const [scroll, setScroll] = useState(0);
  //! If true, scroll is at the very bottom, If not, its not!
  const [isDown, setIsDown] = useState(false);
  //! If true, scroll is at the very top, If not, its not!
  const [isUp, setIsUp] = useState(false);
  const { nodeTypes: sidebarNodeTypes } = useSelector(selectSidebar);
  const { handleSettings } = theme.actions;
  const {
    actions: { setSidebarContent },
  } = useThemeSlice();

  usePreventScroll(containerRef);

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

  const checkValidNodes = (node, index, self) => {
    const nodeParentId = node?.ParentID;
    const isNodeHidden = !!node.Hidden;

    //! Check if it is hidden or not.
    if (isNodeHidden) {
      return false;
    }

    //! Check if its parent is hidden or not.
    if (!!nodeParentId) {
      const parentNode = self.find((item) => item.NodeTypeID === nodeParentId);
      const isParentHidden = !!parentNode?.Hidden;
      const isParentCategory = parentNode?.IsCategory;
      if (isParentHidden || !isParentCategory) {
        return false;
      }
    }

    return true;
  };

  const filteredSidebarNodes = sidebarNodeTypes?.filter(checkValidNodes);
  const hasSidebarNodes = !!filteredSidebarNodes.length;
  //! Shows the chevron if there are enough nodes.
  useLayoutEffect(() => {
    const listContainerHeight =
      listRef?.current?.getBoundingClientRect()?.height;
    const itemHeight = itemRef?.current?.getBoundingClientRect()?.height;
    if (
      hasSidebarNodes &&
      itemHeight * filteredSidebarNodes.length > listContainerHeight
    ) {
      setHasArrow(true);
    } else {
      setHasArrow(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebarNodeTypes]);

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
          )}
        >
          <Styled.SettingWrapper isClose onClick={handleOnClick}>
            <SettingIcon size={22} />
          </Styled.SettingWrapper>
        </Tooltip>
      </Styled.SidebarTitle>
      <Styled.CloseContentContainer>
        {hasSidebarNodes && hasArrow && (
          <Styled.Up isUp={isUp} onClick={scrollUp}>
            <ChevronIcon dir="up" />
          </Styled.Up>
        )}
        <Styled.IconListContainer ref={listRef}>
          <ScrollBarProvider
            onYReachStart={handleScrollStart}
            onYReachEnd={handleScrollEnd}
            onScrollUp={handleScrollUp}
            direction={RV_Float}
            brightMode={true}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div ref={containerRef}>
              {filteredSidebarNodes?.map((node, key) => {
                const { TypeName, NodeTypeID, IconURL } = node;
                return (
                  <Tooltip
                    key={key}
                    tipId={NodeTypeID}
                    effect="solid"
                    offset={{ [RV_Float]: -10 }}
                    place={RV_RevFloat}
                    renderContent={() => decodeBase64(TypeName)}
                  >
                    <Styled.MiniIconWrapper
                      ref={itemRef}
                      as={Link}
                      to={getURL('Classes', { NodeTypeID: NodeTypeID })}
                    >
                      {!!IconURL && (
                        <Styled.MenuItemImage
                          src={GlobalUtilities.add_timestamp(IconURL)}
                          alt="sidebar-icon-closed"
                        />
                      )}
                    </Styled.MiniIconWrapper>
                  </Tooltip>
                );
              })}
            </div>
          </ScrollBarProvider>
        </Styled.IconListContainer>
        {hasSidebarNodes && hasArrow && (
          <Styled.Down isDown={isDown} onClick={scrollDown}>
            <ChevronIcon dir="down" />
          </Styled.Down>
        )}
      </Styled.CloseContentContainer>
    </>
  );
};

export default withTheme(SidebarOnClose);
