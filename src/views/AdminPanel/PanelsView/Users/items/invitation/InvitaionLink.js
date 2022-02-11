import * as Styled from './InvitaionStyle';
import InfoCircleIcon from 'components/Icons/InfoCircleIcon/InfoIcon';
import CopyIcon from 'components/Icons/CopyIcon/CopyIcon';
import { useState } from 'react';
import useWindowContext from 'hooks/useWindowContext';
import InfoToast from 'components/toasts/info-toast/InfoToast';

const InvitationLink = () => {
  const { RVDic, RV_RTL } = useWindowContext();
  const [link, setLink] = useState('https://cliqmind.ir/join/eigpylugn8f7');

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      InfoToast({
        type: 'success',
        autoClose: true,
        message: 'لینک کپی شد',
        position: RV_RTL ? 'bottom-left' : 'bottom-right',
      });
    } catch (e) {
      console.log(e);
    }
  };
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
        <Styled.CopyLinkButton onClick={copyLink}>
          <CopyIcon size={16} square={true} />
          <div>{RVDic?.Copy}</div>
        </Styled.CopyLinkButton>
        <Styled.LinkInput value={link} onChange={(e) => {}} disable={true} />
      </Styled.LinkContainer>
    </>
  );
};
export default InvitationLink;
