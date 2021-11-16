import * as Styled from './InvitaionStyle';
import InfoCircleIcon from '../../../../../../components/Icons/InfoCircleIcon/InfoIcon';
import CopyIcon from '../../../../../../components/Icons/CopyIcon/CopyIcon';

const InvitationLink = () => {
  return (
    <>
      <Styled.Title>
        {'لینک زیر را برای هم‌تیمی جدید خود بفرستید!'}
      </Styled.Title>
      <Styled.SubtitleContainer>
        <InfoCircleIcon size={16} />
        <Styled.SubTitle>
          {
            'با لینک زیر هرکسی می‌تواند عضو تیم شود، عضویت کاربر به مدیر اطلاع داده می‌شود.'
          }
        </Styled.SubTitle>
      </Styled.SubtitleContainer>

      <Styled.LinkContainer>
        <Styled.CopyLinkButton>
          <CopyIcon size={16} square={true} />
          <div>{'کپی'}</div>
        </Styled.CopyLinkButton>
        <Styled.LinkInput value="https://cliqmind.ir/join/eigpylugn8f7" />
      </Styled.LinkContainer>
    </>
  );
};
export default InvitationLink;
