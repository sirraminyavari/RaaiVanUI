// import { useDispatch } from 'react-redux';
import * as Styled from 'layouts/Navbar/Navbar.styles';
import CheckIcon from 'components/Icons/CheckIcons/DoubleCheck';

const UnreadPlaceholder = () => <div />;

/**
 * Renders a footer component for alerts menu.
 */
const NotificationsHeader = ({ unseenCount }) => {
  // const dispatch = useDispatch();

  //! Marks all alerts as read.
  const handleReadAll = () => {
    // dispatch(setReadAll());
  };

  return (
    <Styled.NotifHeaderContainer>
      {!!unseenCount ? (
        <Styled.UnreadNotifs>{`${unseenCount} اعلان خوانده نشده`}</Styled.UnreadNotifs>
      ) : (
        <UnreadPlaceholder />
      )}
      <Styled.CheckAllNotifsWrapper onClick={handleReadAll}>
        <CheckIcon size={20} />
        <span style={{ margin: '0.2rem', fontSize: '0.9rem' }}>
          خوانده شدن همه
        </span>
      </Styled.CheckAllNotifsWrapper>
    </Styled.NotifHeaderContainer>
  );
};

export default NotificationsHeader;
