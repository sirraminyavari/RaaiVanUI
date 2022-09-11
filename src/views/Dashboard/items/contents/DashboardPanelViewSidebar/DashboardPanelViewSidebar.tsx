import * as Styles from './DashboardPanelViewSidebar.styles';

export interface IDashboardPanelViewSidebar {
  title?: string;
}

const DashboardPanelViewSidebar = ({
  title,
}: IDashboardPanelViewSidebar): JSX.Element => {
  return (
    <>
      <Styles.DashboardPanelViewSidebarContainer>
        <Styles.DashboardPanelViewSidebarTitle>
          {title}
        </Styles.DashboardPanelViewSidebarTitle>
        {new Array(6).fill(0).map((_, idx) => {
          return (
            <Styles.DashboardPanelViewSidebarItemContainer active={!(idx % 2)}>
              وضعیت وظایف
              <Styles.DashboardPanelViewSidebarBadge
                active={!(idx % 2)}
                value={23}
              />
            </Styles.DashboardPanelViewSidebarItemContainer>
          );
        })}
      </Styles.DashboardPanelViewSidebarContainer>
    </>
  );
};

DashboardPanelViewSidebar.displayName = 'DashboardPanelViewSidebar';

export default DashboardPanelViewSidebar;
