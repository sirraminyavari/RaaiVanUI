import { IGetDashboardResponse } from 'apiHelper/ApiHandlers/NotificationsAPI';
import { getNodePageUrl } from 'apiHelper/getPageUrl';
import { Link } from 'react-router-dom';
import DashboardPanelDate from '../DashboardPanelDate/DashboardPanelDate';
import * as Styles from './DashboardPanelViewDoneItem.styles';
type IDashboardPanelViewDoneItem = IGetDashboardResponse['Items'][number];

const DashboardPanelViewDoneItem = (
  doneItem: IDashboardPanelViewDoneItem
): JSX.Element => {
  return (
    <Styles.DashboardPanelViewDoneItemsContainer>
      <Styles.DashboardPanelViewDoneItemAccordion
        label={
          <DashboardPanelViewDoneItemAccordionLabel
            title={doneItem.NodeName}
            href={getNodePageUrl(doneItem.NodeID)}
            date={{
              date: (doneItem.SendDate || '  ').split(' ')[1],
              time: (doneItem.SendDate || '  ').split(' ')[0],
            }}
          />
        }
      >
        <Styles.DashboardPanelViewDoneItemDetailsContainer>
          {new Array(4).fill(0).map((_, idx, array) => {
            return (
              <>
                <Styles.DashboardPanelViewDoneItemContainer>
                  <Styles.DashboardPanelViewDoneItemTitle>
                    تایید ویرایش دانشنامه
                  </Styles.DashboardPanelViewDoneItemTitle>
                  <DashboardPanelDate
                    minimal
                    dateObject={{ date: '1400/02/09', time: '15:58' }}
                  />
                </Styles.DashboardPanelViewDoneItemContainer>
                {array.length - 1 !== idx && (
                  <Styles.DashboardPanelViewDoneItemSeparator />
                )}
              </>
            );
          })}
        </Styles.DashboardPanelViewDoneItemDetailsContainer>
      </Styles.DashboardPanelViewDoneItemAccordion>
    </Styles.DashboardPanelViewDoneItemsContainer>
  );
};

DashboardPanelViewDoneItem.displayName = 'DashboardPanelViewDoneItem';

export default DashboardPanelViewDoneItem;

const DashboardPanelViewDoneItemAccordionLabel = ({
  title = '',
  href = '/',
  date = {
    date: '',
    time: '',
  },
}) => {
  return (
    <Styles.DashboardPanelViewDoneItemLabel>
      <span>
        {title}
        <Link to={href}>
          <Styles.DashboardPanelViewDoneItemExternalLinkIcon />
        </Link>
      </span>
      <DashboardPanelDate dateObject={date} />
    </Styles.DashboardPanelViewDoneItemLabel>
  );
};
