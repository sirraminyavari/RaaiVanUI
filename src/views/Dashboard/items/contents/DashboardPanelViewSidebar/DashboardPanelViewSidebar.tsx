import { useCallback, useEffect, useState } from 'react';
import * as Styles from './DashboardPanelViewSidebar.styles';

export interface IDashboardPanelViewSidebar {
  title?: string;
  mobile?: boolean;
  onToggle?: (
    selected: IDashboardPanelViewSidebar['nodeTypes'][number] | undefined
  ) => void;
  nodeTypes: {
    NodeType: string;
    NodeID: string;
    Badge: number;
  }[];
  DoneAndInWorkFlowTypeBadge?: number;
  DoneAndNotInWorkFlowTypeBadge?: number;
}

const DashboardPanelViewSidebar = ({
  title,
  mobile,
  nodeTypes,
  onToggle,
  DoneAndInWorkFlowTypeBadge,
  DoneAndNotInWorkFlowTypeBadge,
}: IDashboardPanelViewSidebar): JSX.Element => {
  const [toggled, setToggled] =
    useState<IDashboardPanelViewSidebar['nodeTypes'][number]>();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);

  useEffect(() => {
    onToggle && onToggle(toggled);
  }, [onToggle, toggled]);

  const dropdownMenuHandler = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenuOpen]);
  return (
    <>
      <Styles.DashboardPanelViewSidebarContainer mobile={mobile}>
        <Styles.DashboardPanelViewSidebarTitle onClick={dropdownMenuHandler}>
          {title}
          {mobile && (
            <Styles.DashboardPanelViewSidebarMenuIcon active={isMenuOpen} />
          )}
        </Styles.DashboardPanelViewSidebarTitle>
        <Styles.DashboardPanelViewSidebarItemsContainer
          mobile={mobile}
          active={isMenuOpen}
        >
          {nodeTypes.map((nodeType) => {
            return (
              <Styles.DashboardPanelViewSidebarItem
                onClick={() =>
                  setToggled((prev) => {
                    if (prev?.NodeID === nodeType.NodeID) return undefined;
                    return nodeType;
                  })
                }
                active={toggled?.NodeID === nodeType.NodeID}
              >
                {nodeType.NodeType}
                <Styles.DashboardPanelViewSidebarBadge
                  active={toggled?.NodeID === nodeType.NodeID}
                  value={nodeType.Badge}
                />
              </Styles.DashboardPanelViewSidebarItem>
            );
          })}
          {(DoneAndInWorkFlowTypeBadge || DoneAndNotInWorkFlowTypeBadge) && (
            <Styles.DashboardPanelViewSidebarSeparator />
          )}
          {DoneAndInWorkFlowTypeBadge && (
            <Styles.DashboardPanelViewSidebarItem
              onClick={() =>
                setToggled((prev) => {
                  if (prev?.NodeID === 'DoneAndInWorkFlow') return undefined;
                  return {
                    NodeID: 'DoneAndInWorkFlow',
                    NodeType: '',
                    Badge: DoneAndInWorkFlowTypeBadge!,
                  };
                })
              }
              active={toggled?.NodeID === 'DoneAndInWorkFlow'}
            >
              درجریان
              <Styles.DashboardPanelViewSidebarBadge
                active={toggled?.NodeID === 'DoneAndInWorkFlow'}
                value={DoneAndInWorkFlowTypeBadge}
              />
            </Styles.DashboardPanelViewSidebarItem>
          )}
          {DoneAndNotInWorkFlowTypeBadge && (
            <Styles.DashboardPanelViewSidebarItem
              onClick={() =>
                setToggled((prev) => {
                  if (prev?.NodeID === 'DoneAndNotInWorkFlow') return undefined;
                  return {
                    NodeID: 'DoneAndNotInWorkFlow',
                    NodeType: '',
                    Badge: DoneAndNotInWorkFlowTypeBadge!,
                  };
                })
              }
              active={toggled?.NodeID === 'DoneAndNotInWorkFlow'}
            >
              خاتمه یافته
              <Styles.DashboardPanelViewSidebarBadge
                active={toggled?.NodeID === 'DoneAndNotInWorkFlow'}
                value={DoneAndNotInWorkFlowTypeBadge}
              />
            </Styles.DashboardPanelViewSidebarItem>
          )}
        </Styles.DashboardPanelViewSidebarItemsContainer>
      </Styles.DashboardPanelViewSidebarContainer>
    </>
  );
};

DashboardPanelViewSidebar.displayName = 'DashboardPanelViewSidebar';

export default DashboardPanelViewSidebar;
