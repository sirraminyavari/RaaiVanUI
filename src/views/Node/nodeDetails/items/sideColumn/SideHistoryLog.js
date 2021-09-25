import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import DocItemHeader from './DocItemHeader';
import LogItem from './LogItem';
import CalendarIcon from 'components/Icons/CalendarIcon/EmptyCalendarIcon';

const SideHistoryLog = () => {
  const handleLoghClick = () => {
    console.log('log item clicked');
  };

  return (
    <Styled.DocHistoryLogContainer onClick={handleLoghClick}>
      <DocItemHeader title="مشاهده تاریخچه تغییرات" />
      <LogItem icon={CalendarIcon} title="تاریخ ایجاد" />
      <LogItem title="بروزرسانی" />
    </Styled.DocHistoryLogContainer>
  );
};

export default SideHistoryLog;
