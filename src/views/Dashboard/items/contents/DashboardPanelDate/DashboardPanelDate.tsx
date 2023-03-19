// import useWindow from 'hooks/useWindowContext';

import * as Styles from './DashboardPanelDate.styles';

export interface IDashboardPanelDate {
  minimal?: boolean;
  dateObject: {
    date: string;
    time: string;
  };
}

const DashboardPanelDate = ({
  minimal,
  dateObject,
}: IDashboardPanelDate): JSX.Element => {
  // const { RVDic } = useWindow();

  //TODO RVDic initialization !!

  return (
    <Styles.DashboardPanelDateContainer minimal={minimal}>
      {!minimal && <Styles.DashboardPanelDateCalendarIcon />}
      <span>{dateObject.time}</span>
      <span>{dateObject.date}</span>
    </Styles.DashboardPanelDateContainer>
  );
};

DashboardPanelDate.displayName = 'DashboardPanelDate';

export default DashboardPanelDate;
