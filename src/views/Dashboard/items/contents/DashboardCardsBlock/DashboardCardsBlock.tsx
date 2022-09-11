import { useMemo } from 'react';
import DashboardCardItem from './DashboardCardItem';
import { useHistory } from 'react-router-dom';
import {
  DASHBOARD_DONE_PATH,
  DASHBOARD_TO_BE_DONE_PATH,
} from './../../others/constants';
import * as Styles from './DashboardCardsBlock.styles';

export interface IDashboardCardsBlock {
  cardType?: 'template';
  blockTitle?: string;
  cardItems: {
    Done?: number;
    NotSeen?: number;
    ToBeDone?: number;
    Type: string;
    title?: string;
    info?: string;
    ToBeDoneBadge?: number;
    DoneLabel?: string;
    ToBeDoneLabel?: string;
    NodeTypeID?: string;
  }[];
}

const DashboardCardsBlock = ({
  cardType,
  blockTitle,
  cardItems = [],
}: IDashboardCardsBlock): JSX.Element => {
  const history = useHistory();

  const notificationItemsCount = useMemo(() => cardItems.length, [cardItems]);

  const labelClickHandler =
    (type: 'Done' | 'ToBeDone', NodeTypeID?: string) => () => {
      if (cardType === 'template' && NodeTypeID) {
        const DashboardDoneView = DASHBOARD_DONE_PATH.replace(
          ':NodeID',
          NodeTypeID
        );
        const DashboardToBeDoneView = DASHBOARD_TO_BE_DONE_PATH.replace(
          ':NodeID',
          NodeTypeID
        );
        if (type === 'Done') history.push(DashboardDoneView);
        else history.push(DashboardToBeDoneView);
      } else {
      }
    };

  //TODO RVDic initialization !!

  return (
    <Styles.DashboardCardsBlockContainer>
      <Styles.DashboardCardsItemBlockTitle>
        {blockTitle}
      </Styles.DashboardCardsItemBlockTitle>
      {notificationItemsCount ? (
        <Styles.DashboardCardsItemBlock>
          {cardItems?.map((cardItems, idx) => (
            <DashboardCardItem
              key={idx}
              cardType={cardType}
              onDoneClick={labelClickHandler('Done', cardItems?.NodeTypeID)}
              onToBeDoneClick={labelClickHandler(
                'ToBeDone',
                cardItems?.NodeTypeID
              )}
              {...cardItems}
            />
          ))}
        </Styles.DashboardCardsItemBlock>
      ) : (
        <Styles.DashboardCardsItemNotAvailable>
          !آیتمی در کارتابل شما وجود ندارد
        </Styles.DashboardCardsItemNotAvailable>
      )}
    </Styles.DashboardCardsBlockContainer>
  );
};

DashboardCardsBlock.displayName = 'DashboardCardsBlock';

export default DashboardCardsBlock;
