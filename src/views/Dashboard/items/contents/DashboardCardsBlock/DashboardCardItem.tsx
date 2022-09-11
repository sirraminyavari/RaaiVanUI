import PopupMenu from 'components/PopupMenu/PopupMenu';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './DashboardCardsBlock.styles';
import { MouseEventHandler } from 'react';

export interface IDashboardCardItem {
  cardType?: 'template';
  Done?: number;
  ToBeDone?: number;
  Type: string;
  title?: string;
  info?: string;
  DoneLabel?: string | false;
  ToBeDoneLabel?: string | false;
  ToBeDoneBadge?: number;
  onToBeDoneClick?: MouseEventHandler<HTMLDivElement>;
  onDoneClick?: MouseEventHandler<HTMLDivElement>;
}

const DashboardCardItem = ({
  cardType,
  Done,
  DoneLabel,
  ToBeDone,
  ToBeDoneLabel,
  ToBeDoneBadge,
  title,
  info,
  onToBeDoneClick,
  onDoneClick,
}: IDashboardCardItem): JSX.Element => {
  const { RVDic } = useWindow();

  //TODO RVDic initialization !!
  const RVDicDone = RVDic.Done;
  const RVDicToBeDone = 'انجام دادنی';

  return (
    <>
      <Styles.DashboardCardItem>
        <Styles.DashboardCardItemTitle forTemplates={cardType === 'template'}>
          <Styles.DashboardCardItemImage src="/images/Preview.png" />
          {title}
          {info && (
            <>
              <PopupMenu>
                <Styles.DashboardCardItemTitleInfoIcon />
                <div className="er">{info}</div>
              </PopupMenu>
            </>
          )}
        </Styles.DashboardCardItemTitle>
        {ToBeDoneLabel !== false && (
          <Styles.DashboardCardItemLabelContainer onClick={onToBeDoneClick}>
            <Styles.DashboardCardItemLabelText>
              {ToBeDoneLabel || RVDicToBeDone}
              {ToBeDoneBadge && (
                <Styles.DashboardCardItemLabelTextBadge value={ToBeDoneBadge} />
              )}
            </Styles.DashboardCardItemLabelText>
            <Styles.DashboardCardItemLabelNumber>
              {ToBeDone}
            </Styles.DashboardCardItemLabelNumber>
          </Styles.DashboardCardItemLabelContainer>
        )}
        {DoneLabel !== false && (
          <Styles.DashboardCardItemLabelContainer isDone onClick={onDoneClick}>
            <Styles.DashboardCardItemLabelText>
              {DoneLabel || RVDicDone}
            </Styles.DashboardCardItemLabelText>
            <Styles.DashboardCardItemLabelNumber>
              {Done}
            </Styles.DashboardCardItemLabelNumber>
          </Styles.DashboardCardItemLabelContainer>
        )}
      </Styles.DashboardCardItem>
    </>
  );
};

DashboardCardItem.displayName = 'DashboardCardItem';

export default DashboardCardItem;
