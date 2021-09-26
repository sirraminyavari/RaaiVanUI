import { useContext } from 'react';
import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import DocItemHeader from './DocItemHeader';
import { SideContext } from './SideColumn';

const SideSetting = () => {
  const { setSideModal } = useContext(SideContext);

  const handleSettingClick = () => {
    setSideModal((prev) => ({
      ...prev,
      isShown: true,
      title: 'تنظیمات انتشار آیتم',
      content: 'setting',
    }));
  };

  return (
    <Styled.DocSettingContainer onClick={handleSettingClick}>
      <DocItemHeader title="تنظیمات انتشار آیتم" />
      <Styled.DocSettingTitle>نمایش آیتم در نتایج جستجو</Styled.DocSettingTitle>
    </Styled.DocSettingContainer>
  );
};

export default SideSetting;
