/**
 * Renders security section for node page side.
 */
import { useContext } from 'react';
import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import DocItemHeader from './DocItemHeader';
import { SideContext } from './SideColumn';

const { RVDic } = window;
const SideSecurity = () => {
  const { setSideModal } = useContext(SideContext);

  //! Show security modal on click.
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
      <DocItemHeader title={RVDic.EditN.replace('[n]', RVDic.Permissions)} />
      <Styled.DocSettingTitle>
        محرمانه پیشرفته (پیش‌فرض تمپلیت)
      </Styled.DocSettingTitle>
    </Styled.DocSettingContainer>
  );
};

export default SideSecurity;
