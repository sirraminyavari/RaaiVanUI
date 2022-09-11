// import useWindow from 'hooks/useWindowContext';

import * as Styles from './DashboardPanelDate.styles';

export interface IDashboardPanelDate {
  minimal?: boolean;
}

const DashboardPanelDate = ({ minimal }: IDashboardPanelDate): JSX.Element => {
  // const { RVDic } = useWindow();

  //TODO RVDic initialization !!

  return (
    <Styles.DashboardPanelDateContainer minimal={minimal}>
      {!minimal && <Styles.DashboardPanelDateCalendarIcon />}
      <span>15:58</span>
      <span>1400/02/09</span>
    </Styles.DashboardPanelDateContainer>
  );
};

DashboardPanelDate.displayName = 'DashboardPanelDate';

export default DashboardPanelDate;
