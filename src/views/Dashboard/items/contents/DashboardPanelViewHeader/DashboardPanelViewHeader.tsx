import * as Styles from './DashboardPanelViewHeader.styles';

export interface IDashboardPanelViewHeader {
  title: string;
  onReturn: () => void;
}

const DashboardPanelViewHeader = ({
  title,
  onReturn,
}: IDashboardPanelViewHeader): JSX.Element => {
  return (
    <>
      <Styles.DashboardPanelViewHeaderContainer>
        <Styles.DashboardPanelViewHeaderTitleContainer>
          <Styles.DashboardPanelViewHeaderTitle>
            {title}
          </Styles.DashboardPanelViewHeaderTitle>
        </Styles.DashboardPanelViewHeaderTitleContainer>
        <Styles.DashboardPanelViewHeaderReturnButtonContainer>
          <Styles.DashboardPanelViewHeaderReturnButton onClick={onReturn} />
        </Styles.DashboardPanelViewHeaderReturnButtonContainer>
      </Styles.DashboardPanelViewHeaderContainer>
    </>
  );
};

DashboardPanelViewHeader.displayName = 'DashboardPanelViewHeader';

export default DashboardPanelViewHeader;
