/**
 * Renders History log section for node page side.
 */
import { useContext } from 'react';
import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import DocItemHeader from './DocItemHeader';
import LogItem from './LogItem';
import CalendarIcon from 'components/Icons/CalendarIcon/EmptyCalendarIcon';
import { SideContext } from './SideColumn';

const { RVDic } = window;
const SideHistoryLog = () => {
  const { setSideModal, nodeDetails } = useContext(SideContext);

  const { CreationDate, Creator } = nodeDetails || {};

  //! Show history log modal on click.
  const handleLogClick = () => {
    setSideModal((prev) => ({
      ...prev,
      isShown: true,
      title: '*#*مشاهده تاریخچه تغییرات',
      content: 'history',
    }));
  };

  return (
    <Styled.DocHistoryLogContainer onClick={handleLogClick}>
      <DocItemHeader title="*#*مشاهده تاریخچه تغییرات" />
      <LogItem
        icon={CalendarIcon}
        date={CreationDate}
        user={Creator}
        title={RVDic.CreationDate}
      />
      <LogItem title={RVDic.Update} />
    </Styled.DocHistoryLogContainer>
  );
};

export default SideHistoryLog;
