import CoverPatternUploader from './CoverPatternUploader';
import * as Styled from './RVMainContentSettingStyles';

const RVMainContentSetting = () => {
  return (
    <>
      <Styled.UploaderContainer>
        <Styled.UploaderContainerTitle>
          {'PDF الگوی جلد فایل'}
        </Styled.UploaderContainerTitle>
        <Styled.UploaderWrapper>
          <CoverPatternUploader />
        </Styled.UploaderWrapper>
      </Styled.UploaderContainer>
    </>
  );
};
export default RVMainContentSetting;
