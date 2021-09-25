import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import DocItemHeader from './DocItemHeader';

const SideSetting = () => {
  return (
    <Styled.DocSettingContainer>
      <DocItemHeader title="تنظیمات انتشار آیتم" />
      <Styled.DocSettingTitle>نمایش آیتم در نتایج جستجو</Styled.DocSettingTitle>
    </Styled.DocSettingContainer>
  );
};

export default SideSetting;
