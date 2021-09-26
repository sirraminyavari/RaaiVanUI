import { useContext } from 'react';
import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import DocItemHeader from './DocItemHeader';
import { SideContext } from './SideColumn';

const SideSecurity = () => {
  const { setSideModal } = useContext(SideContext);

  const handleSecurityClick = () => {
    setSideModal((prev) => ({
      ...prev,
      isShown: true,
      title: 'ویرایش سطح محرمانگی',
      content: 'security',
    }));
  };

  return (
    <Styled.DocSettingContainer onClick={handleSecurityClick}>
      <DocItemHeader title="ویرایش سطح محرمانگی" />
      <Styled.DocSettingTitle>
        محرمانه پیشرفته (پیش‌فرض تمپلیت)
      </Styled.DocSettingTitle>
    </Styled.DocSettingContainer>
  );
};

export default SideSecurity;
