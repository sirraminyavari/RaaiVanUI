import { Link } from 'react-router-dom';
import reactStringReplace from 'react-string-replace';
import { useDispatch } from 'react-redux';
import * as Styled from '../Navbar.styles';
import Avatar from 'components/Avatar/Avatar';
import { decodeBase64, getURL } from 'helpers/helpers';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { removeNotification } from 'store/actions/global/NotificationActions';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import { TCV_DEFAULT } from 'constant/CssVariables';

const { GlobalUtilities, RVDic } = window;

const AlertItem = (props) => {
  const { alert } = props;
  const dispatch = useDispatch();

  const onRemoveDone = () => {
    return;
  };

  const onRemoveError = (errorText) => {
    const toastMSG = RVDic.MSG[errorText] || errorText;
    InfoToast({
      type: 'info',
      message: toastMSG,
      autoClose: true,
      toastId: alert?.NotificationID,
    });
  };

  const handleDeleteNotif = () => {
    dispatch(
      removeNotification(alert?.NotificationID, onRemoveDone, onRemoveError)
    );
  };

  return (
    <Styled.AlertItemContainer>
      <Styled.AlertItemCloseIcon onClick={handleDeleteNotif}>
        <CloseIcon style={{ verticalAlign: 'middle' }} />
      </Styled.AlertItemCloseIcon>
      <div>
        <Avatar color="#333" />
      </div>
      <Styled.AlertContentWrapper>
        <Styled.AlertMessageWrapper>
          {renderTitle(alert)}
        </Styled.AlertMessageWrapper>
        <Styled.AlertTimeWrapper>
          {GlobalUtilities.convert_numbers_to_persian(alert.SendDate)}
        </Styled.AlertTimeWrapper>
      </Styled.AlertContentWrapper>
    </Styled.AlertItemContainer>
  );
};

export default AlertItem;

function renderTitle(notification) {
  notification = notification || {};

  let dicEntry =
    ((RVDic.NTFN || {}).SubjectType_Action || {})[
      notification.SubjectType + '_' + notification.Action
    ] || {};
  let title =
    ((dicEntry.Audience || {})[notification.UserStatus] || {}).Notif ||
    dicEntry.Notif;

  if (!title) return null;

  let fullname =
    GlobalUtilities.trim(
      (decodeBase64((notification.Sender || {}).FirstName) || ' ') +
        ' ' +
        (decodeBase64((notification.Sender || {}).LastName) || ' ')
    ) || (notification.Sender || {}).UserName;

  title = reactStringReplace(title, '[user]', (match, index) => (
    <Link
      style={{
        color: TCV_DEFAULT,
        fontWeight: '500',
        textTransform: 'capitalize',
      }}
      key={notification.NotificationID}
      to={getURL('User', { UserID: (notification.Sender || {}).UserID })}>
      {GlobalUtilities.convert_numbers_to_persian(fullname)}
    </Link>
  ));

  let options = {
    question: {
      title: RVDic.Question,
      url: getURL('Question', { QuestionID: notification.RefItemID }),
    },
    answer: {
      title: RVDic.Answer,
      url: getURL('Question', { QuestionID: notification.RefItemID }),
    },
    post: {
      title: RVDic.Post,
      url: getURL('Posts', { PostID: notification.RefItemID }),
    },
    comment: {
      title: RVDic.Comment,
      url: getURL('Posts', { PostID: notification.RefItemID }),
    },
    sent: {
      title: RVDic.Sent_Verb,
      url: getURL('Posts', { PostID: notification.SubjectID }),
    },
    shared: {
      title: RVDic.Shared_Verb,
      url: getURL('Posts', { PostID: notification.RefItemID }),
    },
    mentioned: {
      title: RVDic.Mentioned_Verb,
      url: getURL('Posts', {
        PostID:
          notification.SubjectType === 'Post'
            ? notification.SubjectID
            : notification.RefItemID,
      }),
    },
    subject: {
      title: decodeBase64((notification.Info || {}).NodeType) || RVDic.Subject,
      url: getURL('Node', { NodeID: notification.RefItemID }),
    },
    expertisedomain: {
      title: RVDic.ExpertiseDomain,
      url: getURL('Node', { NodeID: notification.RefItemID }),
    },
    group: {
      title: RVDic.Group,
      url: getURL('Node', { NodeID: notification.RefItemID }),
    },
    registered: {
      title: RVDic.Registered_Verb,
      url: getURL('Node', { NodeID: notification.RefItemID }),
    },
  };

  for (const [key, value] of Object.entries(options)) {
    let theTag = (match, index) => (
      <Link
        style={{ color: TCV_DEFAULT, fontWeight: '500' }}
        key={index}
        to={value.url}>
        {value.title}
      </Link>
    );
    title = reactStringReplace(title, `[${key}]`, theTag);
  }

  return title;
}
